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

export function buildScoreboard(loopResult: FeedbackLoopResult): Scoreboard {
    const metrics = loopResult.evaluation.metrics;
    const terminalOutcomes = Number.isFinite((metrics as { terminalOutcomes?: number }).terminalOutcomes)
        ? Math.max(0, Math.round((metrics as { terminalOutcomes?: number }).terminalOutcomes ?? 0))
        : metrics.totalOutcomes;

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
            status: classify(
                metrics.brierScore,
                (value) => value <= 0.2,
                (value) => value <= 0.3
            ),
            detail: metrics.brierScore === null
                ? 'No mapped predictions to score'
                : `Lower is better. Current Brier score ${metrics.brierScore}`
        },
        {
            metric: 'calibration_gap',
            label: 'Calibration gap',
            value: metrics.calibrationGap,
            target: '<= 0.20',
            status: classify(
                metrics.calibrationGap,
                (value) => value <= 0.2,
                (value) => value <= 0.3
            ),
            detail: metrics.calibrationGap === null
                ? 'No mapped predictions to calibrate'
                : `Difference between predicted and observed success: ${metrics.calibrationGap}`
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
