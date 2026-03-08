import fs from 'fs';
import path from 'path';
import {
    TaskRequest,
    buildTaskRequest,
    executeCapabilityById,
    normalizeCapabilityId
} from '../../swarm-protocol/runtime.js';
import {
    assessSkillImplementationHardening,
    createDefaultSkillHardeningProfile,
    executeSkillImplementation,
    indexSkillDeployabilityByKey,
    isSkillExecutionAllowed,
    loadExternalSkillImplementationById,
    loadSkillImplementationById,
    makeSkillDeployabilityKey,
    normalizeSkillHardeningProfile,
    resolveSkillHardeningPolicy,
    skillExecutionToTasks
} from '../../skills/runtime/index.js';
import type {
    SkillDeployabilityIndex,
    SkillDeployabilityIndexEntry,
    SkillHardeningPolicy,
    SkillHardeningProfile,
    SkillHardeningReport,
    SkillHardeningResolvedPolicy,
    SkillHardeningSource
} from '../../skills/runtime/index.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const PriorityMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const SignalFieldNames = [
    'signalQuality',
    'evidenceCoverage',
    'confidenceHealth',
    'operationalReadiness',
    'harmPotential',
    'resourcePressure',
    'urgency',
    'impactPotential',
    'humanApprovalLatency'
];

const DEFAULT_HARDENING_MIN_SCORE = 82;
const VALID_HARDENING_POLICIES = new Set<SkillHardeningPolicy>([
    'off',
    'report',
    'enforce'
]);

type SkillHardeningAssessment = {
    source: SkillHardeningSource;
    fromIndex: boolean;
    report: SkillHardeningReport | null;
    appliedPolicy: SkillHardeningResolvedPolicy;
    deployable: boolean;
    hardeningGatePass: boolean;
    hardeningScore: number;
    blockingFindings: number;
    reasons: string[];
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}

function safeNow(nowFactory: (() => number) | unknown = Date.now): number {
    if (typeof nowFactory !== 'function') {
        return Date.now();
    }
    const value = Number(nowFactory());
    return Number.isFinite(value) ? value : Date.now();
}

function clampNonNegative(value: unknown): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return 0;
    return numeric;
}

function parseSkillId(value: unknown): number | null {
    const numeric = Number(value);
    if (!Number.isInteger(numeric) || numeric <= 0) return null;
    return numeric;
}

function parseCapabilityId(value: unknown): string | null {
    if (typeof value !== 'string') return null;
    const normalized = normalizeCapabilityId(value);
    return normalized || null;
}

function normalizeHardeningPolicy(value: unknown): SkillHardeningPolicy {
    if (typeof value !== 'string') return 'enforce';
    const normalized = value.trim().toLowerCase() as SkillHardeningPolicy;
    return VALID_HARDENING_POLICIES.has(normalized) ? normalized : 'enforce';
}

function normalizeHardeningMinScore(value: unknown): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return DEFAULT_HARDENING_MIN_SCORE;
    return Math.max(1, Math.min(100, Math.round(numeric)));
}

function normalizeOptionalBoolean(value: unknown): boolean | undefined {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
        const normalized = value.trim().toLowerCase();
        if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
        if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
    }
    return undefined;
}

function parseTaskHardeningOverrides(context: Record<string, unknown>): {
    policy?: SkillHardeningPolicy;
    minDeployableScore?: number;
    strict?: boolean;
} {
    const rawPolicy = context.skillHardeningPolicy ?? context.hardeningPolicy;
    const rawMinScore = context.skillHardeningMinScore ?? context.hardeningMinScore;
    const rawStrict = context.skillHardeningStrict ?? context.hardeningStrict;

    const policy = rawPolicy === undefined
        ? undefined
        : normalizeHardeningPolicy(rawPolicy);
    const minDeployableScore = rawMinScore === undefined
        ? undefined
        : normalizeHardeningMinScore(rawMinScore);
    const strict = normalizeOptionalBoolean(rawStrict);

    return {
        policy,
        minDeployableScore,
        strict
    };
}

