import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const DefaultSandboxProfiles = [
    {
        id: 'strict-readonly',
        allowedCapabilities: ['analysis', 'read', 'reasoning'],
        blockedRiskTags: ['production', 'security'],
        requiresEscalation: false
    },
    {
        id: 'balanced-tooling',
        allowedCapabilities: ['analysis', 'reporting', 'review', 'planning', 'web-search'],
        blockedRiskTags: [],
        requiresEscalation: false
    },
    {
        id: 'privileged-controlled',
        allowedCapabilities: ['operations', 'deploy', 'filesystem_write', 'credential_access', 'destructive_shell'],
        blockedRiskTags: [],
        requiresEscalation: true
    }
];

const PriorityToTaskPriority = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const HighRiskApprovalTags = new Set(['production', 'security', 'legal', 'finance', 'financial']);
const HealthyAgentStatuses = new Set(['idle', 'busy']);

const RemediationPriority = {
    missing_capability: 'P1',
    missing_sandbox_profile: 'P1',
    sandbox_blocked_risk_tag: 'P1',
    sandbox_disallowed_capability: 'P1',
    approval_policy_error: 'P1',
    approval_reviewer_unset: 'P2',
    budget_overrun: 'P2',
    duration_overrun: 'P2'
};

const RemediationTargetMap = {
    missing_capability: 'agent:skills',
    missing_sandbox_profile: 'agent:platform',
    sandbox_blocked_risk_tag: 'agent:platform',
    sandbox_disallowed_capability: 'agent:platform',
    approval_policy_error: 'agent:ops',
    approval_reviewer_unset: 'agent:ops',
    budget_overrun: 'agent:finance',
    duration_overrun: 'agent:planning'
};

function clone(value) {
    return JSON.parse(JSON.stringify(value));
}

function safeNow(nowFn) {
    const value = Number(nowFn());
    return Number.isFinite(value) ? value : Date.now();
}

function safeNumber(value, fallback = 0) {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
}

function normalizeStringList(value, { lower = false } = {}) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((item) => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => (lower ? item.toLowerCase() : item))
    )];
}

function normalizePriority(priority) {
    const candidate = typeof priority === 'string' ? priority.trim().toLowerCase() : '';
    if (['low', 'normal', 'high', 'critical'].includes(candidate)) {
        return candidate;
    }
    return 'normal';
}

function normalizeMissionPlan(missionPlanPayload, { defaultNodeDurationMs = 10_000 } = {}) {
    if (!missionPlanPayload || typeof missionPlanPayload !== 'object') {
        throw new Error('assessMissionReadiness requires missionPlan object');
    }

    const missionId = typeof missionPlanPayload.missionId === 'string'
        ? missionPlanPayload.missionId
        : `mission-${randomUUID().slice(0, 8)}`;
    const objective = typeof missionPlanPayload.objective === 'string'
        ? missionPlanPayload.objective
        : missionId;
    const sourceNodes = Array.isArray(missionPlanPayload.nodes)
        ? missionPlanPayload.nodes
        : [];

    if (sourceNodes.length === 0) {
        throw new Error('missionPlan.nodes must be a non-empty array');
    }

    const nodes = sourceNodes.map((node, index) => {
        const context = node?.context && typeof node.context === 'object'
            ? clone(node.context)
            : {};
        const requiredCapabilities = normalizeStringList(
            node?.requiredCapabilities ?? context.requiredCapabilities,
            { lower: true }
        );
        const riskTags = normalizeStringList(
            node?.riskTags ?? context.riskTags,
            { lower: true }
        );
        const approvalHintRaw = typeof node?.approvalHint === 'string'
            ? node.approvalHint.trim().toLowerCase()
            : (typeof context.approvalHint === 'string'
                ? context.approvalHint.trim().toLowerCase()
                : null);
        const sandboxProfileHint = typeof node?.sandboxProfileHint === 'string'
            ? node.sandboxProfileHint.trim()
            : (typeof context.sandboxProfileHint === 'string'
                ? context.sandboxProfileHint.trim()
                : null);

        return {
            id: typeof node?.id === 'string' && node.id.trim()
                ? node.id.trim()
                : `node-${index + 1}`,
            task: typeof node?.task === 'string' && node.task.trim()
                ? node.task.trim()
                : `Step ${index + 1}: ${objective}`,
            priority: normalizePriority(node?.priority),
            target: typeof node?.target === 'string' && node.target.trim()
                ? node.target.trim()
                : null,
            requiredCapabilities,
            riskTags,
            approvalHint: ['required', 'recommended'].includes(approvalHintRaw)
                ? approvalHintRaw
                : null,
            sandboxProfileHint: sandboxProfileHint || null,
            estimatedDurationMs: safeNumber(
                node?.estimatedDurationMs ?? context.estimatedDurationMs,
                defaultNodeDurationMs
            ),
            context
        };
    });

    return {
        missionId,
        objective,
        profileId: missionPlanPayload.profileId || null,
        createdAt: safeNumber(missionPlanPayload.createdAt, Date.now()),
        nodes
    };
}

