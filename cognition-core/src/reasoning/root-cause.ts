import {
    type CognitionRecommendation,
    type DetectedAnomaly,
    type EvidenceItem,
    type RiskTier,
    riskTierRequiresApproval
} from './anomaly.js';

export interface RootCauseCandidate {
    causeId: string;
    summary: string;
    relatedSignals: string[];
    likelihood: number;
    riskTier?: RiskTier;
    evidence?: EvidenceItem[];
    remediationHints?: string[];
}

export interface RootCauseFinding {
    findingId: string;
    anomalyId: string;
    causeId: string;
    summary: string;
    likelihood: number;
    confidence: number;
    riskTier: RiskTier;
    evidence: EvidenceItem[];
    remediationHints: string[];
}

export interface RootCauseResult {
    findings: RootCauseFinding[];
    recommendations: CognitionRecommendation[];
}

function clamp(value: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function deterministicId(prefix: string, seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash |= 0;
    }
    const encoded = Math.abs(hash).toString(36).padStart(6, '0');
    return `${prefix}-${encoded}`;
}

const TIER_SCORE: Record<RiskTier, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
};

function maxRiskTier(left: RiskTier, right: RiskTier): RiskTier {
    return TIER_SCORE[left] >= TIER_SCORE[right] ? left : right;
}

function selectCandidatesForAnomaly(anomaly: DetectedAnomaly, candidates: RootCauseCandidate[]) {
    const normalizedLabel = anomaly.label.toLowerCase();

    return candidates
        .map((candidate) => {
            const signalMatch = candidate.relatedSignals.includes(anomaly.signalId)
                || candidate.relatedSignals.some((signal) => normalizedLabel.includes(signal.toLowerCase()));

            const relevanceBoost = signalMatch ? 1 : 0.6;
            const score = clamp(candidate.likelihood * relevanceBoost * (0.7 + anomaly.severity * 0.3));

            return { candidate, score, signalMatch };
        })
        .filter((entry) => entry.score >= 0.25)
        .sort((a, b) => b.score - a.score);
}

export function analyzeRootCauses(
    anomalies: DetectedAnomaly[],
    candidates: RootCauseCandidate[]
): RootCauseResult {
    const findings: RootCauseFinding[] = [];
    const recommendations: CognitionRecommendation[] = [];

    for (const anomaly of anomalies) {
        const scoredCandidates = selectCandidatesForAnomaly(anomaly, candidates);
        if (scoredCandidates.length === 0) {
            continue;
        }

        const topCandidate = scoredCandidates[0].candidate;
        const likelihood = clamp(topCandidate.likelihood);
        const confidence = clamp((anomaly.confidence * 0.55) + (likelihood * 0.45));
        const inheritedRisk = topCandidate.riskTier || anomaly.riskTier;
        const riskTier = maxRiskTier(anomaly.riskTier, inheritedRisk);
        const findingId = deterministicId('finding', `${anomaly.anomalyId}:${topCandidate.causeId}`);

        const evidence = [
            ...anomaly.evidence,
            ...(topCandidate.evidence || [])
        ];

        const remediationHints = topCandidate.remediationHints?.length
            ? topCandidate.remediationHints
            : ['Collect trace-level telemetry to validate this hypothesis.'];

        const finding: RootCauseFinding = {
            findingId,
            anomalyId: anomaly.anomalyId,
            causeId: topCandidate.causeId,
            summary: topCandidate.summary,
            likelihood,
            confidence,
            riskTier,
            evidence,
            remediationHints
        };

        findings.push(finding);

        recommendations.push({
            recommendationId: deterministicId('rec-cause', findingId),
            title: `Validate root cause hypothesis: ${topCandidate.summary}`,
            reasoning: `Anomaly "${anomaly.label}" is most likely explained by "${topCandidate.summary}" (likelihood ${Math.round(likelihood * 100)}%).`,
            evidence,
            confidence,
            riskTier,
            requiresHumanApproval: riskTierRequiresApproval(riskTier),
            estimatedImpact: {
                summary: 'Root-cause validation improves remediation precision and reduces repeated incidents.',
                score: Math.round((likelihood * 60) + (anomaly.severity * 40))
            },
            verificationPlan: [
                'Run targeted diagnostics against the suspected subsystem.',
                'Validate causal link with before/after signal measurements.'
            ],
            priority: Math.round((confidence * 55) + (likelihood * 45))
        });
    }

    findings.sort((a, b) => {
        if (b.confidence !== a.confidence) return b.confidence - a.confidence;
        return b.likelihood - a.likelihood;
    });

    recommendations.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return { findings, recommendations };
}
