import type { FeedbackLoopResult } from '../learning/feedback-loop.js';

export type ScoreStatus = 'pass' | 'warn' | 'fail' | 'n/a';

export interface ScoreboardRow {
    metric: string;
    label: string;
    value: number | null;
    target: string;
    status: ScoreStatus;
    detail: string;
}

export interface Scoreboard {
    overall: Exclude<ScoreStatus, 'n/a'>;
    rows: ScoreboardRow[];
}

function round(value: number, decimals = 4): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
}

function statusRank(status: ScoreStatus): number {
    if (status === 'fail') return 0;
    if (status === 'warn') return 1;
    if (status === 'pass') return 2;
    return 3;
}

function classify(
    value: number | null,
    pass: (v: number) => boolean,
    warn: (v: number) => boolean
): ScoreStatus {
    if (value === null) return 'n/a';
    if (pass(value)) return 'pass';
    if (warn(value)) return 'warn';
    return 'fail';
}

function formatNullable(value: number | null): string {
    return value === null ? 'n/a' : `${round(value)}`;
}

function formatBoolean(value: boolean | undefined): string {
    return value === undefined ? 'n/a' : String(value);
}

function formatReadinessFlags(sampleReadiness: CalibrationSampleReadinessSnapshot): string {
    return `readiness_flags(sample_size_ready=${sampleReadiness.isSampleSizeReady},mapping_rate_ready=${sampleReadiness.isMappingRateReady},sample_size_shortfall=${sampleReadiness.sampleSizeShortfall},mapping_rate_shortfall=${formatNullable(sampleReadiness.mappingRateShortfall)})`;
}

function inferReadiness(
    terminalOutcomes: number,
    mappedOutcomes: number,
    sampleReadiness: CalibrationSampleReadinessSnapshot
): CalibrationReadiness {
    if (terminalOutcomes === 0) return 'no_terminal_outcomes';
    if (mappedOutcomes === 0) return 'no_mapped_outcomes';
    if (!sampleReadiness.isSampleSizeReady) return 'insufficient_sample_size';
    if (!sampleReadiness.isMappingRateReady) return 'insufficient_mapping_rate';
    return 'ready';
}

function buildCalibrationReason(snapshot: Omit<CalibrationGateSnapshot, 'reason'>): string {
    const mappingRateText = formatNullable(snapshot.mappingRate);
    const minimumMappingRateText = formatNullable(snapshot.minimumMappingRate);
    const mappingRateShortfallText = formatNullable(snapshot.sampleReadiness.mappingRateShortfall);

    switch (snapshot.readiness) {
        case 'ready':
            return `Calibration metrics active: sample-size and mapping-rate gates satisfied; mapped_outcomes=${snapshot.mappedOutcomes}; terminal_outcomes=${snapshot.terminalOutcomes}; mapping_rate=${mappingRateText}`;
        case 'no_terminal_outcomes':
            return `Calibration metrics deferred: no terminal outcomes yet; sample_size_shortfall=${snapshot.sampleReadiness.sampleSizeShortfall}; mapping_rate_shortfall=${mappingRateShortfallText}`;
        case 'no_mapped_outcomes':
            return `Calibration metrics deferred: no mapped outcomes yet; mapped_outcomes=${snapshot.mappedOutcomes}; terminal_outcomes=${snapshot.terminalOutcomes}; mapping_rate=${mappingRateText}; sample_size_shortfall=${snapshot.sampleReadiness.sampleSizeShortfall}; mapping_rate_shortfall=${mappingRateShortfallText}`;
        case 'insufficient_mapping_rate':
            return `Calibration metrics deferred: mapping rate ${mappingRateText} is below minimum ${minimumMappingRateText}; sample_size_shortfall=${snapshot.sampleReadiness.sampleSizeShortfall}; mapping_rate_shortfall=${mappingRateShortfallText}`;
        case 'insufficient_sample_size':
            return `Calibration metrics deferred: mapped sample ${snapshot.mappedOutcomes} is below minimum ${snapshot.minimumSampleSize}; sample_size_shortfall=${snapshot.sampleReadiness.sampleSizeShortfall}; mapping_rate=${mappingRateText}; minimum_mapping_rate=${minimumMappingRateText}; mapping_rate_shortfall=${mappingRateShortfallText}`;
        default:
            return `Calibration readiness unresolved; mapped_outcomes=${snapshot.mappedOutcomes}; terminal_outcomes=${snapshot.terminalOutcomes}; mapping_rate=${mappingRateText}; sample_size_shortfall=${snapshot.sampleReadiness.sampleSizeShortfall}; mapping_rate_shortfall=${mappingRateShortfallText}`;
    }
}