function normalizeAgents(agentPayloads) {
    const items = Array.isArray(agentPayloads) ? agentPayloads : [];
    return items.map((agent) => ({
        id: agent?.id || agent?.agentId || 'unknown',
        status: typeof agent?.status === 'string' ? agent.status : 'unknown',
        capabilities: normalizeStringList(agent?.capabilities, { lower: true })
    }));
}

function normalizeSkills(skillPayloads) {
    const items = Array.isArray(skillPayloads) ? skillPayloads : [];
    return items.map((skill) => ({
        id: skill?.id || 'skill:unknown',
        endpointAgentId: skill?.endpointAgentId || null,
        status: typeof skill?.status === 'string' ? skill.status.toLowerCase() : 'active',
        capabilities: normalizeStringList(skill?.capabilities, { lower: true }),
        costUsdPerTask: safeNumber(skill?.costUsdPerTask, NaN),
        qualityScore: safeNumber(skill?.qualityScore, 0.7),
        verification: {
            attempts: safeNumber(skill?.verification?.attempts),
            successes: safeNumber(skill?.verification?.successes),
            failures: safeNumber(skill?.verification?.failures)
        }
    }));
}

function normalizeSandboxProfiles(profilePayloads) {
    const source = Array.isArray(profilePayloads) && profilePayloads.length > 0
        ? profilePayloads
        : DefaultSandboxProfiles;
    const map = new Map();

    for (const payload of source) {
        const profile = typeof payload === 'string'
            ? { id: payload }
            : (payload || {});
        if (!profile.id || typeof profile.id !== 'string') continue;

        map.set(profile.id, {
            id: profile.id,
            allowedCapabilities: normalizeStringList(profile.allowedCapabilities, { lower: true }),
            blockedRiskTags: normalizeStringList(profile.blockedRiskTags, { lower: true }),
            requiresEscalation: profile.requiresEscalation === true
        });
    }

    return map;
}

function inferRequiredSandboxProfile(node) {
    if (node.sandboxProfileHint) return node.sandboxProfileHint;

    const caps = new Set(node.requiredCapabilities || []);
    const risks = new Set(node.riskTags || []);

    if (
        caps.has('deploy')
        || caps.has('production_deploy')
        || caps.has('destructive_shell')
        || caps.has('filesystem_write')
        || caps.has('credential_access')
        || caps.has('operations')
    ) {
        return 'privileged-controlled';
    }

    if (risks.has('production') || risks.has('security') || node.priority === 'critical') {
        return 'strict-readonly';
    }

    if (caps.has('web-search') || node.context?.needsNetwork === true) {
        return 'balanced-tooling';
    }

    return null;
}

