import type { FeedbackLoopResult } from '../learning/feedback-loop.js';
import type { Scoreboard } from './scoreboard.js';

export interface DailyJsonReport {
    generatedAt: string;
    headline: string;
    summary: {
        overall: Scoreboard['overall'];
        successRate: number;
        outcomes: number;
        mappedOutcomes: number;
    };
    scoreboard: Scoreboard;
    evaluation: FeedbackLoopResult['evaluation'];
    thresholdTuning: FeedbackLoopResult['thresholdTuning'];
    skillSignals: FeedbackLoopResult['skillSignals'];
    artifacts: {
        evaluationStatePath: string;
        markdownReportPath: string;
        jsonReportPath: string;
    };
}

export function buildDailyJsonReport(
    loopResult: FeedbackLoopResult,
    scoreboard: Scoreboard,
    artifacts: {
        evaluationStatePath: string;
        markdownReportPath: string;
        jsonReportPath: string;
    },
    generatedAt = loopResult.generatedAt
): DailyJsonReport {
    const metrics = loopResult.evaluation.metrics;
    const headline = scoreboard.overall === 'pass'
        ? 'Cognition quality is healthy for this run.'
        : scoreboard.overall === 'warn'
            ? 'Cognition quality is stable but needs tuning.'
            : 'Cognition quality is degraded and requires intervention.';

    return {
        generatedAt,
        headline,
        summary: {
            overall: scoreboard.overall,
            successRate: metrics.successRate,
            outcomes: metrics.totalOutcomes,
            mappedOutcomes: metrics.mappedOutcomes
        },
        scoreboard,
        evaluation: loopResult.evaluation,
        thresholdTuning: loopResult.thresholdTuning,
        skillSignals: loopResult.skillSignals,
        artifacts
    };
}