function resolveCalibrationGateSnapshot(metrics: FeedbackLoopResult['evaluation']['metrics']): CalibrationGateSnapshot {
    const diagnostics = metrics.calibrationDiagnostics as Record<string, unknown> | undefined;
    const terminalOutcomes = resolveTerminalOutcomes(metrics);
    const mappedOutcomes = diagnostics
        ? toFiniteInteger(diagnostics.observedMappedOutcomes ?? diagnostics.observedSampleSize, 0)
        : 0;
    const minimumSampleSize = diagnostics
        ? toFiniteInteger(diagnostics.minimumSampleSize, DEFAULT_CALIBRATION_MIN_SAMPLE_SIZE)
        : DEFAULT_CALIBRATION_MIN_SAMPLE_SIZE;
    const minimumMappingRate = diagnostics
        ? toNullableFiniteNumber(diagnostics.minimumMappingRate) ?? DEFAULT_CALIBRATION_MIN_MAPPING_RATE
        : DEFAULT_CALIBRATION_MIN_MAPPING_RATE;

    const mappingRateRaw = terminalOutcomes > 0
        ? mappedOutcomes / terminalOutcomes
        : 0;
    const mappingRate = round(mappingRateRaw);

    const sampleSizeShortfall = Math.max(0, minimumSampleSize - mappedOutcomes);
    const mappingRateShortfall = round(Math.max(0, minimumMappingRate - mappingRateRaw));
    const sampleReadiness: CalibrationSampleReadinessSnapshot = {
        isSampleSizeReady: sampleSizeShortfall === 0,
        isMappingRateReady: mappingRateShortfall === 0,
        sampleSizeShortfall,
        mappingRateShortfall
    };

    const readinessCandidate = diagnostics?.readiness;
    const readiness = typeof readinessCandidate === 'string' && readinessCandidate.length > 0
        ? (readinessCandidate as CalibrationReadiness)
        : inferReadiness(terminalOutcomes, mappedOutcomes, sampleReadiness);

    const snapshotBase: Omit<CalibrationGateSnapshot, 'reason'> = {
        readiness,
        mappedOutcomes,
        terminalOutcomes,
        mappingRate,
        minimumSampleSize,
        minimumMappingRate,
        sampleReadiness
    };

    return {
        ...snapshotBase,
        reason: buildCalibrationReason(snapshotBase)
    };
}

function toFiniteInteger(value: unknown, fallback = 0): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return Math.max(0, Math.round(fallback));
    }

    return Math.max(0, Math.round(parsed));
}

