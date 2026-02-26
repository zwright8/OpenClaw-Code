import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    correctCognitiveDrift,
    cognitiveDriftToTasks,
    CognitiveDriftCorrector
} from '../index.js';

test('capability 84 cognitive drift corrector', () => {
    runCapabilityChecks({
        buildReport: correctCognitiveDrift,
        toTasks: cognitiveDriftToTasks,
        ClassCtor: CognitiveDriftCorrector,
        input: {
            baselineObjectives: [
                { objectiveId: 'obj-safety', title: 'safety', weight: 90 },
                { objectiveId: 'obj-equity', title: 'equity', weight: 80 }
            ],
            recentDecisions: [{
                decisionId: 'dec-1',
                summary: 'Prioritize growth experiments over speed at all costs',
                strategicNovelty: 88,
                executionPressure: 82,
                riskScore: 74
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.outOfBoundsCount, 1);
            assert.equal(report.alerts.includes('strategic_drift_out_of_bounds'), true);
        }
    });
});