function loadDeployabilityIndexMap(
    indexPath: string | null
): Map<string, SkillDeployabilityIndexEntry> {
    if (!indexPath || typeof indexPath !== 'string') {
        return new Map();
    }

    const resolved = path.resolve(indexPath);
    if (!fs.existsSync(resolved)) {
        return new Map();
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8')) as SkillDeployabilityIndex;
        if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.entries)) {
            return new Map();
        }
        return indexSkillDeployabilityByKey(parsed);
    } catch {
        return new Map();
    }
}

function loadHardeningProfile(
    profilePath: string | null,
    {
        policy,
        minDeployableScore
    }: {
        policy: SkillHardeningPolicy;
        minDeployableScore: number;
    }
): SkillHardeningProfile {
    const fallback = createDefaultSkillHardeningProfile({
        policy,
        minDeployableScore,
        strict: true
    });

    if (!profilePath || typeof profilePath !== 'string') {
        return fallback;
    }

    const resolved = path.resolve(profilePath);
    if (!fs.existsSync(resolved)) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8')) as SkillHardeningProfile;
        return normalizeSkillHardeningProfile(parsed, {
            policy,
            minDeployableScore,
            strict: true
        });
    } catch {
        return fallback;
    }
}

function asStringList(value: unknown): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((entry) => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function normalizePriority(value: unknown): 'low' | 'normal' | 'high' | 'critical' {
    if (typeof value === 'string') {
        const upper = value.trim().toUpperCase();
        if (upper in PriorityMap) {
            return PriorityMap[upper as keyof typeof PriorityMap] as 'low' | 'normal' | 'high' | 'critical';
        }
        const lower = value.trim().toLowerCase();
        if (lower === 'low' || lower === 'normal' || lower === 'high' || lower === 'critical') {
            return lower;
        }
    }
    return 'normal';
}

function asStringArray(value: unknown): string[] | undefined {
    if (!Array.isArray(value)) return undefined;
    const items = value
        .filter((entry) => typeof entry === 'string')
        .map((entry) => entry.trim())
        .filter(Boolean);
    return items.length > 0 ? items : undefined;
}

function extractNumericMetric(value: unknown): number | null {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return null;
    return numeric;
}

function buildMetrics(input: Record<string, unknown>): Record<string, number> {
    const metrics: Record<string, number> = {};
    for (const [key, value] of Object.entries(input)) {
        const numeric = extractNumericMetric(value);
        if (numeric === null) continue;
        metrics[key] = numeric;
    }
    return metrics;
}

function hasCapabilityInput(context: Record<string, unknown>): boolean {
    if (isPlainObject(context.capabilityInput)) return true;
    if (isPlainObject(context.inputPayload)) return true;

    const payloadKeys = [
        'entities',
        'contexts',
        'hypotheses',
        'programs',
        'scenarios',
        'missions',
        'portfolio',
        'items',
        'readinessReport',
        'driftReport',
        'incidents',
        'governorDecision'
    ];

    for (const key of payloadKeys) {
        const value = context[key];
        if (Array.isArray(value) && value.length > 0) return true;
        if (isPlainObject(value)) return true;
    }

    return false;
}

function extractCapabilityInput(
    context: Record<string, unknown>,
    requestTask: string
): Record<string, unknown> {
    if (isPlainObject(context.capabilityInput)) {
        return { ...context.capabilityInput };
    }
    if (isPlainObject(context.inputPayload)) {
        return { ...context.inputPayload };
    }

    return {
        ...context,
        task: requestTask
    };
}

function extractSkillExecutionInput(
    context: Record<string, unknown>,
    taskId: string
): Record<string, unknown> {
    const input: Record<string, unknown> = {};

    if (isPlainObject(context.skillInput)) {
        Object.assign(input, context.skillInput);
    }

    if (typeof context.missionId === 'string' && context.missionId.trim()) {
        input.missionId = context.missionId.trim();
    } else {
        input.missionId = taskId;
    }

    for (const field of SignalFieldNames) {
        if (context[field] !== undefined) {
            input[field] = context[field];
        }
    }

    if (isPlainObject(context.requiredSignals)) {
        for (const field of SignalFieldNames) {
            if (input[field] !== undefined) continue;
            if (context.requiredSignals[field] !== undefined) {
                input[field] = context.requiredSignals[field];
            }
        }
    }

    return input;
}

function normalizeFollowupTasks(
    tasks: unknown[],
    {
        nowFactory,
        defaultFrom,
        defaultTarget
    }: {
        nowFactory: () => number;
        defaultFrom: string;
        defaultTarget: string;
    }
): Record<string, unknown>[] {
    if (!Array.isArray(tasks) || tasks.length === 0) return [];

    const normalized: Record<string, unknown>[] = [];

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (!isPlainObject(task)) continue;

        const from = typeof task.from === 'string' && task.from.trim()
            ? task.from
            : defaultFrom;
        const target = typeof task.target === 'string' && task.target.trim()
            ? task.target
            : (typeof task.to === 'string' && task.to.trim() ? task.to : defaultTarget);
        const taskDescription = typeof task.task === 'string' && task.task.trim()
            ? task.task
            : `Follow-up task ${i + 1}`;
        const context = isPlainObject(task.context) ? { ...task.context } : {};
        if (typeof context.planner !== 'string' || !context.planner.trim()) {
            context.planner = 'cognition-core/openclaw-bot';
        }
        const constraints = asStringArray(task.constraints);

        const maybeId = typeof task.id === 'string' && UUID_PATTERN.test(task.id)
            ? task.id
            : undefined;

        try {
            normalized.push(buildTaskRequest({
                id: maybeId,
                from,
                target,
                priority: normalizePriority(task.priority),
                task: taskDescription,
                context,
                constraints,
                createdAt: safeNow(nowFactory) + i
            }));
        } catch {
            // Skip malformed generated follow-up tasks.
        }
    }

    return normalized;
}

