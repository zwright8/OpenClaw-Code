import { createHash, randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const DEFAULT_WORKSPACE_ROOT = '/Users/zacharywright/.openclaw/workspace';

export interface OpenClawMemoryV2Options {
    workspaceRoot?: string;
    ownerChannel?: string;
    ownerTarget?: string;
    now?: () => number;
}

export interface OpenClawMemorySource {
    id: string;
    kind: 'workspace_file' | 'workspace_dir' | 'api' | 'manual';
    path?: string;
    format?: 'markdown' | 'json' | 'text';
    ingestionMode: 'stream' | 'batch' | 'manual';
    freshnessTargetMinutes: number;
    criticality: 'high' | 'medium' | 'low';
    notes: string;
}

export interface OpenClawMemoryStage {
    id: string;
    objective: string;
    modelAlias: string;
    maxLatencySeconds: number;
    outputArtifacts: string[];
    failMode: 'fail_closed' | 'fail_open';
}

export interface OpenClawCronJobSpec {
    name: string;
    schedule: {
        kind: 'every' | 'cron';
        everyMs?: number;
        expr?: string;
        tz?: string;
    };
    sessionTarget: 'isolated';
    payload: {
        kind: 'agentTurn';
        message: string;
        model: string;
        timeoutSeconds: number;
    };
    delivery: {
        mode: 'announce';
        channel: string;
        to: string;
        bestEffort: boolean;
    };
    enabled: boolean;
}

export interface OpenClawMemoryV2Blueprint {
    version: string;
    generatedAt: string;
    workspaceRoot: string;
    storage: {
        engine: 'sqlite';
        dbPath: string;
        schemaVersion: number;
        walEnabled: boolean;
    };
    sources: OpenClawMemorySource[];
    stages: OpenClawMemoryStage[];
    security: {
        bindAddress: '127.0.0.1';
        requireAuthToken: boolean;
        destructiveEndpointsRequireApproval: boolean;
        redactBeforePersist: boolean;
    };
    retrieval: {
        strategy: 'hybrid_keyword_recency_importance';
        topK: number;
        lookbackDays: number;
        citationRequired: boolean;
    };
    retention: {
        hotDays: number;
        warmDays: number;
        archiveDays: number;
        purgeDays: number;
    };
    cron: {
        timezone: string;
        jobs: OpenClawCronJobSpec[];
    };
    rollout: Array<{
        phase: string;
        goal: string;
        gate: string;
    }>;
}

export interface MemoryQueryCandidate {
    memoryId: string;
    summary: string;
    topics: string[];
    importance: number;
    confidence: number;
    createdAtMs: number;
    citationWeight?: number;
}

export interface MemoryQueryContext {
    query: string;
    nowMs?: number;
    recencyHalfLifeHours?: number;
}

function safeNow(now: () => number = Date.now): number {
    const value = Number(now());
    return Number.isFinite(value) ? value : Date.now();
}

function clamp(value: number, min = 0, max = 1): number {
    return Math.max(min, Math.min(max, value));
}

function normalizeTokens(input: string): string[] {
    return [...new Set(
        String(input || '')
            .toLowerCase()
            .replace(/[^a-z0-9\s]+/g, ' ')
            .split(/\s+/)
            .filter((token) => token.length > 1)
    )];
}

export function buildOpenClawMemoryV2SqlSchema(): string {
    return [
        'PRAGMA journal_mode=WAL;',
        'PRAGMA foreign_keys=ON;',
        'CREATE TABLE IF NOT EXISTS memories (',
        '  id TEXT PRIMARY KEY,',
        '  fingerprint TEXT NOT NULL UNIQUE,',
        '  source_id TEXT NOT NULL,',
        '  source_ref TEXT NOT NULL,',
        '  raw_text TEXT NOT NULL,',
        '  summary TEXT NOT NULL,',
        '  topics_json TEXT NOT NULL DEFAULT "[]",',
        '  entities_json TEXT NOT NULL DEFAULT "[]",',
        '  importance REAL NOT NULL CHECK (importance >= 0 AND importance <= 1),',
        '  confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),',
        '  provenance_json TEXT NOT NULL DEFAULT "{}",',
        '  consolidated INTEGER NOT NULL DEFAULT 0,',
        '  created_at_ms INTEGER NOT NULL,',
        '  updated_at_ms INTEGER NOT NULL',
        ');',
        'CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at_ms DESC);',
        'CREATE INDEX IF NOT EXISTS idx_memories_source_id ON memories(source_id);',
        'CREATE TABLE IF NOT EXISTS consolidation_runs (',
        '  id TEXT PRIMARY KEY,',
        '  source_ids_json TEXT NOT NULL,',
        '  summary TEXT NOT NULL,',
        '  insight TEXT NOT NULL,',
        '  confidence REAL NOT NULL CHECK (confidence >= 0 AND confidence <= 1),',
        '  created_at_ms INTEGER NOT NULL',
        ');',
        'CREATE TABLE IF NOT EXISTS query_events (',
        '  id TEXT PRIMARY KEY,',
        '  query TEXT NOT NULL,',
        '  answer TEXT NOT NULL,',
        '  citations_json TEXT NOT NULL DEFAULT "[]",',
        '  latency_ms INTEGER NOT NULL,',
        '  created_at_ms INTEGER NOT NULL',
        ');'
    ].join('\n');
}

export function buildOpenClawMemoryV2CronJobs(options: OpenClawMemoryV2Options = {}): OpenClawCronJobSpec[] {
    const ownerChannel = options.ownerChannel || 'whatsapp';
    const ownerTarget = options.ownerTarget || '+18133343902';

    const baseDelivery = {
        mode: 'announce' as const,
        channel: ownerChannel,
        to: ownerTarget,
        bestEffort: true
    };

    return [
        {
            name: 'memory-v2-ingest-loop',
            schedule: { kind: 'every', everyMs: 5 * 60 * 1000 },
            sessionTarget: 'isolated',
            payload: {
                kind: 'agentTurn',
                model: 'gemini-flash',
                timeoutSeconds: 180,
                message: 'Run Memory V2 ingest loop: scan configured sources, dedupe by fingerprint, and persist structured memories with provenance.'
            },
            delivery: baseDelivery,
            enabled: true
        },
        {
            name: 'memory-v2-consolidation-loop',
            schedule: { kind: 'every', everyMs: 30 * 60 * 1000 },
            sessionTarget: 'isolated',
            payload: {
                kind: 'agentTurn',
                model: 'sonnet',
                timeoutSeconds: 300,
                message: 'Run Memory V2 consolidation pass: process unconsolidated memories, write insights, and mark source records with links.'
            },
            delivery: baseDelivery,
            enabled: true
        },
        {
            name: 'memory-v2-reconsolidation-nightly',
            schedule: { kind: 'cron', expr: '15 3 * * *', tz: 'America/New_York' },
            sessionTarget: 'isolated',
            payload: {
                kind: 'agentTurn',
                model: 'sonnet',
                timeoutSeconds: 600,
                message: 'Run Memory V2 nightly reconsolidation over last 60 days; recompute cross-topic links and compact low-signal clusters.'
            },
            delivery: baseDelivery,
            enabled: true
        },
        {
            name: 'memory-v2-quality-eval',
            schedule: { kind: 'cron', expr: '45 7 * * *', tz: 'America/New_York' },
            sessionTarget: 'isolated',
            payload: {
                kind: 'agentTurn',
                model: 'gpt-mini',
                timeoutSeconds: 420,
                message: 'Run Memory V2 quality evaluation: citation coverage, retrieval precision@k, contradiction rate, and freshness SLA compliance.'
            },
            delivery: baseDelivery,
            enabled: true
        },
        {
            name: 'memory-v2-backup-and-vacuum',
            schedule: { kind: 'cron', expr: '30 4 * * 0', tz: 'America/New_York' },
            sessionTarget: 'isolated',
            payload: {
                kind: 'agentTurn',
                model: 'gpt-mini',
                timeoutSeconds: 420,
                message: 'Run Memory V2 maintenance: create compressed sqlite backup, run VACUUM, and verify restore checksum.'
            },
            delivery: baseDelivery,
            enabled: true
        }
    ];
}

export function buildOpenClawMemoryV2Blueprint(options: OpenClawMemoryV2Options = {}): OpenClawMemoryV2Blueprint {
    const nowMs = safeNow(options.now);
    const workspaceRoot = options.workspaceRoot || DEFAULT_WORKSPACE_ROOT;

    return {
        version: 'memory-v2.0.0',
        generatedAt: new Date(nowMs).toISOString(),
        workspaceRoot,
        storage: {
            engine: 'sqlite',
            dbPath: `${workspaceRoot}/OpenClaw-Code/skills/state/memory-v2.sqlite`,
            schemaVersion: 2,
            walEnabled: true
        },
        sources: [
            {
                id: 'workspace-memory-md',
                kind: 'workspace_file',
                path: `${workspaceRoot}/MEMORY.md`,
                format: 'markdown',
                ingestionMode: 'batch',
                freshnessTargetMinutes: 30,
                criticality: 'high',
                notes: 'Long-term distilled memory profile for Zach and operating constraints.'
            },
            {
                id: 'workspace-daily-logs',
                kind: 'workspace_dir',
                path: `${workspaceRoot}/memory/logs/daily`,
                format: 'markdown',
                ingestionMode: 'stream',
                freshnessTargetMinutes: 10,
                criticality: 'high',
                notes: 'Primary episodic memory feed for daily operations and decisions.'
            },
            {
                id: 'workspace-memory-folders',
                kind: 'workspace_dir',
                path: `${workspaceRoot}/memory/{projects,areas,resources,inbox}`,
                format: 'markdown',
                ingestionMode: 'stream',
                freshnessTargetMinutes: 15,
                criticality: 'medium',
                notes: 'PARA/CODE artifacts and user-curated notes.'
            },
            {
                id: 'openclaw-http-ingest',
                kind: 'api',
                ingestionMode: 'manual',
                freshnessTargetMinutes: 5,
                criticality: 'medium',
                notes: 'Structured ingestion endpoint for ad-hoc captures and external connectors.'
            }
        ],
        stages: [
            {
                id: 'ingest',
                objective: 'Normalize multimodal and text events into structured memory records.',
                modelAlias: 'gemini-flash',
                maxLatencySeconds: 20,
                outputArtifacts: ['memories', 'ingest_events'],
                failMode: 'fail_closed'
            },
            {
                id: 'consolidate',
                objective: 'Build cross-memory links and high-signal summaries every 30 minutes.',
                modelAlias: 'sonnet',
                maxLatencySeconds: 120,
                outputArtifacts: ['consolidation_runs', 'links'],
                failMode: 'fail_closed'
            },
            {
                id: 'reconsolidate',
                objective: 'Nightly replay over historical windows to discover late connections.',
                modelAlias: 'sonnet',
                maxLatencySeconds: 420,
                outputArtifacts: ['reconsolidation_report'],
                failMode: 'fail_open'
            },
            {
                id: 'query',
                objective: 'Hybrid retrieve + synthesize with mandatory citations.',
                modelAlias: 'gpt',
                maxLatencySeconds: 15,
                outputArtifacts: ['query_events'],
                failMode: 'fail_closed'
            },
            {
                id: 'evaluation',
                objective: 'Daily quality checks: citation coverage, contradiction drift, freshness SLA.',
                modelAlias: 'gpt-mini',
                maxLatencySeconds: 180,
                outputArtifacts: ['memory_quality_report'],
                failMode: 'fail_closed'
            }
        ],
        security: {
            bindAddress: '127.0.0.1',
            requireAuthToken: true,
            destructiveEndpointsRequireApproval: true,
            redactBeforePersist: true
        },
        retrieval: {
            strategy: 'hybrid_keyword_recency_importance',
            topK: 24,
            lookbackDays: 120,
            citationRequired: true
        },
        retention: {
            hotDays: 30,
            warmDays: 180,
            archiveDays: 720,
            purgeDays: 1460
        },
        cron: {
            timezone: 'America/New_York',
            jobs: buildOpenClawMemoryV2CronJobs(options)
        },
        rollout: [
            {
                phase: 'phase-1-foundation',
                goal: 'Ship sqlite schema + ingestion worker + auth-gated API on localhost only.',
                gate: 'All ingestion tests pass and no unauthenticated endpoint access.'
            },
            {
                phase: 'phase-2-consolidation',
                goal: 'Enable scheduled consolidation and daily quality reports via OpenClaw cron.',
                gate: 'Consolidation runs complete on schedule and quality report generated for 3 consecutive days.'
            },
            {
                phase: 'phase-3-query-hardening',
                goal: 'Ship hybrid ranking + mandatory citations + contradiction safeguards.',
                gate: 'Citation coverage >= 0.95 and contradiction false-positive rate <= 0.05 on eval set.'
            },
            {
                phase: 'phase-4-ops',
                goal: 'Enable backups, vacuum, restore test, and on-call runbook.',
                gate: 'Weekly backup restore passes and incident runbook drill completed.'
            }
        ]
    };
}

export function dedupeMemoryFingerprint(sourceId: string, rawText: string): string {
    const normalizedSource = String(sourceId || '').trim().toLowerCase();
    const normalizedText = String(rawText || '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLowerCase();

    return createHash('sha256')
        .update(`${normalizedSource}\n${normalizedText}`)
        .digest('hex');
}

export function scoreMemoryForQuery(candidate: MemoryQueryCandidate, context: MemoryQueryContext): number {
    const nowMs = Number.isFinite(context.nowMs) ? Number(context.nowMs) : Date.now();
    const halfLifeHours = Math.max(1, Number(context.recencyHalfLifeHours) || 24 * 7);
    const ageHours = Math.max(0, (nowMs - candidate.createdAtMs) / 3_600_000);
    const recencyScore = Math.pow(0.5, ageHours / halfLifeHours);

    const queryTokens = new Set(normalizeTokens(context.query));
    const topicTokens = new Set(normalizeTokens(candidate.topics.join(' ')));
    let overlap = 0;
    for (const token of queryTokens) {
        if (topicTokens.has(token)) overlap += 1;
    }
    const overlapScore = queryTokens.size > 0 ? overlap / queryTokens.size : 0;

    const importance = clamp(candidate.importance);
    const confidence = clamp(candidate.confidence);
    const citationWeight = clamp(candidate.citationWeight ?? 0.5);

    return Number((
        overlapScore * 0.4
        + recencyScore * 0.23
        + importance * 0.2
        + confidence * 0.12
        + citationWeight * 0.05
    ).toFixed(6));
}

export function buildOpenClawMemoryV2BootstrapTasks({
    fromAgentId = 'agent:memory-planner',
    targetAgentId = 'agent:memory',
    now = Date.now
}: {
    fromAgentId?: string;
    targetAgentId?: string;
    now?: () => number;
} = {}) {
    const nowMs = safeNow(now);
    const baseContext = {
        capability: 'openclaw-memory-v2',
        repo: 'OpenClaw-Code'
    };

    const tasks = [
        {
            task: 'Create and migrate Memory V2 sqlite schema (WAL enabled) with dedupe + provenance fields.',
            priority: 'critical' as const,
            context: {
                ...baseContext,
                deliverable: 'skills/state/memory-v2.sqlite + migration report'
            }
        },
        {
            task: 'Implement ingestion worker for MEMORY.md, memory/logs/daily, and PARA folders with fingerprint dedupe.',
            priority: 'high' as const,
            context: {
                ...baseContext,
                deliverable: 'ingest worker + fixtures'
            }
        },
        {
            task: 'Implement consolidation + reconsolidation workers with cross-link generation and contradiction flags.',
            priority: 'high' as const,
            context: {
                ...baseContext,
                deliverable: 'consolidation worker + evaluation hooks'
            }
        },
        {
            task: 'Wire auth-gated localhost API for ingest/query/status/delete plus audit logging.',
            priority: 'high' as const,
            context: {
                ...baseContext,
                deliverable: 'http api + auth middleware'
            }
        },
        {
            task: 'Ship OpenClaw cron registration payloads and operator runbook for backups, restore checks, and alerts.',
            priority: 'normal' as const,
            context: {
                ...baseContext,
                deliverable: 'cron payloads + docs/runbook'
            }
        }
    ];

    return tasks.map((entry, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targetAgentId,
        priority: entry.priority,
        task: entry.task,
        context: {
            ...entry.context,
            sequence: index + 1
        },
        createdAt: nowMs + index
    }));
}
