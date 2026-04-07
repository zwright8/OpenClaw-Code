import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    fix_accessibility_blocker: 'agent:ui',
    schedule_accessibility_audit: 'agent:qa',
    add_assistive_support: 'agent:ux',
    publish_accessibility_notes: 'agent:ops'
};

const RecommendationPriorityTaskMap = {
    P0: 'critical',
    P1: 'high',
    P2: 'normal',
    P3: 'low'
};

const DefaultCheckWeights = {
    colorContrast: 0.18,
    keyboardNavigation: 0.2,
    screenReaderSupport: 0.22,
    focusManagement: 0.16,
    semanticStructure: 0.14,
    mediaAccessibility: 0.1
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

function normalizeChecks(checks) {
    const input = checks && typeof checks === 'object' ? checks : {};
    return {
        colorContrast: clamp(safeNumber(input.colorContrast, 70)),
        keyboardNavigation: clamp(safeNumber(input.keyboardNavigation, 70)),
        screenReaderSupport: clamp(safeNumber(input.screenReaderSupport, 68)),
        focusManagement: clamp(safeNumber(input.focusManagement, 70)),
        semanticStructure: clamp(safeNumber(input.semanticStructure, 72)),
        mediaAccessibility: clamp(safeNumber(input.mediaAccessibility, 66))
    };
}

function normalizeSurfaces(inputPayload) {
    const entries = Array.isArray(inputPayload?.surfaces)
        ? inputPayload.surfaces
        : [];

    return entries.map((entry, index) => ({
        id: typeof entry?.id === 'string' && entry.id.trim()
            ? entry.id.trim()
            : `surface-${index + 1}`,
        name: typeof entry?.name === 'string' && entry.name.trim()
            ? entry.name.trim()
            : `Surface ${index + 1}`,
        pageType: typeof entry?.pageType === 'string' && entry.pageType.trim()
            ? entry.pageType.trim()
            : 'general',
        trafficWeight: clamp(safeNumber(entry?.trafficWeight, 50)),
        criticality: clamp(safeNumber(entry?.criticality, 50)),
        checks: normalizeChecks(entry?.checks),
        knownBlockers: Array.isArray(entry?.knownBlockers)
            ? entry.knownBlockers.filter((item) => typeof item === 'string')
            : []
    }));
}

function normalizeThresholds(inputPayload) {
    const thresholds = inputPayload?.thresholds && typeof inputPayload.thresholds === 'object'
        ? inputPayload.thresholds
        : {};

    return {
        minimumComplianceScore: clamp(safeNumber(thresholds.minimumComplianceScore, 72)),
        criticalCheckFloor: clamp(safeNumber(thresholds.criticalCheckFloor, 55)),
        maxCriticalIssueCount: Math.max(0, Math.floor(safeNumber(thresholds.maxCriticalIssueCount, 0)))
    };
}

function computeComplianceScore(checks) {
    return clamp(Math.round(
        checks.colorContrast * DefaultCheckWeights.colorContrast
        + checks.keyboardNavigation * DefaultCheckWeights.keyboardNavigation
        + checks.screenReaderSupport * DefaultCheckWeights.screenReaderSupport
        + checks.focusManagement * DefaultCheckWeights.focusManagement
        + checks.semanticStructure * DefaultCheckWeights.semanticStructure
        + checks.mediaAccessibility * DefaultCheckWeights.mediaAccessibility
    ));
}

function detectCriticalIssues(surface, thresholds) {
    const issues = [];
    const checks = surface.checks;
    if (checks.colorContrast < thresholds.criticalCheckFloor) issues.push('color_contrast_low');
    if (checks.keyboardNavigation < thresholds.criticalCheckFloor) issues.push('keyboard_navigation_low');
    if (checks.screenReaderSupport < thresholds.criticalCheckFloor) issues.push('screen_reader_support_low');
    if (checks.focusManagement < thresholds.criticalCheckFloor) issues.push('focus_management_low');
    if (checks.semanticStructure < thresholds.criticalCheckFloor) issues.push('semantic_structure_low');
    if (checks.mediaAccessibility < thresholds.criticalCheckFloor) issues.push('media_accessibility_low');
    for (const blocker of surface.knownBlockers) {
        issues.push(`blocker:${blocker}`);
    }
    return issues;
}

function evaluateSurface(surface, thresholds) {
    const complianceScore = computeComplianceScore(surface.checks);
    const criticalIssues = detectCriticalIssues(surface, thresholds);
    const criticalIssueCount = criticalIssues.length;
    let posture = 'compliant';

    if (
        complianceScore < thresholds.minimumComplianceScore
        || criticalIssueCount > thresholds.maxCriticalIssueCount
    ) {
        posture = 'review_required';
    }
    if (
        complianceScore < thresholds.minimumComplianceScore - 12
        || criticalIssueCount >= Math.max(2, thresholds.maxCriticalIssueCount + 1)
    ) {
        posture = 'blocked';
    }

    const userImpactScore = clamp(Math.round(
        (100 - complianceScore) * 0.5
        + criticalIssueCount * 12
        + surface.criticality * 0.22
        + surface.trafficWeight * 0.16
    ));

    return {
        surfaceId: surface.id,
        surfaceName: surface.name,
        pageType: surface.pageType,
        trafficWeight: surface.trafficWeight,
        criticality: surface.criticality,
        checks: clone(surface.checks),
        complianceScore,
        criticalIssues,
        criticalIssueCount,
        userImpactScore,
        posture
    };
}

function summarizeSurfaces(evaluations) {
    const avgComplianceScore = evaluations.length > 0
        ? Number((evaluations.reduce((acc, row) => acc + row.complianceScore, 0) / evaluations.length).toFixed(2))
        : 0;
    const weightedImpact = evaluations.length > 0
        ? Number((evaluations.reduce((acc, row) => acc + row.userImpactScore, 0) / evaluations.length).toFixed(2))
        : 0;

    return {
        surfaceCount: evaluations.length,
        compliantCount: evaluations.filter((row) => row.posture === 'compliant').length,
        reviewRequiredCount: evaluations.filter((row) => row.posture === 'review_required').length,
        blockedCount: evaluations.filter((row) => row.posture === 'blocked').length,
        avgComplianceScore,
        avgUserImpactScore: weightedImpact
    };
}

function buildAlerts(summary, evaluations) {
    const alerts = [];
    if (summary.blockedCount > 0) alerts.push('accessibility_blockers_detected');
    if (summary.reviewRequiredCount > 0) alerts.push('accessibility_review_required');
    if (summary.avgComplianceScore < 70) alerts.push('accessibility_compliance_low');
    if (evaluations.some((row) => row.criticalIssues.some((issue) => issue.startsWith('blocker:')))) {
        alerts.push('known_accessibility_blocker_present');
    }
    return alerts;
}

function buildRecommendations(evaluations, alerts) {
    const recommendations = [];
    for (const row of evaluations) {
        if (row.posture === 'blocked') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'fix_accessibility_blocker',
                surfaceId: row.surfaceId,
                title: `Fix accessibility blocker on ${row.surfaceName}`,
                description: `Compliance ${row.complianceScore} with ${row.criticalIssueCount} critical issue(s).`,
                priority: 'P0'
            });
        } else if (row.posture === 'review_required') {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'schedule_accessibility_audit',
                surfaceId: row.surfaceId,
                title: `Run accessibility audit on ${row.surfaceName}`,
                description: 'Surface requires targeted accessibility review and remediation plan.',
                priority: 'P1'
            });
        }

        if (row.checks.screenReaderSupport < 65 || row.checks.mediaAccessibility < 65) {
            recommendations.push({
                id: `recommendation-${randomUUID().slice(0, 8)}`,
                type: 'add_assistive_support',
                surfaceId: row.surfaceId,
                title: `Add assistive support enhancements to ${row.surfaceName}`,
                description: 'Screen-reader/media accessibility coverage is below minimum quality target.',
                priority: row.posture === 'blocked' ? 'P1' : 'P2'
            });
        }
    }

    if (alerts.length > 0) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'publish_accessibility_notes',
            title: 'Publish accessibility status update for operators',
            description: 'Document active accessibility issues, mitigation progress, and remediation owners.',
            priority: alerts.includes('accessibility_blockers_detected') ? 'P1' : 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations
        .sort((a, b) => {
            const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
            if (p !== 0) return p;
            return String(a.surfaceId || '').localeCompare(String(b.surfaceId || ''));
        })
        .filter((entry, index, arr) => arr.findIndex((other) => (
            other.type === entry.type && String(other.surfaceId || '') === String(entry.surfaceId || '')
        )) === index);
}

