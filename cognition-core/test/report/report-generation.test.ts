import test from 'node:test';
import assert from 'node:assert/strict';
import { runFeedbackLoop } from '../../src/learning/feedback-loop.js';
import { buildScoreboard } from '../../src/report/scoreboard.js';
import { buildDailyJsonReport } from '../../src/report/json.js';
import { renderDailyMarkdownReport } from '../../src/report/markdown.js';

test('daily report builders produce JSON and markdown artifacts', () => {
    const loop = runFeedbackLoop(
        [
            { recommendationId: 'rec-1', owner: 'agent:a', confidence: 0.8 },
            { recommendationId: 'rec-2', owner: 'agent:b', confidence: 0.7 }
        ],
        [
            { taskId: 't1', recommendationId: 'rec-1', status: 'completed' },
            { taskId: 't2', recommendationId: 'rec-2', status: 'failed' }
        ],
        {
            generatedAt: '2026-02-28T00:00:00.000Z',
            thresholds: { minSampleSize: 1 }
        }
    );

    const scoreboard = buildScoreboard(loop);
    const report = buildDailyJsonReport(loop, scoreboard, {
        evaluationStatePath: 'skills/state/cognition-evaluation.json',
        jsonReportPath: 'cognition-core/reports/cognition-daily.json',
        markdownReportPath: 'cognition-core/reports/cognition-daily.md'
    });

    const markdown = renderDailyMarkdownReport(report);

    assert.equal(report.generatedAt, '2026-02-28T00:00:00.000Z');
    assert.equal(report.summary.outcomes, 2);
    assert.ok(Array.isArray(report.scoreboard.rows));
    assert.ok(markdown.includes('# Cognition Daily Report'));
    assert.ok(markdown.includes('## Scoreboard'));
    assert.ok(markdown.includes('skills/state/cognition-evaluation.json'));
});