function estimateNodeCost(node, activeSkills, defaultCostUsdPerNode) {
    const caps = node.requiredCapabilities || [];
    if (caps.length === 0) return defaultCostUsdPerNode;

    const fullSkillCosts = activeSkills
        .filter((skill) => caps.every((cap) => skill.capabilities.includes(cap)))
        .map((skill) => skill.costUsdPerTask)
        .filter((value) => Number.isFinite(value) && value >= 0);
    if (fullSkillCosts.length > 0) {
        return Math.min(...fullSkillCosts);
    }

    let estimated = 0;
    for (const cap of caps) {
        const capabilityCosts = activeSkills
            .filter((skill) => skill.capabilities.includes(cap))
            .map((skill) => skill.costUsdPerTask)
            .filter((value) => Number.isFinite(value) && value >= 0);
        if (capabilityCosts.length > 0) {
            estimated += Math.min(...capabilityCosts);
        } else {
            estimated += defaultCostUsdPerNode / Math.max(1, caps.length);
        }
    }

    return estimated || defaultCostUsdPerNode;
}

function defaultApprovalDecision(node) {
    const highRisk = (node.riskTags || []).some((tag) => HighRiskApprovalTags.has(tag));
    const required = node.approvalHint === 'required'
        || node.priority === 'critical'
        || highRisk;

    return {
        required,
        reviewerGroup: required ? 'human-review' : null,
        reason: required
            ? (node.approvalHint === 'required'
                ? 'approval_hint_required'
                : (highRisk ? 'high_risk_tag' : 'critical_priority'))
            : null,
        matchedRules: required ? ['default_rule'] : []
    };
}

function mapTaskPriority(priority) {
    const normalized = normalizePriority(priority);
    if (normalized === 'critical') return 'critical';
    if (normalized === 'high') return 'high';
    if (normalized === 'low') return 'low';
    return 'normal';
}

function scoreReadiness({
    missingCapabilityCount,
    sandboxBlockingCount,
    approvalErrorCount,
    approvalReviewerGapCount,
    approvalRequiredCount,
    budgetExceeded,
    durationExceeded
}) {
    let score = 100;
    score -= missingCapabilityCount * 9;
    score -= sandboxBlockingCount * 12;
    score -= approvalErrorCount * 14;
    score -= approvalReviewerGapCount * 8;
    score -= approvalRequiredCount;
    if (budgetExceeded) score -= 14;
    if (durationExceeded) score -= 10;
    return Math.max(0, Math.min(100, Math.round(score)));
}

function priorityValue(priority) {
    const value = RemediationPriority[priority] || priority;
    const order = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return order[value] ?? 9;
}