export function detectOpenClawRepoRoot(startCwd = process.cwd()): string {
    const candidates = [
        path.resolve(startCwd),
        path.resolve(startCwd, '..')
    ];

    for (const candidate of candidates) {
        const manifestPath = path.join(candidate, 'skills', 'generated', 'skills.manifest.json');
        const swarmProtocolRoot = path.join(candidate, 'swarm-protocol');
        if (fs.existsSync(manifestPath) && fs.existsSync(swarmProtocolRoot)) {
            return candidate;
        }
    }

    return path.resolve(startCwd);
}

export type OpenClawBotExecution = {
    mode: 'skill' | 'skill_action' | 'skill_blueprint' | 'capability' | 'capability_action' | 'generic';
    status: 'success' | 'partial' | 'failure';
    output: string;
    metrics: Record<string, number>;
    artifacts: Array<{ name: string; path: string; type?: string; }>;
    followupTasks: Record<string, unknown>[];
};

export type OpenClawBotOptions = {
    agentId?: string;
    repoRoot?: string;
    nowFactory?: () => number;
    skillHardeningPolicy?: SkillHardeningPolicy;
    skillHardeningMinScore?: number;
    skillDeployabilityIndexPath?: string | null;
    skillHardeningProfilePath?: string | null;
};

function isSkillExecutionSubtask(context: Record<string, unknown>, taskText: string): boolean {
    const markerKeys = [
        'requiredSignals',
        'actions',
        'deliverables',
        'approvalGates',
        'routingTag',
        'rollbackStrategy',
        'score',
        'posture'
    ];

    for (const marker of markerKeys) {
        if (context[marker] !== undefined) {
            return true;
        }
    }

    const normalizedTask = typeof taskText === 'string'
        ? taskText.trim().toLowerCase()
        : '';
    return normalizedTask.startsWith('validate runtime contract')
        || normalizedTask.startsWith('execute ')
        || normalizedTask.startsWith('publish deliverables')
        || normalizedTask.startsWith('escalate ');
}

