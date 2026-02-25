import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    remediate_mandatory_gap: 'agent:compliance',
    collect_compliance_evidence: 'agent:analysis',
    schedule_control_validation: 'agent:qa',
    publish_compliance_matrix: 'agent:ops'
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
    return value
        .filter((entry) => typeof entry === 'string' && entry.trim())
        .map((entry) => entry.trim());
}

function normalizeControls(inputPayload) {
    const controls = Array.isArray(inputPayload?.controls)
        ? inputPayload.controls
        : [];

    return controls
        .filter((control) => control && typeof control === 'object')
        .map((control, index) => ({
            id: typeof control.id === 'string' && control.id.trim()
                ? control.id.trim()
                : `control-${index + 1}`,
            name: typeof control.name === 'string' && control.name.trim()
                ? control.name.trim()
                : `Control ${index + 1}`,
            domains: normalizeStringArray(control.domains),
            standards: normalizeStringArray(control.standards),
            requirementIds: normalizeStringArray(control.requirementIds),
            coverage: clamp(safeNumber(control.coverage, 60)),
            effectiveness: clamp(safeNumber(control.effectiveness, 65)),
            evidenceRefs: normalizeStringArray(control.evidenceRefs),
            owner: typeof control.owner === 'string' && control.owner.trim()
                ? control.owner.trim()
                : 'agent:unknown'
        }));
}

function normalizeStandards(inputPayload) {
    const standards = Array.isArray(inputPayload?.standards)
        ? inputPayload.standards
        : [];

    return standards
        .filter((standard) => standard && typeof standard === 'object')
        .map((standard, index) => {
            const standardId = typeof standard.id === 'string' && standard.id.trim()
                ? standard.id.trim()
                : `standard-${index + 1}`;
            const requirements = Array.isArray(standard.requirements)
                ? standard.requirements
                : [];

            return {
                id: standardId,
                name: typeof standard.name === 'string' && standard.name.trim()
                    ? standard.name.trim()
                    : `Standard ${index + 1}`,
                requirements: requirements
                    .filter((requirement) => requirement && typeof requirement === 'object')
                    .map((requirement, reqIndex) => ({
                        id: typeof requirement.id === 'string' && requirement.id.trim()
                            ? requirement.id.trim()
                            : `${standardId}-req-${reqIndex + 1}`,
                        title: typeof requirement.title === 'string' && requirement.title.trim()
                            ? requirement.title.trim()
                            : `Requirement ${reqIndex + 1}`,
                        domains: normalizeStringArray(requirement.domains),
                        mandatory: requirement.mandatory !== false,
                        weight: clamp(safeNumber(requirement.weight, 60)),
                        minCoverage: clamp(safeNumber(requirement.minCoverage, 70)),
                        minEffectiveness: clamp(safeNumber(requirement.minEffectiveness, 70))
                    }))
            };
        });
}

function controlMatchesRequirement(control, standardId, requirement) {
    const standardMatch = control.standards.includes(standardId);
    const requirementMatch = control.requirementIds.includes(requirement.id);
    const domainMatch = requirement.domains.length === 0
        || requirement.domains.some((domain) => control.domains.includes(domain));

    return standardMatch || requirementMatch || domainMatch;
}

