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

    const rows: ScoreboardRow[] = [
        {
            metric: 'success_rate',
            label: 'Outcome success rate',
            value: round(metrics.successRate),
            target: '>= 0.80',
            status: classify(
                metrics.successRate,
                (value) => value >= 0.8,
                (value) => value >= 0.7
            ),
            detail: `${metrics.successfulOutcomes}/${metrics.totalOutcomes} successful outcomes`
        },
        {
            metric: 'mapping_rate',
            label: 'Recommendation coverage',
            value: round(metrics.mappingRate),
            target: '>= 0.70',
            status: classify(
                metrics.mappingRate,
                (value) => value >= 0.7,
                (value) => value >= 0.5
            ),
            detail: `${metrics.mappedOutcomes}/${metrics.totalOutcomes} outcomes mapped to predictions`
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
