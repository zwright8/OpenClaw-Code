import { randomUUID } from 'crypto';
import { z } from 'zod';
import { buildTaskRequest } from './task-orchestrator.js';
import { validateWorkflowDefinition } from './workflow-engine.js';

const PlannerInputSchema = z.object({
    objective: z.string().min(3),
    missionId: z.string().optional(),
    context: z.record(z.any()).optional(),
    constraints: z.array(z.string()).optional(),
    preferredTarget: z.string().optional(),
    defaultPriority: z.enum(['low', 'normal', 'high', 'critical']).optional(),
    globalRequiredCapabilities: z.array(z.string()).optional()
});

const PROFILE_IDS = {
    CHANGE: 'change_management',
    INCIDENT: 'incident_response',
    ANALYSIS: 'analysis_reporting',
    GENERAL: 'general_execution'
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function normalizeStringList(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    )];
}

function safeNow() {
    return Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function slug(text) {
    return String(text)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 40) || 'mission';
}

function inferMissionProfile(objective) {
    const text = objective.toLowerCase();

    if (/deploy|release|migration|rollout|cutover|production/.test(text)) {
        return PROFILE_IDS.CHANGE;
    }

    if (/incident|outage|sev|degraded|recover|hotfix/.test(text)) {
        return PROFILE_IDS.INCIDENT;
    }

    if (/report|summary|summarize|analysis|audit|brief|insight/.test(text)) {
        return PROFILE_IDS.ANALYSIS;
    }

    return PROFILE_IDS.GENERAL;
}

function templateForProfile(profileId) {
    if (profileId === PROFILE_IDS.CHANGE) {
        return [
            {
                key: 'assess_impact',
                label: 'Assess Impact',
                priority: 'high',
                requiredCapabilities: ['analysis'],
                riskTags: ['production'],
                estimatedDurationMs: 12_000
            },
            {
                key: 'prepare_rollout',
                label: 'Prepare Rollout Plan',
                dependencies: ['assess_impact'],
                priority: 'high',
                requiredCapabilities: ['operations'],
                riskTags: ['production'],
                estimatedDurationMs: 18_000
            },
            {
                key: 'execute_change',
                label: 'Execute Change',
                dependencies: ['prepare_rollout'],
                priority: 'critical',
                requiredCapabilities: ['operations', 'deploy'],
                riskTags: ['production', 'security'],
                approvalHint: 'required',
                sandboxProfileHint: 'privileged-controlled',
                estimatedDurationMs: 30_000
            },
            {
                key: 'validate_change',
                label: 'Validate Change',
                dependencies: ['execute_change'],
                priority: 'high',
                requiredCapabilities: ['analysis'],
                riskTags: ['production'],
                estimatedDurationMs: 15_000
            },
            {
                key: 'publish_handoff',
                label: 'Publish Handoff',
                dependencies: ['validate_change'],
                priority: 'normal',
                requiredCapabilities: ['reporting'],
                estimatedDurationMs: 8_000
            }
        ];
    }

    if (profileId === PROFILE_IDS.INCIDENT) {
        return [
            {
                key: 'triage_incident',
                label: 'Triage Incident',
                priority: 'critical',
                requiredCapabilities: ['analysis'],
                riskTags: ['production'],
                estimatedDurationMs: 8_000
            },
            {
                key: 'contain_blast_radius',
                label: 'Contain Blast Radius',
                dependencies: ['triage_incident'],
                priority: 'critical',
                requiredCapabilities: ['operations'],
                riskTags: ['production', 'security'],
                approvalHint: 'recommended',
                estimatedDurationMs: 12_000
            },
            {
                key: 'remediate_root_cause',
                label: 'Remediate Root Cause',
                dependencies: ['contain_blast_radius'],
                priority: 'high',
                requiredCapabilities: ['operations'],
                riskTags: ['production'],
                sandboxProfileHint: 'balanced-tooling',
                estimatedDurationMs: 20_000
            },
            {
                key: 'verify_recovery',
                label: 'Verify Recovery',
                dependencies: ['remediate_root_cause'],
                priority: 'high',
                requiredCapabilities: ['analysis'],
                estimatedDurationMs: 10_000
            },
            {
                key: 'postmortem_brief',
                label: 'Generate Postmortem Brief',
                dependencies: ['verify_recovery'],
                priority: 'normal',
                requiredCapabilities: ['reporting'],
                estimatedDurationMs: 8_000
            }
        ];
    }

    if (profileId === PROFILE_IDS.ANALYSIS) {
        return [
            {
                key: 'collect_sources',
                label: 'Collect Sources',
                priority: 'normal',
                requiredCapabilities: ['analysis'],
                estimatedDurationMs: 8_000
            },
            {
                key: 'synthesize_findings',
                label: 'Synthesize Findings',
                dependencies: ['collect_sources'],
                priority: 'normal',
                requiredCapabilities: ['analysis'],
                estimatedDurationMs: 14_000
            },
            {
                key: 'draft_report',
                label: 'Draft Report',
                dependencies: ['synthesize_findings'],
                priority: 'normal',
                requiredCapabilities: ['reporting'],
                estimatedDurationMs: 10_000
            },
            {
                key: 'review_report',
                label: 'Review Report',
                dependencies: ['draft_report'],
                priority: 'normal',
                requiredCapabilities: ['review'],
                estimatedDurationMs: 6_000
            },
            {
                key: 'publish_report',
                label: 'Publish Report',
                dependencies: ['review_report'],
                priority: 'low',
                requiredCapabilities: ['reporting'],
                estimatedDurationMs: 5_000
            }
        ];
    }

    return [
        {
            key: 'discover_scope',
            label: 'Discover Scope',
            priority: 'normal',
            requiredCapabilities: ['analysis'],
            estimatedDurationMs: 6_000
        },
        {
            key: 'plan_execution',
            label: 'Plan Execution',
            dependencies: ['discover_scope'],
            priority: 'normal',
            requiredCapabilities: ['planning'],
            estimatedDurationMs: 8_000
        },
        {
            key: 'execute_plan',
            label: 'Execute Plan',
            dependencies: ['plan_execution'],
            priority: 'high',
            requiredCapabilities: ['operations'],
            estimatedDurationMs: 16_000
        },
        {
            key: 'verify_outcome',
            label: 'Verify Outcome',
            dependencies: ['execute_plan'],
            priority: 'normal',
            requiredCapabilities: ['analysis'],
            estimatedDurationMs: 7_000
        },
        {
            key: 'handoff_results',
            label: 'Handoff Results',
            dependencies: ['verify_outcome'],
            priority: 'low',
            requiredCapabilities: ['reporting'],
            estimatedDurationMs: 5_000
        }
    ];
}

