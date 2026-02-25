import { randomUUID } from 'crypto';
import { buildTaskRequest } from './task-orchestrator.js';

const RecommendationTargetMap = {
    publish_explanation: 'agent:ops',
    request_additional_evidence: 'agent:analysis',
    simplify_operator_brief: 'agent:ux'
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

function normalizeDecision(inputPayload) {
    const decision = inputPayload?.decision && typeof inputPayload.decision === 'object'
        ? inputPayload.decision
        : {};

    return {
        id: typeof decision.id === 'string' && decision.id.trim()
            ? decision.id.trim()
            : `decision-${randomUUID().slice(0, 8)}`,
        decisionType: typeof decision.decisionType === 'string' && decision.decisionType.trim()
            ? decision.decisionType.trim()
            : 'operational_decision',
        outcome: typeof decision.outcome === 'string' && decision.outcome.trim()
            ? decision.outcome.trim()
            : 'pending',
        mode: typeof decision.mode === 'string' && decision.mode.trim()
            ? decision.mode.trim()
            : 'normal',
        score: clamp(safeNumber(decision.score, 60)),
        summary: typeof decision.summary === 'string'
            ? decision.summary.trim()
            : ''
    };
}

function collectSignals(inputPayload) {
    const governor = inputPayload?.governorDecision || {};
    const constitution = inputPayload?.constitutionReport || {};
    const humanity = inputPayload?.humanityReport || {};
    const readiness = inputPayload?.readinessReport || {};
    const portfolio = inputPayload?.portfolioReport || {};
    const harm = inputPayload?.harmReport || {};
    const misuse = inputPayload?.misuseReport || {};

    return {
        governorRisk: clamp(safeNumber(governor.riskScore, 0)),
        governorMode: typeof governor.mode === 'string' ? governor.mode : 'normal',
        constitutionScore: clamp(safeNumber(constitution.overallScore, 0)),
        constitutionTier: typeof constitution.tier === 'string' ? constitution.tier : 'aligned',
        humanityPosture: typeof humanity.posture === 'string' ? humanity.posture : 'aligned',
        humanityBlockedCount: Math.max(0, Math.floor(safeNumber(humanity?.summary?.blockedCount, 0))),
        readinessStatus: typeof readiness.status === 'string' ? readiness.status : 'ready',
        readinessScore: clamp(safeNumber(readiness.readinessScore, 0)),
        missionNowCount: Math.max(0, Math.floor(safeNumber(portfolio?.summary?.nowCount, 0))),
        missionHoldCount: Math.max(0, Math.floor(safeNumber(portfolio?.summary?.holdCount, 0))),
        harmEscalationLevel: typeof harm.escalationLevel === 'string'
            ? harm.escalationLevel
            : 'normal',
        harmCurrentRisk: clamp(safeNumber(harm?.scores?.currentRiskScore, 0)),
        misuseThreatLevel: typeof misuse?.summary?.threatLevel === 'string'
            ? misuse.summary.threatLevel
            : 'low',
        misuseHighRiskActorCount: Math.max(0, Math.floor(safeNumber(
            misuse?.summary?.highRiskActorCount,
            0
        )))
    };
}

function buildReasons(decision, signals) {
    const reasons = [];

    reasons.push({
        id: `reason-${randomUUID().slice(0, 6)}`,
        label: 'Decision quality score',
        direction: decision.score >= 65 ? 'supports' : 'undermines',
        impactScore: clamp(Math.round(Math.abs(decision.score - 50) * 1.2)),
        evidence: `Decision score is ${decision.score}/100 for ${decision.decisionType}.`
    });

    reasons.push({
        id: `reason-${randomUUID().slice(0, 6)}`,
        label: 'Constitution alignment',
        direction: signals.constitutionTier === 'aligned' ? 'supports' : 'undermines',
        impactScore: clamp(Math.round(
            signals.constitutionTier === 'aligned'
                ? signals.constitutionScore * 0.7
                : (100 - signals.constitutionScore) * 0.8
        )),
        evidence: `Constitution tier is ${signals.constitutionTier} at score ${signals.constitutionScore}.`
    });

    reasons.push({
        id: `reason-${randomUUID().slice(0, 6)}`,
        label: 'Safety and harm posture',
        direction: signals.harmCurrentRisk < 50 && signals.humanityPosture === 'aligned'
            ? 'supports'
            : 'undermines',
        impactScore: clamp(Math.round(
            signals.harmCurrentRisk * 0.7
            + signals.humanityBlockedCount * 8
            + (signals.harmEscalationLevel === 'critical' ? 20 : 0)
        )),
        evidence: `Harm escalation is ${signals.harmEscalationLevel} with risk ${signals.harmCurrentRisk}.`
    });

    reasons.push({
        id: `reason-${randomUUID().slice(0, 6)}`,
        label: 'Operational readiness',
        direction: signals.readinessStatus === 'ready' ? 'supports' : 'undermines',
        impactScore: clamp(Math.round(
            signals.readinessStatus === 'ready'
                ? signals.readinessScore * 0.6
                : (100 - signals.readinessScore) * 0.65
        )),
        evidence: `Readiness status is ${signals.readinessStatus} (score ${signals.readinessScore}).`
    });

    reasons.push({
        id: `reason-${randomUUID().slice(0, 6)}`,
        label: 'Misuse threat context',
        direction: signals.misuseThreatLevel === 'low' || signals.misuseThreatLevel === 'guarded'
            ? 'supports'
            : 'undermines',
        impactScore: clamp(Math.round(
            (signals.misuseThreatLevel === 'critical' ? 75 : signals.misuseThreatLevel === 'high' ? 58 : 26)
            + signals.misuseHighRiskActorCount * 8
        )),
        evidence: `Misuse threat is ${signals.misuseThreatLevel} with ${signals.misuseHighRiskActorCount} high-risk actors.`
    });

    return reasons.sort((a, b) => b.impactScore - a.impactScore);
}

function uncertaintyAnalysis(decision, signals, reasons) {
    const uncertaintySources = [];
    if (signals.constitutionScore < 60) uncertaintySources.push('constitution_signal_weak');
    if (signals.readinessScore < 60) uncertaintySources.push('readiness_signal_weak');
    if (signals.harmCurrentRisk >= 55) uncertaintySources.push('harm_signal_elevated');
    if (signals.misuseThreatLevel === 'high' || signals.misuseThreatLevel === 'critical') {
        uncertaintySources.push('misuse_threat_elevated');
    }
    if (decision.score >= 45 && decision.score <= 65) uncertaintySources.push('decision_margin_narrow');

    const uncertaintyScore = clamp(Math.round(
        uncertaintySources.length * 18
        + (signals.harmCurrentRisk >= 60 ? 10 : 0)
        + (signals.misuseHighRiskActorCount * 6)
    ));

    const confidenceScore = clamp(100 - uncertaintyScore);
    const topOpposingReason = reasons.find((reason) => reason.direction === 'undermines') || null;

    return {
        uncertaintyScore,
        confidenceScore,
        uncertaintySources,
        topOpposingReason
    };
}

function headline(decision, confidenceScore) {
    return `${decision.decisionType}: ${decision.outcome} (${decision.mode}) with ${confidenceScore}% confidence`;
}

function executiveSummary(decision, primaryReason, uncertainty) {
    const base = decision.summary && decision.summary.length > 0
        ? decision.summary
        : `Decision ${decision.id} set to ${decision.outcome} in ${decision.mode} mode.`;
    const reasonClause = primaryReason
        ? `Primary driver: ${primaryReason.label.toLowerCase()}.`
        : '';
    const uncertaintyClause = uncertainty.uncertaintyScore >= 55
        ? 'Uncertainty remains elevated and requires added evidence.'
        : 'Uncertainty is bounded and manageable.';
    return `${base} ${reasonClause} ${uncertaintyClause}`.trim();
}

function asMarkdown({
    decision,
    narrativeHeadline,
    summary,
    reasons,
    uncertainty,
    counterfactuals
}) {
    const reasonLines = reasons
        .map((reason, index) => `${index + 1}. **${reason.label}** (${reason.direction}, impact ${reason.impactScore}) - ${reason.evidence}`)
        .join('\n');
    const uncertaintyLines = uncertainty.uncertaintySources.length > 0
        ? uncertainty.uncertaintySources.map((source) => `- ${source}`).join('\n')
        : '- none';
    const counterfactualLines = counterfactuals.length > 0
        ? counterfactuals.map((item, index) => `${index + 1}. ${item}`).join('\n')
        : '1. No counterfactual scenarios generated.';

    return [
        `## Explainability Narrative`,
        ``,
        `**Decision:** ${decision.id}`,
        `**Headline:** ${narrativeHeadline}`,
        ``,
        `### Executive Summary`,
        summary,
        ``,
        `### Ranked Reasons`,
        reasonLines,
        ``,
        `### Uncertainty Sources`,
        uncertaintyLines,
        ``,
        `### Counterfactual Checks`,
        counterfactualLines
    ].join('\n');
}

function buildCounterfactuals(decision, signals) {
    const items = [];
    if (signals.readinessStatus !== 'ready') {
        items.push('If readiness improved to `ready`, projected confidence would increase and allow faster execution.');
    }
    if (signals.harmCurrentRisk >= 50) {
        items.push('If harm risk dropped below 40, this decision could shift to lower supervision requirements.');
    }
    if (signals.misuseThreatLevel === 'high' || signals.misuseThreatLevel === 'critical') {
        items.push('If misuse threat falls to `guarded`, policy constraints can be relaxed with less residual risk.');
    }
    if (items.length === 0) {
        items.push('No single counterfactual currently changes the decision posture materially.');
    }
    return items;
}

function readabilityScore(summary, reasons) {
    const words = `${summary} ${reasons.map((reason) => reason.evidence).join(' ')}`.split(/\s+/).filter(Boolean);
    const avgWordLength = words.length > 0
        ? words.reduce((acc, word) => acc + word.length, 0) / words.length
        : 0;
    const base = 92 - avgWordLength * 6 - Math.max(0, reasons.length - 4) * 3;
    return clamp(Math.round(base));
}

function buildRecommendations(narrative) {
    const recommendations = [];
    if (narrative.uncertainty.uncertaintyScore >= 55) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'request_additional_evidence',
            title: 'Request additional evidence for uncertain decision factors',
            description: 'Uncertainty is high; gather stronger signal coverage before finalizing long-running actions.',
            priority: 'P1'
        });
    }

    recommendations.push({
        id: `recommendation-${randomUUID().slice(0, 8)}`,
        type: 'publish_explanation',
        title: 'Publish explainability narrative to operators',
        description: 'Share the ranked reasoning chain and uncertainty profile for decision transparency.',
        priority: narrative.decision.outcome === 'blocked' ? 'P1' : 'P2'
    });

    if (narrative.readabilityScore < 65) {
        recommendations.push({
            id: `recommendation-${randomUUID().slice(0, 8)}`,
            type: 'simplify_operator_brief',
            title: 'Simplify narrative wording for operator readability',
            description: `Readability score ${narrative.readabilityScore} is below target.`,
            priority: 'P2'
        });
    }

    const rank = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return recommendations.sort((a, b) => {
        const p = (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9);
        if (p !== 0) return p;
        return String(a.type).localeCompare(String(b.type));
    });
}