function buildRemediationActions({
    missionPlan,
    capabilityCoverage,
    sandboxCoverage,
    approvalCoverage,
    budgetCheck,
    durationCheck
}) {
    const dedup = new Map();
    const actions = [];

    const upsert = (action) => {
        const key = [
            action.code,
            action.nodeId || '',
            action.capability || '',
            action.profileId || ''
        ].join('|');
        if (dedup.has(key)) return;
        const priority = RemediationPriority[action.code] || 'P2';
        const row = {
            id: `remediation-${randomUUID().slice(0, 8)}`,
            priority,
            ...action
        };
        dedup.set(key, row);
        actions.push(row);
    };

    for (const coverage of capabilityCoverage) {
        for (const capability of coverage.missingCapabilities) {
            upsert({
                code: 'missing_capability',
                nodeId: coverage.nodeId,
                capability,
                title: `Provision capability "${capability}"`,
                description: `Mission step ${coverage.nodeId} requires "${capability}" but no healthy provider exists.`,
                context: {
                    missionId: missionPlan.missionId,
                    nodeId: coverage.nodeId,
                    capability
                }
            });
        }
    }

    for (const coverage of sandboxCoverage) {
        if (!coverage.available && coverage.requiredProfileId) {
            upsert({
                code: 'missing_sandbox_profile',
                nodeId: coverage.nodeId,
                profileId: coverage.requiredProfileId,
                title: `Register sandbox profile "${coverage.requiredProfileId}"`,
                description: `Mission step ${coverage.nodeId} requires sandbox profile "${coverage.requiredProfileId}".`,
                context: {
                    missionId: missionPlan.missionId,
                    nodeId: coverage.nodeId,
                    requiredProfileId: coverage.requiredProfileId
                }
            });
        }

        for (const riskTag of coverage.blockedRiskTags) {
            upsert({
                code: 'sandbox_blocked_risk_tag',
                nodeId: coverage.nodeId,
                profileId: coverage.requiredProfileId,
                title: `Resolve sandbox risk-tag block (${riskTag})`,
                description: `Profile "${coverage.requiredProfileId}" blocks risk tag "${riskTag}" required by ${coverage.nodeId}.`,
                context: {
                    missionId: missionPlan.missionId,
                    nodeId: coverage.nodeId,
                    riskTag
                }
            });
        }

        for (const capability of coverage.disallowedCapabilities) {
            upsert({
                code: 'sandbox_disallowed_capability',
                nodeId: coverage.nodeId,
                profileId: coverage.requiredProfileId,
                capability,
                title: `Allow capability "${capability}" in sandbox profile`,
                description: `Profile "${coverage.requiredProfileId}" disallows capability "${capability}" for step ${coverage.nodeId}.`,
                context: {
                    missionId: missionPlan.missionId,
                    nodeId: coverage.nodeId,
                    capability
                }
            });
        }
    }

    for (const coverage of approvalCoverage) {
        if (coverage.policyError) {
            upsert({
                code: 'approval_policy_error',
                nodeId: coverage.nodeId,
                title: 'Fix approval policy execution error',
                description: `Approval policy failed for ${coverage.nodeId}: ${coverage.policyError}`,
                context: {
                    missionId: missionPlan.missionId,
                    nodeId: coverage.nodeId,
                    policyError: coverage.policyError
                }
            });
        } else if (coverage.required && !coverage.reviewerGroup) {
            upsert({
                code: 'approval_reviewer_unset',
                nodeId: coverage.nodeId,
                title: 'Assign reviewer group for approval-required step',
                description: `Step ${coverage.nodeId} requires approval but no reviewerGroup was provided.`,
                context: {
                    missionId: missionPlan.missionId,
                    nodeId: coverage.nodeId
                }
            });
        }
    }

    if (!budgetCheck.ok) {
        upsert({
            code: 'budget_overrun',
            title: 'Reduce projected mission cost',
            description: `Projected cost ${budgetCheck.projectedCostUsd} exceeds budget ${budgetCheck.maxEstimatedCostUsd}.`,
            context: {
                missionId: missionPlan.missionId,
                projectedCostUsd: budgetCheck.projectedCostUsd,
                maxEstimatedCostUsd: budgetCheck.maxEstimatedCostUsd,
                deltaUsd: budgetCheck.deltaUsd
            }
        });
    }

    if (!durationCheck.ok) {
        upsert({
            code: 'duration_overrun',
            title: 'Reduce projected mission duration',
            description: `Projected duration ${durationCheck.projectedDurationMs}ms exceeds limit ${durationCheck.maxEstimatedDurationMs}ms.`,
            context: {
                missionId: missionPlan.missionId,
                projectedDurationMs: durationCheck.projectedDurationMs,
                maxEstimatedDurationMs: durationCheck.maxEstimatedDurationMs,
                deltaMs: durationCheck.deltaMs
            }
        });
    }

    return actions.sort((a, b) => {
        const p = priorityValue(a.priority) - priorityValue(b.priority);
        if (p !== 0) return p;
        return String(a.code).localeCompare(String(b.code));
    });
}