function buildSkillHardeningFollowupTasks(
    {
        skillId,
        source,
        reasons,
        hardeningScore,
        blockingFindings
    }: {
        skillId: number;
        source: SkillHardeningSource;
        reasons: string[];
        hardeningScore: number;
        blockingFindings: number;
    },
    {
        nowFactory,
        fromAgentId,
        defaultTarget
    }: {
        nowFactory: () => number;
        fromAgentId: string;
        defaultTarget: string;
    }
): Record<string, unknown>[] {
    const reason = reasons[0] || 'Hardening checks failed.';
    const remediationTask = buildTaskRequest({
        from: fromAgentId,
        target: 'agent:skills-hardening',
        priority: 'high',
        task: `Harden skill ${skillId} for deployment`,
        context: {
            planner: 'cognition-core/openclaw-bot',
            skillId,
            hardeningSource: source,
            hardeningScore,
            blockingFindings,
            reason
        },
        createdAt: safeNow(nowFactory)
    });

    const oversightTask = buildTaskRequest({
        from: fromAgentId,
        target: defaultTarget || 'agent:human-oversight',
        priority: 'critical',
        task: `Review blocked skill ${skillId} deployment`,
        context: {
            planner: 'cognition-core/openclaw-bot',
            skillId,
            hardeningSource: source,
            hardeningScore,
            blockingFindings,
            reason
        },
        createdAt: safeNow(nowFactory) + 1
    });

    return [remediationTask, oversightTask];
}

export class OpenClawBot {
    agentId: string;
    repoRoot: string;
    nowFactory: () => number;
    skillHardeningPolicy: SkillHardeningPolicy;
    skillHardeningMinScore: number;
    skillDeployabilityIndexPath: string | null;
    skillHardeningProfilePath: string | null;
    skillHardeningProfile: SkillHardeningProfile;
    skillDeployabilityIndex: Map<string, SkillDeployabilityIndexEntry>;
    skillHardeningReportCache: Map<string, SkillHardeningReport>;

    constructor({
        agentId = 'agent:openclaw-bot',
        repoRoot = detectOpenClawRepoRoot(process.cwd()),
        nowFactory = Date.now,
        skillHardeningPolicy = 'enforce',
        skillHardeningMinScore = DEFAULT_HARDENING_MIN_SCORE,
        skillDeployabilityIndexPath = null,
        skillHardeningProfilePath = null
    }: OpenClawBotOptions = {}) {
        this.agentId = agentId;
        this.repoRoot = path.resolve(repoRoot);
        this.nowFactory = typeof nowFactory === 'function' ? nowFactory : Date.now;
        this.skillHardeningPolicy = normalizeHardeningPolicy(skillHardeningPolicy);
        this.skillHardeningMinScore = normalizeHardeningMinScore(skillHardeningMinScore);

        const defaultIndexPath = path.join(this.repoRoot, 'skills', 'state', 'skills.deployability.index.json');
        const defaultProfilePath = path.join(this.repoRoot, 'skills', 'state', 'skills.hardening.profile.json');
        const configuredIndexPath = typeof skillDeployabilityIndexPath === 'string' && skillDeployabilityIndexPath.trim()
            ? path.resolve(skillDeployabilityIndexPath)
            : (fs.existsSync(defaultIndexPath) ? defaultIndexPath : null);
        const configuredProfilePath = typeof skillHardeningProfilePath === 'string' && skillHardeningProfilePath.trim()
            ? path.resolve(skillHardeningProfilePath)
            : (fs.existsSync(defaultProfilePath) ? defaultProfilePath : null);

        this.skillDeployabilityIndexPath = configuredIndexPath;
        this.skillHardeningProfilePath = configuredProfilePath;
        this.skillDeployabilityIndex = loadDeployabilityIndexMap(configuredIndexPath);
        this.skillHardeningProfile = loadHardeningProfile(configuredProfilePath, {
            policy: this.skillHardeningPolicy,
            minDeployableScore: this.skillHardeningMinScore
        });
        this.skillHardeningReportCache = new Map();
    }

    private getSkillHardeningReport(
        implementation: NonNullable<ReturnType<typeof loadSkillImplementationById>>,
        source: SkillHardeningSource,
        overrides: {
            policy?: SkillHardeningPolicy;
            minDeployableScore?: number;
            strict?: boolean;
        } = {}
    ): SkillHardeningReport {
        const policy = overrides.policy ?? this.skillHardeningPolicy;
        const minDeployableScore = overrides.minDeployableScore ?? this.skillHardeningMinScore;
        const strict = typeof overrides.strict === 'boolean' ? overrides.strict : true;
        const cacheKey = `${source}:${implementation.skillId}:${policy}:${minDeployableScore}:${strict}:${implementation.runtimeProfile?.scoringSeed || ''}`;
        const cached = this.skillHardeningReportCache.get(cacheKey);
        if (cached) return cached;

        const report = assessSkillImplementationHardening(implementation, {
            source,
            policy,
            minDeployableScore,
            profile: this.skillHardeningProfile,
            strict
        });
        this.skillHardeningReportCache.set(cacheKey, report);
        return report;
    }

