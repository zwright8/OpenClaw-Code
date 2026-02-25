import test from 'node:test';
import assert from 'node:assert/strict';
import {
    runDataQualitySentinel,
    dataQualityToTasks,
    DataQualitySentinel
} from '../index.js';

function baseInput() {
    return {
        datasets: [
            {
                datasetId: 'dataset-claims',
                freshnessHours: 42,
                completeness: 58,
                validity: 62,
                driftRisk: 66,
                schemaStability: 54,
                labelQuality: 60,
                anomalyRate: 44
            },
            {
                datasetId: 'dataset-benefits',
                freshnessHours: 8,
                completeness: 84,
                validity: 86,
                driftRisk: 20,
                schemaStability: 88,
                labelQuality: 82,
                anomalyRate: 12
            }
        ]
    };
}

test('runDataQualitySentinel identifies degraded data posture and drift pressure', () => {
    const report = runDataQualitySentinel(baseInput(), {
        now: () => 2_200_000
    });

    assert.equal(report.summary.datasetCount, 2);
    assert.equal(report.summary.tierCounts.degraded + report.summary.tierCounts.watch + report.summary.tierCounts.healthy, 2);
    assert.equal(
        report.alerts.includes('data_quality_degraded_present')
        || report.alerts.includes('data_backfill_required')
        || report.alerts.includes('data_drift_risk_high'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'trigger_data_backfill' || entry.type === 'launch_drift_investigation'
    )), true);
});

test('runDataQualitySentinel returns healthy posture for high-integrity datasets', () => {
    const report = runDataQualitySentinel({
        datasets: [
            {
                datasetId: 'dataset-ok',
                freshnessHours: 2,
                completeness: 96,
                validity: 94,
                driftRisk: 8,
                schemaStability: 96,
                labelQuality: 94,
                anomalyRate: 4
            }
        ]
    }, {
        now: () => 2_201_000
    });

    assert.equal(report.summary.posture, 'healthy');
    assert.equal(report.summary.tierCounts.degraded, 0);
});

test('dataQualityToTasks and class wrapper emit schema-valid tasks and history', () => {
    const sentinel = new DataQualitySentinel({
        localAgentId: 'agent:data-quality-local',
        now: () => 2_202_000
    });

    const report = sentinel.evaluate(baseInput());
    const tasks = dataQualityToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = sentinel.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:data-quality-local');
    assert.equal(sentinel.listHistory({ limit: 5 }).length, 1);
});
