import fs from 'fs';
import path from 'path';
import type {
    SkillImprovementCatalog,
    SkillImprovementCatalogEntry,
    SkillImprovementProfile,
    SkillImprovementTier,
    SkillImplementation
} from '../skills/runtime/types.js';

const REPO_ROOT = process.cwd();
const IMPLEMENTATIONS_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'implementations.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'improvements.catalog.json');

type ExternalImplementationBundle = {
    version: number;
    sourceFile: string;
    generatedAt: string;
    count: number;
    entries: SkillImplementation[];
};

const CRITICAL_DOMAIN_KEYWORDS = [
    'health',
    'medical',
    'clinical',
    'security',
    'privacy',
    'rights',
    'compliance',
    'governance',
    'finance',
    'legal',
    'crisis',
    'disaster',
    'infrastructure',
    'infra',
    'safety'
];

const ADVANCED_DOMAIN_KEYWORDS = [
    'publicservice',
    'public service',
    'education',
    'logistics',
    'economic',
    'inclusion',
    'community',
    'culture',
    'planning',
    'research'
];

function asLower(value: unknown): string {
    return String(value || '').trim().toLowerCase();
}

function includesKeyword(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
}

function classifyTier(implementation: SkillImplementation): SkillImprovementTier {
    const domain = asLower(implementation.domain);
    const archetype = asLower(implementation.runtimeProfile?.archetype);

    if (includesKeyword(domain, CRITICAL_DOMAIN_KEYWORDS) || archetype.includes('security') || archetype.includes('incident')) {
        return 'mission_critical';
    }
    if (
        includesKeyword(domain, ADVANCED_DOMAIN_KEYWORDS)
        || archetype.includes('governance')
        || archetype.includes('orchestration')
        || archetype.includes('planning')
    ) {
        return 'advanced';
    }
    return 'foundation';
}

function tierSlo(tier: SkillImprovementTier): string {
    if (tier === 'mission_critical') return '>=99.9% successful runs per 7-day window';
    if (tier === 'advanced') return '>=99.7% successful runs per 7-day window';
    return '>=99.5% successful runs per 7-day window';
}

function tierErrorBudget(tier: SkillImprovementTier): string {
    if (tier === 'mission_critical') return '<=0.1% critical failures per 7-day window';
    if (tier === 'advanced') return '<=0.3% critical failures per 7-day window';
    return '<=0.5% critical failures per 7-day window';
}

function tierParallelism(tier: SkillImprovementTier): number {
    if (tier === 'mission_critical') return 2;
    if (tier === 'advanced') return 3;
    return 4;
}

function tierCycleMinutes(tier: SkillImprovementTier): number {
    if (tier === 'mission_critical') return 15;
    if (tier === 'advanced') return 20;
    return 25;
}

function buildImprovementProfile(implementation: SkillImplementation): SkillImprovementProfile {
    const tier = classifyTier(implementation);
    const title = implementation.title;
    const coreMethod = implementation.runtimeProfile?.coreMethod || 'skill execution';
    const primaryMetric = implementation.runtimeProfile?.kpiFocus?.[0] || 'quality score';
    const secondaryMetrics = Array.isArray(implementation.runtimeProfile?.kpiFocus)
        ? implementation.runtimeProfile.kpiFocus.slice(1)
        : [];
    const approvals = Array.isArray(implementation.runtimeProfile?.orchestration?.approvalGates)
        ? implementation.runtimeProfile.orchestration.approvalGates
        : ['policy-constraint-check', 'human-approval-router'];

    const guardrails: SkillImprovementProfile['guardrails'] = [
        {
            kind: 'quality',
            rule: `Require unit and integration validations before promoting ${title}.`,
            automation: `run-validation:${(implementation.runtimeProfile?.validation?.suites || []).join('+') || 'unit+integration'}`
        },
        {
            kind: 'reliability',
            rule: 'Trigger rollback on critical posture or repeated failures.',
            automation: `rollback:${implementation.runtimeProfile?.orchestration?.rollbackStrategy || 'rollback-to-last-stable-baseline'}`
        }
    ];

    if (tier !== 'foundation') {
        guardrails.push({
            kind: 'compliance',
            rule: 'Require policy and approval gates prior to autonomous deployment.',
            automation: `approval-gates:${approvals.join('+')}`
        });
    }
    if (tier === 'mission_critical') {
        guardrails.push({
            kind: 'safety',
            rule: 'Block production action when risk posture is critical until human oversight review.',
            automation: 'open-incident:human-oversight'
        });
    } else {
        guardrails.push({
            kind: 'cost',
            rule: 'Respect bounded resource pressure and execution budget during scaling.',
            automation: 'budget-guard:resource-pressure-cap'
        });
    }

    return {
        version: 1,
        tier,
        humanUseCases: [
            `Run ${title} as a repeatable production workflow for humans and agents.`,
            `Use ${title} to accelerate decisions while preserving safety, quality, and auditability.`
        ],
        runbook: {
            preflight: [
                'Validate mission scope, contracts, and required inputs.',
                'Verify feature flag posture, dependencies, and approval prerequisites.'
            ],
            execution: [
                `Execute ${coreMethod} workflow with deterministic scoring and trace capture.`,
                'Track posture transitions and preserve reproducible evidence artifacts.'
            ],
            recovery: [
                'Apply rollback strategy if posture is critical or guardrails fail.',
                'Escalate blocked execution to oversight with incident packet and trace references.'
            ],
            handoff: [
                'Publish outcome report, scorecard, and telemetry links.',
                'Queue follow-up tasks for unresolved risks, approvals, or optimization work.'
            ]
        },
        guardrails,
        observability: {
            slo: tierSlo(tier),
            errorBudget: tierErrorBudget(tier),
            alertTriggers: [
                'critical posture exceeds baseline trend',
                'validation regression crosses threshold',
                'hardening or approval bottlenecks persist'
            ]
        },
        automation: {
            autopilotReady: true,
            parallelism: tierParallelism(tier),
            maxCycleMinutes: tierCycleMinutes(tier),
            approvals
        },
        outcomes: {
            primaryMetric,
            secondaryMetrics,
            reviewCadence: tier === 'mission_critical' ? 'daily' : 'weekly'
        }
    };
}

function loadImplementationBundle(filePath: string): ExternalImplementationBundle {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ExternalImplementationBundle;
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.entries)) {
        throw new Error(`Invalid implementation bundle: ${filePath}`);
    }
    return raw;
}

function main() {
    if (!fs.existsSync(IMPLEMENTATIONS_PATH)) {
        throw new Error(`Missing implementations file: ${IMPLEMENTATIONS_PATH}`);
    }

    const bundle = loadImplementationBundle(IMPLEMENTATIONS_PATH);
    const entries: SkillImprovementCatalogEntry[] = bundle.entries.map((implementation) => ({
        skillId: implementation.skillId,
        skillName: implementation.skillName,
        improvementProfile: buildImprovementProfile(implementation)
    }));

    const catalog: SkillImprovementCatalog = {
        version: 1,
        sourceImplementations: 'skills/generated-10000/implementations.json',
        generatedAt: new Date().toISOString(),
        count: entries.length,
        entries
    };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(catalog, null, 2)}\n`);

    console.log(`Improved ${entries.length} external skills.`);
    console.log(`Output: ${OUTPUT_PATH}`);
}

main();