    private resolveSkillHardeningAssessment(
        implementation: NonNullable<ReturnType<typeof loadSkillImplementationById>>,
        source: SkillHardeningSource,
        overrides: {
            policy?: SkillHardeningPolicy;
            minDeployableScore?: number;
            strict?: boolean;
        } = {}
    ): SkillHardeningAssessment {
        const resolvedPolicy = resolveSkillHardeningPolicy({
            source,
            skillId: implementation.skillId,
            skillName: implementation.skillName,
            domain: implementation.domain,
            domainSlug: implementation.domainSlug,
            archetype: implementation.runtimeProfile?.archetype || ''
        }, {
            profile: this.skillHardeningProfile,
            policy: overrides.policy ?? this.skillHardeningPolicy,
            minDeployableScore: overrides.minDeployableScore ?? this.skillHardeningMinScore,
            strict: typeof overrides.strict === 'boolean' ? overrides.strict : true
        });

        const key = makeSkillDeployabilityKey(source, implementation.skillId);
        const indexed = this.skillDeployabilityIndex.get(key);
        if (indexed) {
            const indexedPolicy = {
                policy: normalizeHardeningPolicy(overrides.policy ?? indexed.policy ?? resolvedPolicy.policy),
                minDeployableScore: normalizeHardeningMinScore(
                    overrides.minDeployableScore ?? indexed.minDeployableScore ?? resolvedPolicy.minDeployableScore
                ),
                strict: typeof overrides.strict === 'boolean'
                    ? overrides.strict
                    : (typeof indexed.strict === 'boolean' ? indexed.strict : resolvedPolicy.strict),
                matchedRuleIds: asStringList(indexed.matchedRuleIds).length > 0
                    ? asStringList(indexed.matchedRuleIds)
                    : resolvedPolicy.matchedRuleIds
            } satisfies SkillHardeningResolvedPolicy;
            const hardeningScore = clampNonNegative(indexed.hardeningScore);
            const hardeningGatePass = typeof indexed.hardeningGatePass === 'boolean'
                ? indexed.hardeningGatePass
                : (clampNonNegative(indexed.blockingFindings) === 0 && hardeningScore >= indexedPolicy.minDeployableScore);
            const indexedDeployable = typeof indexed.deployable === 'boolean'
                ? indexed.deployable
                : hardeningGatePass;
            const deployable = indexedPolicy.policy === 'enforce'
                ? indexedDeployable
                : true;

            return {
                source,
                fromIndex: true,
                report: null,
                appliedPolicy: indexedPolicy,
                deployable,
                hardeningGatePass,
                hardeningScore,
                blockingFindings: clampNonNegative(indexed.blockingFindings),
                reasons: indexed.deployable
                    ? ['Deployability index marks this skill as deployable.']
                    : ['Deployability index marks this skill as non-deployable.']
            };
        }

        const report = this.getSkillHardeningReport(implementation, source, overrides);
        return {
            source,
            fromIndex: false,
            report,
            appliedPolicy: report.appliedPolicy,
            deployable: report.deployable,
            hardeningGatePass: report.hardeningGatePass,
            hardeningScore: report.hardeningScore,
            blockingFindings: report.blockingFindings,
            reasons: report.reasons
        };
    }

    async executeTask(taskRequestPayload: unknown): Promise<OpenClawBotExecution> {
        const startedAt = safeNow(this.nowFactory);

        let request: ReturnType<typeof TaskRequest.parse>;
        try {
            request = TaskRequest.parse(taskRequestPayload);
        } catch (error) {
            const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);
            return {
                mode: 'generic',
                status: 'failure',
                output: `Invalid task request payload: ${error.message}`,
                metrics: { durationMs },
                artifacts: [],
                followupTasks: []
            };
        }

        const context = isPlainObject(request.context) ? request.context : {};