export function assessMissionReadiness(inputPayload, {
    approvalPolicy = null,
    defaultCostUsdPerNode = 3,
    defaultNodeDurationMs = 10_000
} = {}) {
    const missionPlan = normalizeMissionPlan(inputPayload?.missionPlan, {
        defaultNodeDurationMs
    });
    const agents = normalizeAgents(inputPayload?.agents);
    const skills = normalizeSkills(inputPayload?.skills);
    const sandboxProfiles = normalizeSandboxProfiles(inputPayload?.sandboxProfiles);
    const activeSkills = skills.filter((skill) => skill.status !== 'retired' && skill.status !== 'disabled');
    const healthyAgents = agents.filter((agent) => HealthyAgentStatuses.has(String(agent.status).toLowerCase()));

    const capabilityCoverage = missionPlan.nodes.map((node) => {
        const coverage = (node.requiredCapabilities || []).map((capability) => {
            const matchingAgents = healthyAgents
                .filter((agent) => agent.capabilities.includes(capability))
                .map((agent) => agent.id);
            const matchingSkills = activeSkills
                .filter((skill) => skill.capabilities.includes(capability))
                .map((skill) => skill.id);

            return {
                capability,
                matchingAgents,
                matchingSkills
            };
        });

        const missingCapabilities = coverage
            .filter((row) => row.matchingAgents.length === 0 && row.matchingSkills.length === 0)
            .map((row) => row.capability);

        return {
            nodeId: node.id,
            requiredCapabilities: [...node.requiredCapabilities],
            coverage,
            missingCapabilities,
            ready: missingCapabilities.length === 0
        };
    });

    const approvalPolicyFn = typeof approvalPolicy === 'function'
        ? approvalPolicy
        : (typeof inputPayload?.approvalPolicy === 'function'
            ? inputPayload.approvalPolicy
            : null);

    const approvalCoverage = missionPlan.nodes.map((node, index) => {
        const syntheticTask = buildTaskRequest({
            id: randomUUID(),
            from: 'agent:mission-readiness',
            target: node.target || undefined,
            priority: mapTaskPriority(node.priority),
            task: node.task,
            context: {
                ...clone(node.context || {}),
                riskTags: [...node.riskTags],
                requiredCapabilities: [...node.requiredCapabilities],
                requiresHumanApproval: node.approvalHint === 'required'
            },
            createdAt: missionPlan.createdAt + index
        });

        let decision = null;
        let policyError = null;

        if (approvalPolicyFn) {
            try {
                decision = approvalPolicyFn(syntheticTask);
            } catch (error) {
                policyError = error instanceof Error ? error.message : String(error);
            }
        } else {
            decision = defaultApprovalDecision(node);
        }

        const required = policyError ? false : decision?.required === true;
        const reviewerGroup = policyError ? null : (decision?.reviewerGroup || null);

        return {
            nodeId: node.id,
            required,
            reviewerGroup,
            reason: policyError ? null : (decision?.reason || null),
            matchedRules: policyError ? [] : normalizeStringList(decision?.matchedRules || []),
            policyError
        };
    });

    const sandboxCoverage = missionPlan.nodes.map((node) => {
        const requiredProfileId = inferRequiredSandboxProfile(node);
        const profile = requiredProfileId ? sandboxProfiles.get(requiredProfileId) : null;
        const available = requiredProfileId ? Boolean(profile) : true;

        const blockedRiskTags = profile
            ? (node.riskTags || []).filter((tag) => profile.blockedRiskTags.includes(tag))
            : [];

        const disallowedCapabilities = profile && profile.allowedCapabilities.length > 0
            ? (node.requiredCapabilities || []).filter((capability) => !profile.allowedCapabilities.includes(capability))
            : [];

        return {
            nodeId: node.id,
            requiredProfileId,
            available,
            blockedRiskTags,
            disallowedCapabilities,
            requiresEscalation: profile ? profile.requiresEscalation === true : false,
            ready: available && blockedRiskTags.length === 0 && disallowedCapabilities.length === 0
        };
    });

    const projectedCostUsd = Number(missionPlan.nodes.reduce(
        (acc, node) => acc + estimateNodeCost(node, activeSkills, safeNumber(defaultCostUsdPerNode, 3)),
        0
    ).toFixed(4));
    const projectedDurationMs = missionPlan.nodes.reduce(
        (acc, node) => acc + safeNumber(node.estimatedDurationMs, defaultNodeDurationMs),
        0
    );

    const maxEstimatedCostUsd = Number.isFinite(Number(inputPayload?.maxEstimatedCostUsd))
        ? Number(inputPayload.maxEstimatedCostUsd)
        : null;
    const maxEstimatedDurationMs = Number.isFinite(Number(inputPayload?.maxEstimatedDurationMs))
        ? Number(inputPayload.maxEstimatedDurationMs)
        : null;

    const budgetCheck = {
        ok: maxEstimatedCostUsd === null || projectedCostUsd <= maxEstimatedCostUsd,
        projectedCostUsd,
        maxEstimatedCostUsd,
        deltaUsd: maxEstimatedCostUsd === null
            ? 0
            : Number((projectedCostUsd - maxEstimatedCostUsd).toFixed(4))
    };

    const durationCheck = {
        ok: maxEstimatedDurationMs === null || projectedDurationMs <= maxEstimatedDurationMs,
        projectedDurationMs,
        maxEstimatedDurationMs,
        deltaMs: maxEstimatedDurationMs === null ? 0 : projectedDurationMs - maxEstimatedDurationMs
    };

    const missingCapabilityCount = capabilityCoverage.reduce(
        (acc, row) => acc + row.missingCapabilities.length,
        0
    );
    const sandboxBlockingCount = sandboxCoverage.filter(
        (row) => !row.ready
    ).length;
    const approvalErrorCount = approvalCoverage.filter(
        (row) => Boolean(row.policyError)
    ).length;
    const approvalReviewerGapCount = approvalCoverage.filter(
        (row) => row.required && !row.reviewerGroup
    ).length;
    const approvalRequiredCount = approvalCoverage.filter(
        (row) => row.required
    ).length;
    const budgetExceeded = !budgetCheck.ok;
    const durationExceeded = !durationCheck.ok;

    const readinessScore = scoreReadiness({
        missingCapabilityCount,
        sandboxBlockingCount,
        approvalErrorCount,
        approvalReviewerGapCount,
        approvalRequiredCount,
        budgetExceeded,
        durationExceeded
    });

    let status = 'ready';
    if (missingCapabilityCount > 0 || sandboxBlockingCount > 0 || approvalErrorCount > 0) {
        status = 'blocked';
    } else if (budgetExceeded || durationExceeded || approvalRequiredCount > 0 || readinessScore < 90) {
        status = 'needs_attention';
    }

    const remediation = buildRemediationActions({
        missionPlan,
        capabilityCoverage,
        sandboxCoverage,
        approvalCoverage,
        budgetCheck,
        durationCheck
    });

    return {
        at: Date.now(),
        missionId: missionPlan.missionId,
        objective: missionPlan.objective,
        status,
        readinessScore,
        summary: {
            nodeCount: missionPlan.nodes.length,
            missingCapabilityCount,
            sandboxGapCount: sandboxBlockingCount,
            approvalRequiredCount,
            approvalErrorCount,
            projectedCostUsd,
            projectedDurationMs
        },
        checks: {
            capabilityCoverage,
            approvalCoverage,
            sandboxCoverage,
            budget: budgetCheck,
            duration: durationCheck
        },
        remediation
    };
}

