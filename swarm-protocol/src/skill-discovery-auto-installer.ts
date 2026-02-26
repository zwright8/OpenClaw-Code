import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    install_skill_candidate: 'agent:skills',
    run_skill_security_review: 'agent:security',
    route_to_manual_fallback: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
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

function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

function normalizeStringArray(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim().toLowerCase())
    )];
}

function normalizeInstalledSkills(inputPayload) {
    const source = Array.isArray(inputPayload?.installedSkills)
        ? inputPayload.installedSkills
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            skillId: typeof entry.skillId === 'string' && entry.skillId.trim()
                ? entry.skillId.trim()
                : `installed-${index + 1}`,
            capabilities: normalizeStringArray(entry.capabilities),
            reliability: clamp(safeNumber(entry.reliability, 72)),
            trustScore: clamp(safeNumber(entry.trustScore, 74))
        }));
}

function normalizeCandidates(inputPayload) {
    const source = Array.isArray(inputPayload?.candidateCatalog)
        ? inputPayload.candidateCatalog
        : [];

    return source
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry, index) => ({
            skillId: typeof entry.skillId === 'string' && entry.skillId.trim()
                ? entry.skillId.trim()
                : `candidate-${index + 1}`,
            source: typeof entry.source === 'string' && entry.source.trim()
                ? entry.source.trim()
                : 'unknown',
            capabilities: normalizeStringArray(entry.capabilities),
            maturity: clamp(safeNumber(entry.maturity, 62)),
            trustScore: clamp(safeNumber(entry.trustScore, 66)),
            integrationCost: clamp(safeNumber(entry.integrationCost, 36)),
            validationCoverage: clamp(safeNumber(entry.validationCoverage, 58))
        }));
}

function normalizeRequirements(inputPayload) {
    return normalizeStringArray(inputPayload?.requiredCapabilities);
}

function capabilityCoverage(installedSkills) {
    const set = new Set();
    for (const skill of installedSkills) {
        for (const capability of skill.capabilities) {
            set.add(capability);
        }
    }
    return set;
}

function candidateFit(candidate, capability) {
    const supportsCapability = candidate.capabilities.includes(capability);
    if (!supportsCapability) return 0;

    return clamp(Math.round(
        candidate.maturity * 0.28
        + candidate.trustScore * 0.34
        + candidate.validationCoverage * 0.24
        + (100 - candidate.integrationCost) * 0.14
    ));
}

function buildInstallationPlan(requirements, installedSkills, candidates) {
    const installedCoverage = capabilityCoverage(installedSkills);

    return requirements.map((capability) => {
        const alreadyCovered = installedCoverage.has(capability);

        const rankedCandidates = candidates
            .map((candidate) => ({
                skillId: candidate.skillId,
                source: candidate.source,
                fitScore: candidateFit(candidate, capability),
                trustScore: candidate.trustScore,
                maturity: candidate.maturity,
                integrationCost: candidate.integrationCost,
                validationCoverage: candidate.validationCoverage
            }))
            .filter((entry) => entry.fitScore > 0)
            .sort((a, b) => b.fitScore - a.fitScore);

        const selected = rankedCandidates[0] || null;

        const riskScore = alreadyCovered
            ? 0
            : clamp(Math.round(
                selected
                    ? (100 - selected.trustScore) * 0.38
                        + (100 - selected.validationCoverage) * 0.3
                        + selected.integrationCost * 0.32
                    : 82
            ));

        return {
            capability,
            alreadyCovered,
            selectedCandidate: selected,
            candidateCount: rankedCandidates.length,
            riskScore,
            installable: !alreadyCovered && !!selected,
            blocked: !alreadyCovered && !selected
        };
    }).sort((a, b) => {
        if (Number(b.blocked) !== Number(a.blocked)) {
            return Number(b.blocked) - Number(a.blocked);
        }
        return b.riskScore - a.riskScore;
    });
}

function summarizePlan(plan) {
    const coveredCount = plan.filter((entry) => entry.alreadyCovered).length;
    const installableCount = plan.filter((entry) => entry.installable).length;
    const blockedCount = plan.filter((entry) => entry.blocked).length;
    const highRiskInstallCount = plan.filter((entry) => entry.installable && entry.riskScore >= 65).length;

    let posture = 'ready';
    if (blockedCount > 0 || highRiskInstallCount > 0) posture = 'review_required';
    if (blockedCount > 0 && installableCount === 0) posture = 'blocked';

    return {
        requirementCount: plan.length,
        coveredCount,
        installableCount,
        blockedCount,
        highRiskInstallCount,
        posture
    };
}