        try {
            const skillId = parseSkillId(context.skillId);
            if (skillId !== null) {
                if (isSkillExecutionSubtask(context, request.task)) {
                    const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);
                    return {
                        mode: 'skill_action',
                        status: 'success',
                        output: `Skill execution task completed for skill ${skillId}: ${request.task}`,
                        metrics: buildMetrics({
                            durationMs,
                            skillId
                        }),
                        artifacts: [
                            {
                                name: `skill-${skillId}-action`,
                                path: `runtime://skills/${skillId}/actions/${safeNow(this.nowFactory)}`,
                                type: 'skill_action'
                            }
                        ],
                        followupTasks: []
                    };
                }

                const skillBlueprint = isPlainObject(context.skillBlueprint)
                    ? context.skillBlueprint
                    : null;

                let implementation = null;
                let implementationSource: SkillHardeningSource = 'manifest';
                let manifestLoadError = null;
                try {
                    implementation = loadSkillImplementationById(skillId, this.repoRoot);
                } catch (error) {
                    manifestLoadError = error;
                }

                if (!implementation) {
                    try {
                        implementation = loadExternalSkillImplementationById(skillId, this.repoRoot);
                        implementationSource = 'external';
                    } catch {
                        implementation = null;
                    }
                }

                if (!implementation && skillBlueprint) {
                    const skillCode = typeof skillBlueprint.code === 'string' && skillBlueprint.code.trim()
                        ? skillBlueprint.code.trim()
                        : `SK-${String(skillId).padStart(5, '0')}`;
                    const skillTitle = typeof skillBlueprint.title === 'string' && skillBlueprint.title.trim()
                        ? skillBlueprint.title.trim()
                        : `Skill ${skillCode}`;
                    const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);

                    return {
                        mode: 'skill_blueprint',
                        status: 'success',
                        output: `Skill blueprint executed for ${skillCode}: ${skillTitle}`,
                        metrics: buildMetrics({
                            durationMs,
                            skillId
                        }),
                        artifacts: [
                            {
                                name: `${skillCode.toLowerCase()}-blueprint`,
                                path: `runtime://skills/${skillCode.toLowerCase()}/blueprint/${safeNow(this.nowFactory)}`,
                                type: 'skill_blueprint'
                            }
                        ],
                        followupTasks: []
                    };
                }

                if (!implementation) {
                    throw manifestLoadError || new Error(`Skill ${skillId} is not available`);
                }

                const hardeningAssessment = this.resolveSkillHardeningAssessment(
                    implementation,
                    implementationSource,
                    parseTaskHardeningOverrides(context)
                );
                const hardeningAllowed = isSkillExecutionAllowed({
                    report: hardeningAssessment.report || {
                        generatedAt: new Date().toISOString(),
                        source: implementationSource,
                        skillId: implementation.skillId,
                        skillName: implementation.skillName,
                        title: implementation.title,
                        deployable: hardeningAssessment.deployable,
                        hardeningGatePass: hardeningAssessment.hardeningGatePass,
                        hardeningScore: hardeningAssessment.hardeningScore,
                        blockingFindings: hardeningAssessment.blockingFindings,
                        checks: [],
                        findings: [],
                        scenarioResults: [],
                        appliedPolicy: hardeningAssessment.appliedPolicy,
                        reasons: hardeningAssessment.reasons
                    }
                });

                if (!hardeningAllowed) {
                    const generatedHardeningTasks = buildSkillHardeningFollowupTasks({
                        skillId: implementation.skillId,
                        source: hardeningAssessment.source,
                        reasons: hardeningAssessment.reasons,
                        hardeningScore: hardeningAssessment.hardeningScore,
                        blockingFindings: hardeningAssessment.blockingFindings
                    }, {
                        nowFactory: this.nowFactory,
                        fromAgentId: this.agentId,
                        defaultTarget: 'agent:human-oversight'
                    });
                    const followupTasks = normalizeFollowupTasks(generatedHardeningTasks, {
                        nowFactory: this.nowFactory,
                        defaultFrom: this.agentId,
                        defaultTarget: 'agent:human-oversight'
                    });
                    const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);
                    const reason = hardeningAssessment.reasons[0] || 'Hardening gate failed.';