export function buildReadinessTasks(reportPayload, {
    fromAgentId = 'agent:mission-readiness',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('buildReadinessTasks requires readiness report object');
    }

    const remediation = Array.isArray(reportPayload.remediation)
        ? reportPayload.remediation
        : [];
    const now = safeNow(Date.now);
    const targets = {
        ...RemediationTargetMap,
        ...(targetMap || {})
    };

    return remediation.map((item, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[item.code] || defaultTarget,
        priority: PriorityToTaskPriority[item.priority] || 'normal',
        task: `[${item.priority}] Mission readiness remediation: ${item.title}`,
        context: {
            readinessStatus: reportPayload.status,
            missionId: reportPayload.missionId,
            remediationId: item.id,
            remediationCode: item.code,
            remediationContext: clone(item.context || {})
        },
        createdAt: now + index
    }));
}

export class MissionReadinessGate {
    constructor({
        localAgentId = 'agent:mission-readiness',
        now = Date.now,
        maxHistory = 200
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 200;
        this.history = [];
    }

    assess(inputPayload, options = {}) {
        const report = assessMissionReadiness(inputPayload, options);
        const stamped = {
            ...report,
            at: safeNow(this.now)
        };
        this.history.push(stamped);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(stamped);
    }

    buildRemediationTasks(reportPayload, options = {}) {
        return buildReadinessTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 50 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 50))
            .map((entry) => clone(entry));
    }
}

export const __missionReadinessInternals = {
    normalizeMissionPlan,
    normalizeSandboxProfiles,
    inferRequiredSandboxProfile,
    estimateNodeCost,
    defaultApprovalDecision,
    scoreReadiness
};