export function generateExplainabilityNarrative(inputPayload, {
    now = Date.now,
    maxReasons = 5
} = {}) {
    const at = safeNow(now);
    const decision = normalizeDecision(inputPayload || {});
    const signals = collectSignals(inputPayload || {});
    const reasons = buildReasons(decision, signals).slice(0, Math.max(1, Number(maxReasons) || 5));
    const uncertainty = uncertaintyAnalysis(decision, signals, reasons);
    const narrativeHeadline = headline(decision, uncertainty.confidenceScore);
    const summary = executiveSummary(decision, reasons[0], uncertainty);
    const counterfactuals = buildCounterfactuals(decision, signals);
    const score = readabilityScore(summary, reasons);

    const narrative = {
        at,
        decision,
        signals,
        headline: narrativeHeadline,
        summary,
        reasons,
        uncertainty,
        counterfactuals,
        readabilityScore: score
    };

    const markdown = asMarkdown({
        decision,
        narrativeHeadline,
        summary,
        reasons,
        uncertainty,
        counterfactuals
    });

    const recommendations = buildRecommendations(narrative);
    const alerts = [];
    if (uncertainty.uncertaintyScore >= 55) alerts.push('narrative_uncertainty_high');
    if (score < 65) alerts.push('narrative_readability_low');

    return {
        ...narrative,
        markdown,
        recommendations,
        alerts
    };
}