function computeRiskSummary(nodes) {
    const riskTags = new Set();
    let hasCritical = false;
    let hasHigh = false;

    for (const node of nodes) {
        for (const tag of node.riskTags || []) {
            riskTags.add(tag);
        }
        if (node.priority === 'critical') hasCritical = true;
        if (node.priority === 'high') hasHigh = true;
    }

    let level = 'low';
    if (hasCritical || riskTags.has('production') || riskTags.has('security')) {
        level = 'high';
    } else if (hasHigh || riskTags.size > 0) {
        level = 'medium';
    }

    return {
        level,
        tags: [...riskTags].sort(),
        reasons: [
            hasCritical ? 'contains_critical_step' : null,
            hasHigh ? 'contains_high_priority_step' : null,
            riskTags.has('production') ? 'production_risk' : null,
            riskTags.has('security') ? 'security_risk' : null
        ].filter(Boolean)
    };
}

export function compileMissionPlan(inputPayload) {
    const input = PlannerInputSchema.parse(inputPayload);
    const objective = input.objective.trim();
    const profileId = inferMissionProfile(objective);
    const missionId = input.missionId || `mission-${slug(objective)}-${randomUUID().slice(0, 8)}`;
    const template = templateForProfile(profileId);
    const globalCaps = normalizeStringList(input.globalRequiredCapabilities);
    const createdAt = safeNow();

    const nodes = template.map((step, index) => {
        const id = `${step.key}`;
        const requiredCapabilities = [...new Set([
            ...normalizeStringList(step.requiredCapabilities),
            ...globalCaps
        ])];

        return {
            id,
            label: step.label,
            task: `${step.label}: ${objective}`,
            dependencies: normalizeStringList(step.dependencies),
            priority: step.priority || input.defaultPriority || 'normal',
            target: input.preferredTarget || undefined,
            requiredCapabilities,
            riskTags: normalizeStringList(step.riskTags),
            approvalHint: step.approvalHint || null,
            sandboxProfileHint: step.sandboxProfileHint || null,
            estimatedDurationMs: step.estimatedDurationMs || 10_000,
            context: {
                missionId,
                missionProfile: profileId,
                missionStep: step.key,
                missionStepIndex: index,
                objective,
                ...(input.context || {}),
                missionConstraints: input.constraints || []
            }
        };
    });

    const edges = [];
    for (const node of nodes) {
        for (const dep of node.dependencies) {
            edges.push({
                from: dep,
                to: node.id
            });
        }
    }

    const estimatedDurationMs = nodes.reduce(
        (acc, node) => acc + safeNumber(node.estimatedDurationMs),
        0
    );

    const missionPlan = {
        missionId,
        objective,
        profileId,
        createdAt,
        riskSummary: computeRiskSummary(nodes),
        estimatedDurationMs,
        nodes,
        edges
    };

    const workflow = missionPlanToWorkflowDefinition(missionPlan);
    validateWorkflowDefinition(workflow);

    return missionPlan;
}

export function missionPlanToWorkflowDefinition(missionPlan, {
    workflowId = null
} = {}) {
    if (!missionPlan || typeof missionPlan !== 'object' || !Array.isArray(missionPlan.nodes)) {
        throw new Error('missionPlanToWorkflowDefinition requires mission plan with nodes');
    }

    const workflow = {
        id: workflowId || missionPlan.missionId,
        nodes: missionPlan.nodes.map((node) => ({
            id: node.id,
            task: node.task,
            target: node.target,
            priority: node.priority,
            context: {
                ...(node.context || {}),
                riskTags: node.riskTags,
                approvalHint: node.approvalHint,
                sandboxProfileHint: node.sandboxProfileHint
            },
            dependencies: node.dependencies,
            requiredCapabilities: node.requiredCapabilities
        }))
    };

    return validateWorkflowDefinition(workflow);
}

export function missionPlanToTaskRequests(missionPlan, {
    fromAgentId = 'agent:mission-planner',
    createdAt = Date.now()
} = {}) {
    if (!missionPlan || typeof missionPlan !== 'object' || !Array.isArray(missionPlan.nodes)) {
        throw new Error('missionPlanToTaskRequests requires mission plan with nodes');
    }

    return missionPlan.nodes.map((node, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: node.target,
        priority: node.priority,
        task: node.task,
        context: clone(node.context || {}),
        constraints: missionPlan.constraints || [],
        createdAt: safeNumber(createdAt) + index
    }));
}

export const __missionInternals = {
    inferMissionProfile,
    templateForProfile,
    computeRiskSummary
};