function buildAlerts(summary, plan) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('skill_discovery_blocked_capabilities');
    if (summary.highRiskInstallCount > 0) alerts.push('skill_candidate_risk_high');
    if (plan.some((entry) => entry.selectedCandidate && entry.selectedCandidate.source === 'unknown')) {
        alerts.push('skill_candidate_source_unknown');
    }
    return alerts;
}

function buildRecommendations(plan, summary, alerts) {
    const recommendations = [];

    for (const entry of plan) {
        if (entry.installable && entry.selectedCandidate) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'install_skill_candidate',
                capability: entry.capability,
                skillId: entry.selectedCandidate.skillId,
                title: `Install ${entry.selectedCandidate.skillId} for ${entry.capability}`,
                description: `Fit score ${entry.selectedCandidate.fitScore} with risk score ${entry.riskScore}.`,
                priority: entry.riskScore >= 70 ? 'P1' : 'P2'
            });

            if (entry.riskScore >= 60 || entry.selectedCandidate.trustScore < 70) {
                recommendations.push({
                    id: `recommendation-${randomUUID().slice(0, 8)}`,
                    type: 'run_skill_security_review',
                    capability: entry.capability,
                    skillId: entry.selectedCandidate.skillId,
                    title: `Run security review for ${entry.selectedCandidate.skillId}`,
                    description: 'Candidate requires trust and validation review before auto-install.',
                    priority: entry.riskScore >= 75 ? 'P1' : 'P2'
                });
            }
        }

        if (entry.blocked) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'route_to_manual_fallback',
                capability: entry.capability,
                title: `Route ${entry.capability} to manual fallback`,
                description: 'No viable skill candidate discovered for required capability.',
                priority: 'P1'
            });
        }
    }

    if (alerts.length > 0 && !recommendations.some((entry) => entry.type === 'run_skill_security_review')) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'run_skill_security_review',
            title: 'Run global skill security review',
            description: 'Validate discovered candidates before promoting to active capability set.',
            priority: summary.posture === 'blocked' ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.capability || '').localeCompare(String(b.capability || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.capability || '') === String(entry.capability || '')
            && String(other.skillId || '') === String(entry.skillId || '')
        )) === index);
}

export function discoverAndPlanSkillInstallations(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const installedSkills = normalizeInstalledSkills(inputPayload || {});
    const candidates = normalizeCandidates(inputPayload || {});
    const requirements = normalizeRequirements(inputPayload || {});
    const plan = buildInstallationPlan(requirements, installedSkills, candidates);
    const summary = summarizePlan(plan);
    const alerts = buildAlerts(summary, plan);
    const recommendations = buildRecommendations(plan, summary, alerts);

    return {
        at,
        summary,
        plan,
        alerts,
        recommendations
    };
}

export function skillDiscoveryToTasks(reportPayload, {
    fromAgentId = 'agent:skill-discovery',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('skillDiscoveryToTasks requires report payload');
    }

    const recommendations = Array.isArray(reportPayload.recommendations)
        ? reportPayload.recommendations
        : [];
    const targets = {
        ...RecommendationTargetMap,
        ...(targetMap || {})
    };
    const nowMs = safeNow(Date.now);

    return recommendations.map((recommendation, index) => buildTaskRequest({
        id: randomUUID(),
        from: fromAgentId,
        target: targets[recommendation.type] || defaultTarget,
        priority: RecommendationPriorityTaskMap[recommendation.priority] || 'normal',
        task: `[${recommendation.priority}] ${recommendation.title}`,
        context: {
            recommendationType: recommendation.type,
            capability: recommendation.capability || null,
            skillId: recommendation.skillId || null,
            posture: reportPayload.summary?.posture || null
        },
        createdAt: nowMs + index
    }));
}

export class SkillDiscoveryAutoInstaller {
    constructor({
        localAgentId = 'agent:skill-discovery',
        now = Date.now,
        maxHistory = 120
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 120;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = discoverAndPlanSkillInstallations(inputPayload, {
            now: this.now,
            ...options
        });
        this.history.push(report);
        if (this.history.length > this.maxHistory) {
            this.history.splice(0, this.history.length - this.maxHistory);
        }
        return clone(report);
    }

    buildTasks(reportPayload, options = {}) {
        return skillDiscoveryToTasks(reportPayload, {
            fromAgentId: this.localAgentId,
            ...options
        });
    }

    listHistory({ limit = 20 } = {}) {
        return this.history
            .slice(-Math.max(1, Number(limit) || 20))
            .map((entry) => clone(entry));
    }
}

export const __skillDiscoveryAutoInstallerInternals = {
    normalizeInstalledSkills,
    normalizeCandidates,
    buildInstallationPlan,
    summarizePlan,
    buildRecommendations
};