                    return {
                        mode: 'skill',
                        status: 'partial',
                        output: `Skill ${implementation.skillName} blocked by hardening gate (${hardeningAssessment.source}, policy ${hardeningAssessment.appliedPolicy.policy}, score ${hardeningAssessment.hardeningScore}). ${reason}`,
                        metrics: buildMetrics({
                            durationMs,
                            skillId,
                            hardeningScore: hardeningAssessment.hardeningScore,
                            hardeningBlockingFindings: hardeningAssessment.blockingFindings,
                            hardeningDeployable: 0,
                            hardeningGatePass: hardeningAssessment.hardeningGatePass ? 1 : 0,
                            hardeningPolicyEnforce: hardeningAssessment.appliedPolicy.policy === 'enforce' ? 1 : 0,
                            hardeningPolicyReport: hardeningAssessment.appliedPolicy.policy === 'report' ? 1 : 0,
                            hardeningPolicyOff: hardeningAssessment.appliedPolicy.policy === 'off' ? 1 : 0,
                            hardeningMinScore: hardeningAssessment.appliedPolicy.minDeployableScore,
                            hardeningStrict: hardeningAssessment.appliedPolicy.strict ? 1 : 0,
                            hardeningRuleMatchCount: hardeningAssessment.appliedPolicy.matchedRuleIds.length,
                            hardeningIndexed: hardeningAssessment.fromIndex ? 1 : 0,
                            followupTaskCount: followupTasks.length
                        }),
                        artifacts: [
                            {
                                name: `skill-${skillId}-hardening`,
                                path: `runtime://skills/${skillId}/hardening/${safeNow(this.nowFactory)}`,
                                type: 'skill_hardening'
                            }
                        ],
                        followupTasks
                    };
                }

                const execution = executeSkillImplementation(
                    implementation,
                    extractSkillExecutionInput(context, request.id)
                );
                const generatedTasks = skillExecutionToTasks(execution, {
                    fromAgentId: this.agentId,
                    toAgentId: request.target || `agent:${execution.domainSlug}-swarm`
                });
                const followupTasks = normalizeFollowupTasks(generatedTasks, {
                    nowFactory: this.nowFactory,
                    defaultFrom: this.agentId,
                    defaultTarget: request.target || `agent:${execution.domainSlug}-swarm`
                });
                const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);

                return {
                    mode: 'skill',
                    status: 'success',
                    output: `Skill ${execution.skillName} executed with posture ${execution.posture} (overall ${execution.scores.overallScore}, hardening ${hardeningAssessment.appliedPolicy.policy}:${hardeningAssessment.hardeningScore}).`,
                    metrics: buildMetrics({
                        durationMs,
                        overallScore: execution.scores.overallScore,
                        riskScore: execution.scores.riskScore,
                        truthScore: execution.scores.truthScore,
                        executionScore: execution.scores.executionScore,
                        safetyScore: execution.scores.safetyScore,
                        impactScore: execution.scores.impactScore,
                        hardeningScore: hardeningAssessment.hardeningScore,
                        hardeningBlockingFindings: hardeningAssessment.blockingFindings,
                        hardeningDeployable: hardeningAssessment.deployable ? 1 : 0,
                        hardeningGatePass: hardeningAssessment.hardeningGatePass ? 1 : 0,
                        hardeningPolicyEnforce: hardeningAssessment.appliedPolicy.policy === 'enforce' ? 1 : 0,
                        hardeningPolicyReport: hardeningAssessment.appliedPolicy.policy === 'report' ? 1 : 0,
                        hardeningPolicyOff: hardeningAssessment.appliedPolicy.policy === 'off' ? 1 : 0,
                        hardeningMinScore: hardeningAssessment.appliedPolicy.minDeployableScore,
                        hardeningStrict: hardeningAssessment.appliedPolicy.strict ? 1 : 0,
                        hardeningRuleMatchCount: hardeningAssessment.appliedPolicy.matchedRuleIds.length,
                        hardeningIndexed: hardeningAssessment.fromIndex ? 1 : 0,
                        followupTaskCount: followupTasks.length
                    }),
                    artifacts: [
                        {
                            name: `skill-${execution.skillId}-execution`,
                            path: `runtime://skills/${execution.skillId}/${execution.runId}`,
                            type: 'skill_execution'
                        },
                        {
                            name: `skill-${execution.skillId}-hardening`,
                            path: hardeningAssessment.fromIndex
                                ? `runtime://skills/${execution.skillId}/hardening/index`
                                : `runtime://skills/${execution.skillId}/hardening/${safeNow(this.nowFactory)}`,
                            type: 'skill_hardening'
                        }
                    ],
                    followupTasks
                };
            }

            const capabilityId = parseCapabilityId(context.capabilityId);
            if (capabilityId) {
                if (hasCapabilityInput(context)) {
                    const capabilityInput = extractCapabilityInput(context, request.task);
                    const capabilityExecution = await executeCapabilityById(
                        capabilityId,
                        capabilityInput,
                        {
                            toTasksOptions: {
                                fromAgentId: this.agentId,
                                defaultTarget: request.target || 'agent:ops'
                            }
                        }
                    );
                    const report = isPlainObject(capabilityExecution.report)
                        ? capabilityExecution.report
                        : {};
                    const summary = isPlainObject(report.summary)
                        ? report.summary
                        : {};
                    const recommendationCount = Array.isArray(report.recommendations)
                        ? report.recommendations.length
                        : 0;
                    const alertCount = Array.isArray(report.alerts)
                        ? report.alerts.length
                        : 0;
                    const followupTasks = normalizeFollowupTasks(capabilityExecution.followupTasks, {
                        nowFactory: this.nowFactory,
                        defaultFrom: this.agentId,
                        defaultTarget: request.target || 'agent:ops'
                    });
                    const posture = typeof summary.posture === 'string'
                        ? summary.posture
                        : 'unknown';
                    const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);

                    return {
                        mode: 'capability',
                        status: 'success',
                        output: `Capability ${capabilityId} evaluated with posture ${posture} and ${recommendationCount} recommendations.`,
                        metrics: buildMetrics({
                            durationMs,
                            recommendationCount,
                            alertCount,
                            followupTaskCount: followupTasks.length,
                            entityCount: summary.entityCount,
                            holdCount: summary.laneCounts?.hold,
                            nextCount: summary.laneCounts?.next,
                            nowCount: summary.laneCounts?.now,
                            avgResidualGap: summary.avgResidualGap,
                            avgProjectedLift: summary.avgProjectedLift,
                            avgSignalCoverage: summary.avgSignalCoverage
                        }),
                        artifacts: [
                            {
                                name: `${capabilityId}-report`,
                                path: `runtime://capabilities/${capabilityId}/${safeNow(this.nowFactory)}`,
                                type: 'capability_report'
                            }
                        ],
                        followupTasks
                    };
                }

                if (typeof context.recommendationType === 'string' && context.recommendationType.trim()) {
                    const recommendationType = context.recommendationType.trim();
                    const entityId = typeof context.entityId === 'string' && context.entityId.trim()
                        ? context.entityId.trim()
                        : 'global';
                    const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);

                    return {
                        mode: 'capability_action',
                        status: 'success',
                        output: `Capability action ${recommendationType} executed for ${capabilityId} (${entityId}).`,
                        metrics: buildMetrics({
                            durationMs,
                            holdCount: context.holdCount,
                            residualGap: context.residualGap,
                            signalCoverage: context.signalCoverage,
                            lowCoverageCount: context.lowCoverageCount
                        }),
                        artifacts: [
                            {
                                name: `${capabilityId}-action`,
                                path: `runtime://capabilities/${capabilityId}/actions/${safeNow(this.nowFactory)}`,
                                type: 'capability_action'
                            }
                        ],
                        followupTasks: []
                    };
                }
            }

            const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);
            return {
                mode: 'generic',
                status: 'success',
                output: `Generic task completed: ${request.task}`,
                metrics: { durationMs },
                artifacts: [],
                followupTasks: []
            };
        } catch (error) {
            const durationMs = clampNonNegative(safeNow(this.nowFactory) - startedAt);
            return {
                mode: 'generic',
                status: 'failure',
                output: `Task execution failed: ${error.message}`,
                metrics: { durationMs },
                artifacts: [],
                followupTasks: []
            };
        }
    }
}