function mapRequirement(requirement, standardId, controls) {
    const matchedControls = controls
        .filter((control) => controlMatchesRequirement(control, standardId, requirement))
        .sort((a, b) => {
            const left = a.coverage * 0.55 + a.effectiveness * 0.45;
            const right = b.coverage * 0.55 + b.effectiveness * 0.45;
            return right - left;
        });

    const topCoverage = matchedControls.length > 0
        ? matchedControls[0].coverage
        : 0;
    const avgEffectiveness = matchedControls.length > 0
        ? Number((matchedControls.reduce((acc, control) => acc + control.effectiveness, 0) / matchedControls.length).toFixed(2))
        : 0;
    const evidenceCoverage = matchedControls.length > 0
        ? Number((matchedControls.reduce((acc, control) => acc + (control.evidenceRefs.length > 0 ? 1 : 0), 0) / matchedControls.length * 100).toFixed(2))
        : 0;

    const coverageScore = clamp(Math.round(
        topCoverage * 0.55
        + avgEffectiveness * 0.35
        + evidenceCoverage * 0.1
    ));
    const gapScore = clamp(Math.round(
        Math.max(0, requirement.minCoverage - topCoverage) * 0.55
        + Math.max(0, requirement.minEffectiveness - avgEffectiveness) * 0.35
        + (evidenceCoverage < 50 ? 10 : 0)
    ));

    let status = 'covered';
    const belowCoverage = topCoverage < requirement.minCoverage;
    const belowEffectiveness = avgEffectiveness < requirement.minEffectiveness;
    if (belowCoverage || belowEffectiveness || matchedControls.length === 0) {
        status = requirement.mandatory ? 'missing' : 'partial';
    } else if (evidenceCoverage < 50) {
        status = 'partial';
    }

    return {
        requirementId: requirement.id,
        requirementTitle: requirement.title,
        mandatory: requirement.mandatory,
        weight: requirement.weight,
        minCoverage: requirement.minCoverage,
        minEffectiveness: requirement.minEffectiveness,
        status,
        coverageScore,
        gapScore,
        matchedControlCount: matchedControls.length,
        matchedControls: matchedControls.map((control) => ({
            controlId: control.id,
            controlName: control.name,
            coverage: control.coverage,
            effectiveness: control.effectiveness,
            owner: control.owner,
            evidenceCount: control.evidenceRefs.length
        }))
    };
}

function mapStandard(standard, controls) {
    const requirements = standard.requirements.map((requirement) => (
        mapRequirement(requirement, standard.id, controls)
    ));
    const weightedCoverageDenominator = requirements.reduce((acc, requirement) => acc + requirement.weight, 0);
    const weightedCoverageNumerator = requirements.reduce((acc, requirement) => (
        acc + requirement.coverageScore * requirement.weight
    ), 0);
    const weightedCoverage = weightedCoverageDenominator > 0
        ? Number((weightedCoverageNumerator / weightedCoverageDenominator).toFixed(2))
        : 0;
    const missingMandatoryCount = requirements.filter((requirement) => requirement.mandatory && requirement.status === 'missing').length;
    const partialCount = requirements.filter((requirement) => requirement.status === 'partial').length;
    const coveredCount = requirements.filter((requirement) => requirement.status === 'covered').length;

    let posture = 'compliant';
    if (missingMandatoryCount > 0) posture = 'non_compliant';
    else if (partialCount > 0 || weightedCoverage < 75) posture = 'review_required';

    return {
        standardId: standard.id,
        standardName: standard.name,
        posture,
        weightedCoverage,
        requirementCount: requirements.length,
        coveredCount,
        partialCount,
        missingMandatoryCount,
        requirements
    };
}

function summarizeStandards(standardMappings) {
    const avgCoverage = standardMappings.length > 0
        ? Number((standardMappings.reduce((acc, mapping) => acc + mapping.weightedCoverage, 0) / standardMappings.length).toFixed(2))
        : 0;
    const missingMandatoryCount = standardMappings.reduce((acc, mapping) => acc + mapping.missingMandatoryCount, 0);
    const partialRequirementCount = standardMappings.reduce((acc, mapping) => acc + mapping.partialCount, 0);
    const totalRequirements = standardMappings.reduce((acc, mapping) => acc + mapping.requirementCount, 0);
    const coveredRequirements = standardMappings.reduce((acc, mapping) => acc + mapping.coveredCount, 0);

    let posture = 'compliant';
    if (missingMandatoryCount > 0) posture = 'non_compliant';
    else if (partialRequirementCount > 0 || avgCoverage < 75) posture = 'review_required';

    return {
        standardCount: standardMappings.length,
        totalRequirements,
        coveredRequirements,
        partialRequirementCount,
        missingMandatoryCount,
        avgCoverage,
        posture
    };
}