export function auditAccessibilityQuality(inputPayload, {
    now = Date.now
} = {}) {
    const at = safeNow(now);
    const surfaces = normalizeSurfaces(inputPayload || {});
    const thresholds = normalizeThresholds(inputPayload || {});
    const evaluations = surfaces.map((surface) => evaluateSurface(surface, thresholds))
        .sort((a, b) => {
            const postureRank = { blocked: 0, review_required: 1, compliant: 2 };
            const p = postureRank[a.posture] - postureRank[b.posture];
            if (p !== 0) return p;
            return b.userImpactScore - a.userImpactScore;
        });

    const summary = summarizeSurfaces(evaluations);
    const alerts = buildAlerts(summary, evaluations);
    const recommendations = buildRecommendations(evaluations, alerts);

    return {
        at,
        thresholds,
        surfaces: evaluations,
        summary,
        alerts,
        recommendations
    };
}

export function accessibilityRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:accessibility',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('accessibilityRecommendationsToTasks requires report payload');
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
            surfaceId: recommendation.surfaceId || null,
            blockedCount: reportPayload.summary?.blockedCount || 0
        },
        createdAt: nowMs + index
    }));
}

export class AccessibilityQualityAuditor {
    constructor({
        localAgentId = 'agent:accessibility',
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
        const report = auditAccessibilityQuality(inputPayload, {
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
        return accessibilityRecommendationsToTasks(reportPayload, {
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

export const __accessibilityAuditorInternals = {
    normalizeSurfaces,
    normalizeThresholds,
    computeComplianceScore,
    detectCriticalIssues,
    evaluateSurface,
    buildRecommendations
};