function toNullableFiniteNumber(value: unknown): number | null {
    if (value === null || value === undefined) {
        return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
}

const DEFAULT_CALIBRATION_ENVELOPE_METHOD = 'hoeffding';
const DEFAULT_CALIBRATION_MIN_SAMPLE_SIZE = 3;
const DEFAULT_CALIBRATION_MIN_MAPPING_RATE = 0.35;

type CalibrationReadiness =
    | 'ready'
    | 'insufficient_sample_size'
    | 'insufficient_mapping_rate'
    | 'no_terminal_outcomes'
    | 'no_mapped_outcomes'
    | 'unknown';

interface CalibrationSampleReadinessSnapshot {
    isSampleSizeReady: boolean;
    isMappingRateReady: boolean;
    sampleSizeShortfall: number;
    mappingRateShortfall: number;
}

interface CalibrationGateSnapshot {
    readiness: CalibrationReadiness;
    mappedOutcomes: number;
    terminalOutcomes: number;
    mappingRate: number;
    minimumSampleSize: number;
    minimumMappingRate: number;
    sampleReadiness: CalibrationSampleReadinessSnapshot;
    reason: string;
}

function normalizeDetailSegment(segment: string): string {
    return segment.trim().replace(/[.\s]+$/g, '');
}

function composeDetail(...segments: Array<string | null | undefined>): string {
    const normalized = segments
        .map((segment) => (segment ?? '').trim())
        .filter((segment) => segment.length > 0)
        .map(normalizeDetailSegment);

    if (normalized.length === 0) {
        return '';
    }

    return `${normalized.join('. ')}.`;
}

function resolveTerminalOutcomes(metrics: FeedbackLoopResult['evaluation']['metrics']): number {
    return Number.isFinite((metrics as { terminalOutcomes?: number }).terminalOutcomes)
        ? Math.max(0, Math.round((metrics as { terminalOutcomes?: number }).terminalOutcomes ?? 0))
        : metrics.totalOutcomes;
}

function describeConfidenceEnvelope(metrics: FeedbackLoopResult['evaluation']['metrics']): string {
    const diagnostics = metrics.calibrationDiagnostics;
    const envelope = diagnostics?.confidenceEnvelope;

    if (!diagnostics && !envelope) {
        return '';
    }

    const envelopeRecord = (envelope ?? {}) as Record<string, unknown>;
    const methodCandidate = envelopeRecord.method;
    const method = typeof methodCandidate === 'string' && methodCandidate.trim().length > 0
        ? methodCandidate.trim()
        : DEFAULT_CALIBRATION_ENVELOPE_METHOD;

    const fallbackSampleSize = diagnostics
        ? toFiniteInteger((diagnostics as { observedSampleSize?: unknown }).observedSampleSize, 0)
        : 0;

    return `confidence_envelope: confidence_level=${formatNullable(toNullableFiniteNumber(envelopeRecord.confidenceLevel ?? null))};method=${method};sample_size=${toFiniteInteger(envelopeRecord.sampleSize, fallbackSampleSize)};predicted_success_mean=${formatNullable(toNullableFiniteNumber(envelopeRecord.predictedSuccessMean ?? null))};observed_success_mean=${formatNullable(toNullableFiniteNumber(envelopeRecord.observedSuccessMean ?? null))};observed_success_lower=${formatNullable(toNullableFiniteNumber(envelopeRecord.observedSuccessLowerBound ?? null))};observed_success_upper=${formatNullable(toNullableFiniteNumber(envelopeRecord.observedSuccessUpperBound ?? null))};calibration_gap_lower=${formatNullable(toNullableFiniteNumber(envelopeRecord.calibrationGapLowerBound ?? null))};calibration_gap_upper=${formatNullable(toNullableFiniteNumber(envelopeRecord.calibrationGapUpperBound ?? null))}`;
}

function describeCalibrationGate(metrics: FeedbackLoopResult['evaluation']['metrics']): string {
    const diagnostics = metrics.calibrationDiagnostics;
    if (!diagnostics) {
        return 'calibration_gate: readiness=unknown;mapped_outcomes=n/a;terminal_outcomes=n/a;mapping_rate=n/a;min_sample_size=n/a;min_mapping_rate=n/a;sample_size_ready=n/a;mapping_rate_ready=n/a;sample_size_shortfall=n/a;mapping_rate_shortfall=n/a';
    }

    const snapshot = resolveCalibrationGateSnapshot(metrics);

    return `calibration_gate: readiness=${snapshot.readiness};mapped_outcomes=${snapshot.mappedOutcomes};terminal_outcomes=${snapshot.terminalOutcomes};mapping_rate=${formatNullable(snapshot.mappingRate)};min_sample_size=${snapshot.minimumSampleSize};min_mapping_rate=${formatNullable(snapshot.minimumMappingRate)};sample_size_ready=${formatBoolean(snapshot.sampleReadiness.isSampleSizeReady)};mapping_rate_ready=${formatBoolean(snapshot.sampleReadiness.isMappingRateReady)};sample_size_shortfall=${snapshot.sampleReadiness.sampleSizeShortfall};mapping_rate_shortfall=${formatNullable(snapshot.sampleReadiness.mappingRateShortfall)};reason=${snapshot.reason}.;${formatReadinessFlags(snapshot.sampleReadiness)}`;
}

function describeCalibrationSuppression(
    metrics: FeedbackLoopResult['evaluation']['metrics'],
    fallback: string
): string {
    const diagnostics = metrics.calibrationDiagnostics;
    if (!diagnostics) {
        return composeDetail(fallback);
    }

    const snapshot = resolveCalibrationGateSnapshot(metrics);
    if (snapshot.readiness === 'ready') {
        return composeDetail(fallback);
    }

    return composeDetail(
        fallback,
        describeCalibrationGate(metrics),
        describeConfidenceEnvelope(metrics)
    );
}

function classifyCalibrationMetric(
    metrics: FeedbackLoopResult['evaluation']['metrics'],
    value: number | null,
    pass: (v: number) => boolean,
    warn: (v: number) => boolean
): ScoreStatus {
    const readiness = metrics.calibrationDiagnostics
        ? resolveCalibrationGateSnapshot(metrics).readiness
        : undefined;
    if (readiness && readiness !== 'ready') {
        return 'n/a';
    }

    return classify(value, pass, warn);
}

export function buildScoreboard(loopResult: FeedbackLoopResult): Scoreboard {
    const metrics = loopResult.evaluation.metrics;
    const terminalOutcomes = resolveTerminalOutcomes(metrics);
    const confidenceEnvelopeDetail = describeConfidenceEnvelope(metrics);

    const rows: ScoreboardRow[] = [
        {
            metric: 'success_rate',
            label: 'Outcome success rate',
            value: terminalOutcomes > 0 ? round(metrics.successRate) : null,
            target: '>= 0.80',
            status: terminalOutcomes > 0
                ? classify(
                    metrics.successRate,
                    (value) => value >= 0.8,
                    (value) => value >= 0.7
                )
                : 'n/a',
            detail: terminalOutcomes > 0
                ? `${metrics.successfulOutcomes}/${terminalOutcomes} successful terminal outcomes`
                : 'No terminal outcomes yet; awaiting execution completion/approval.'
        },
        {
            metric: 'mapping_rate',
            label: 'Recommendation coverage',
            value: terminalOutcomes > 0 ? round(metrics.mappingRate) : null,
            target: '>= 0.70',
            status: terminalOutcomes > 0
                ? classify(
                    metrics.mappingRate,
                    (value) => value >= 0.7,
                    (value) => value >= 0.5
                )
                : 'n/a',
            detail: terminalOutcomes > 0
                ? `${metrics.mappedOutcomes}/${terminalOutcomes} terminal outcomes mapped to predictions`
                : 'Coverage unavailable until terminal outcomes are recorded.'
        },
        {
            metric: 'brier_score',
            label: 'Prediction reliability (Brier)',
            value: metrics.brierScore,
            target: '<= 0.20',
            status: classifyCalibrationMetric(
                metrics,
                metrics.brierScore,
                (value) => value <= 0.2,
                (value) => value <= 0.3
            ),
            detail: metrics.brierScore === null
                ? describeCalibrationSuppression(metrics, 'No mapped predictions to score')
                : composeDetail(
                    `Lower is better. Current Brier score ${metrics.brierScore}`,
                    describeCalibrationGate(metrics),
                    confidenceEnvelopeDetail
                )
        },
        {
            metric: 'calibration_gap',
            label: 'Calibration gap',
            value: metrics.calibrationGap,
            target: '<= 0.20',
            status: classifyCalibrationMetric(
                metrics,
                metrics.calibrationGap,
                (value) => value <= 0.2,
                (value) => value <= 0.3
            ),
            detail: metrics.calibrationGap === null
                ? describeCalibrationSuppression(metrics, 'No mapped predictions to calibrate')
                : composeDetail(
                    `Difference between predicted and observed success: ${metrics.calibrationGap}`,
                    describeCalibrationGate(metrics),
                    confidenceEnvelopeDetail
                )
        }
    ];

    const overall = rows.reduce<Exclude<ScoreStatus, 'n/a'>>((worst, row) => {
        if (row.status === 'n/a') return worst;
        return statusRank(row.status) < statusRank(worst)
            ? row.status
            : worst;
    }, 'pass');

    return {
        overall,
        rows
    };
}