function buildAlerts(summary, standardMappings) {
    const alerts = [];
    if (summary.missingMandatoryCount > 0) alerts.push('mandatory_compliance_gap_detected');
    if (summary.partialRequirementCount > 0) alerts.push('partial_compliance_requirements_present');
    if (summary.avgCoverage < 70) alerts.push('compliance_coverage_low');
    if (standardMappings.some((mapping) => (
        mapping.requirements.some((requirement) => requirement.matchedControlCount > 0 && requirement.coverageScore < 60)
    ))) {
        alerts.push('control_effectiveness_gap');
    }
    return alerts;
}

function buildRecommendations(standardMappings, summary, alerts) {
    const recommendations = [];
    for (const mapping of standardMappings) {
        for (const requirement of mapping.requirements) {
            if (requirement.mandatory && requirement.status === 'missing') {
                recommendations.push({
                    id: `recommendation-${randomUUID().slice(0, 8)}`,
                    type: 'remediate_mandatory_gap',
                    standardId: mapping.standardId,
                    requirementId: requirement.requirementId,
                    title: `Remediate mandatory gap ${requirement.requirementId}`,
                    description: `${mapping.standardName}: ${requirement.requirementTitle}.`,
                    priority: 'P0'
                });
            } else if (requirement.status === 'partial') {
                recommendations.push({
                    id: `recommendation-${randomUUID().slice(0, 8)}`,
                    type: 'schedule_control_validation',
                    standardId: mapping.standardId,
                    requirementId: requirement.requirementId,
                    title: `Validate control coverage for ${requirement.requirementId}`,
                    description: `Requirement is partially covered and needs control validation.`,
                    priority: 'P1'
                });
            }

            if (requirement.status !== 'covered' || requirement.coverageScore < 70) {
                recommendations.push({
                    id: `recommendation-${randomUUID().slice(0, 8)}`,
                    type: 'collect_compliance_evidence',
                    standardId: mapping.standardId,
                    requirementId: requirement.requirementId,
                    title: `Collect evidence for ${requirement.requirementId}`,
                    description: `Current coverage score ${requirement.coverageScore}.`,
                    priority: requirement.mandatory ? 'P1' : 'P2'
                });
            }
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_compliance_matrix',
            title: 'Publish compliance requirement-control matrix',
            description: 'Share mapped coverage, gaps, and remediation owners across standards.',
            priority: alerts.includes('mandatory_compliance_gap_detected') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.requirementId || '').localeCompare(String(b.requirementId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type
            && String(other.standardId || '') === String(entry.standardId || '')
            && String(other.requirementId || '') === String(entry.requirementId || '')
        )) === index);
}

export function mapComplianceStandards(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const controls = normalizeControls(inputPayload || {});
    const standards = normalizeStandards(inputPayload || {});
    const standardMappings = standards.map((standard) => mapStandard(standard, controls))
        .sort((a, b) => {
            const postureRank = { non_compliant: 0, review_required: 1, compliant: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return a.weightedCoverage - b.weightedCoverage;
        });
    const summary = summarizeStandards(standardMappings);
    const alerts = buildAlerts(summary, standardMappings);
    const recommendations = buildRecommendations(standardMappings, summary, alerts);

    return {
        at,
        summary,
        standards: standardMappings,
        alerts,
        recommendations
    };
}

export function complianceMappingToTasks(reportPayload, {
    fromAgentId = 'agent:compliance',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('complianceMappingToTasks requires report payload');
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
            standardId: recommendation.standardId || null,
            requirementId: recommendation.requirementId || null,
            posture: reportPayload.summary?.posture || null,
            missingMandatoryCount: reportPayload.summary?.missingMandatoryCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class ComplianceStandardMapper {
    constructor({
        localAgentId = 'agent:compliance',
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
        const report = mapComplianceStandards(inputPayload, {
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
        return complianceMappingToTasks(reportPayload, {
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

export const __complianceStandardMapperInternals = {
    normalizeControls,
    normalizeStandards,
    mapRequirement,
    mapStandard,
    buildRecommendations
};