export function explainabilityRecommendationsToTasks(reportPayload, {
    fromAgentId = 'agent:explainability',
    defaultTarget = 'agent:ops',
    targetMap = {}
} = {}) {
    if (!reportPayload || typeof reportPayload !== 'object') {
        throw new Error('explainabilityRecommendationsToTasks requires report payload');
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
            decisionId: reportPayload.decision?.id || null,
            uncertaintyScore: reportPayload.uncertainty?.uncertaintyScore ?? null
        },
        createdAt: nowMs + index
    }));
}

export class ExplainabilityNarrativeGenerator {
    constructor({
        localAgentId = 'agent:explainability',
        now = Date.now,
        maxHistory = 150
    } = {}) {
        this.localAgentId = localAgentId;
        this.now = typeof now === 'function' ? now : Date.now;
        this.maxHistory = Number.isInteger(maxHistory) && maxHistory > 0
            ? maxHistory
            : 150;
        this.history = [];
    }

    evaluate(inputPayload, options = {}) {
        const report = generateExplainabilityNarrative(inputPayload, {
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
        return explainabilityRecommendationsToTasks(reportPayload, {
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

export const __explainabilityNarrativeInternals = {
    normalizeDecision,
    collectSignals,
    buildReasons,
    uncertaintyAnalysis,
    buildCounterfactuals,
    readabilityScore,
    buildRecommendations
};
