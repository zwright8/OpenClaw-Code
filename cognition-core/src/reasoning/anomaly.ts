export type RiskTier = 'low' | 'medium' | 'high' | 'critical';

export interface EvidenceItem {
    source: string;
    detail: string;
    confidence?: number;
}

export interface CognitionRecommendation {
    recommendationId: string;
    title: string;
    reasoning: string;
    evidence: EvidenceItem[];
    confidence: number;
    riskTier: RiskTier;
    requiresHumanApproval: boolean;
    estimatedImpact?: {
        summary: string;
        score: number;
    };
    verificationPlan?: string[];
    priority?: number;
}

export interface SignalSnapshot {
    signalId: string;
    label: string;
    currentValue: number;
    baselineValue: number;
    direction?: 'higher_is_worse' | 'lower_is_worse' | 'two_sided';
    evidence?: EvidenceItem[];
}

export interface DetectedAnomaly {
    anomalyId: string;
    signalId: string;
    label: string;
    currentValue: number;
    baselineValue: number;
    delta: number;
    deltaPct: number;
    severity: number;
    confidence: number;
    riskTier: RiskTier;
    evidence: EvidenceItem[];
}

export interface AnomalyDetectionResult {
    anomalies: DetectedAnomaly[];
    recommendations: CognitionRecommendation[];
}

export interface AnomalyDetectionOptions {
    warningThresholdPct?: number;
    criticalThresholdPct?: number;
}

const DEFAULT_OPTIONS: Required<AnomalyDetectionOptions> = {
    warningThresholdPct: 10,
    criticalThresholdPct: 60
};

function clamp(value: number, min = 0, max = 1) {
    return Math.max(min, Math.min(max, value));
}

function normalizeDirectionDelta(snapshot: SignalSnapshot) {
    const baseline = Math.abs(snapshot.baselineValue) || 1;
    const rawDelta = snapshot.currentValue - snapshot.baselineValue;

    if (snapshot.direction === 'lower_is_worse') {
        return ((snapshot.baselineValue - snapshot.currentValue) / baseline) * 100;
    }

    if (snapshot.direction === 'two_sided') {
        return (Math.abs(rawDelta) / baseline) * 100;
    }

    return (rawDelta / baseline) * 100;
}

export function riskTierRequiresApproval(riskTier: RiskTier) {
    return riskTier === 'high' || riskTier === 'critical';
}

export function severityToRiskTier(severity: number): RiskTier {
    if (severity >= 0.85) return 'critical';
    if (severity >= 0.6) return 'high';
    if (severity >= 0.35) return 'medium';
    return 'low';
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

export function detectAnomalies(
    snapshots: SignalSnapshot[],
    options: AnomalyDetectionOptions = {}
): AnomalyDetectionResult {
    const cfg = { ...DEFAULT_OPTIONS, ...options };
    const anomalies: DetectedAnomaly[] = [];
    const recommendations: CognitionRecommendation[] = [];

    for (const snapshot of snapshots) {
        if (!Number.isFinite(snapshot.currentValue) || !Number.isFinite(snapshot.baselineValue)) {
            continue;
        }

        const directionalDeltaPct = normalizeDirectionDelta(snapshot);
        if (directionalDeltaPct <= cfg.warningThresholdPct) {
            continue;
        }

        const rawDelta = snapshot.currentValue - snapshot.baselineValue;
        const severity = clamp(directionalDeltaPct / cfg.criticalThresholdPct);
        const confidence = clamp(
            0.45
                + (Math.min(directionalDeltaPct, cfg.criticalThresholdPct) / cfg.criticalThresholdPct) * 0.4
                + Math.min(snapshot.evidence?.length || 0, 4) * 0.05,
            0.4,
            0.99
        );
        const riskTier = severityToRiskTier(severity);
        const anomalyId = deterministicId('anomaly', `${snapshot.signalId}:${snapshot.currentValue}:${snapshot.baselineValue}`);

        const anomaly: DetectedAnomaly = {
            anomalyId,
            signalId: snapshot.signalId,
            label: snapshot.label,
            currentValue: snapshot.currentValue,
            baselineValue: snapshot.baselineValue,
            delta: rawDelta,
            deltaPct: directionalDeltaPct,
            severity,
            confidence,
            riskTier,
            evidence: snapshot.evidence?.length
                ? snapshot.evidence
                : [{ source: 'anomaly-detector', detail: 'Deviation exceeded configured threshold.' }]
        };

        anomalies.push(anomaly);

        recommendations.push({
            recommendationId: deterministicId('rec-anomaly', anomalyId),
            title: `Investigate anomaly: ${snapshot.label}`,
            reasoning: `Signal "${snapshot.label}" deviated ${directionalDeltaPct.toFixed(1)}% from baseline (${snapshot.baselineValue} → ${snapshot.currentValue}).`,
            evidence: anomaly.evidence,
            confidence,
            riskTier,
            requiresHumanApproval: riskTierRequiresApproval(riskTier),
            estimatedImpact: {
                summary: 'Potential operational degradation if unaddressed.',
                score: Math.round(severity * 100)
            },
            verificationPlan: [
                'Re-sample signal over next execution window.',
                'Confirm whether anomaly persists beyond transient noise.'
            ],
            priority: Math.round((severity * 70) + (confidence * 30))
        });
    }

    anomalies.sort((a, b) => {
        if (b.severity !== a.severity) return b.severity - a.severity;
        return b.confidence - a.confidence;
    });

    recommendations.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    return { anomalies, recommendations };
}
