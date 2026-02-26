import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    tuneExecutionAutonomy,
    autonomyDialToTasks,
    ExecutionAutonomyDial
} from '../index.js';

test('capability 82 execution autonomy dial', () => {
    runCapabilityChecks({
        buildReport: tuneExecutionAutonomy,
        toTasks: autonomyDialToTasks,
        ClassCtor: ExecutionAutonomyDial,
        input: {
            actions: [{
                actionId: 'action-prod-delete',
                riskScore: 88,
                confidenceScore: 44,
                reversibility: 12,
                blastRadius: 92,
                dataSensitivity: 86,
                currentAutonomy: 'full_auto'
            }],
            capacity: { operatorReviewSlots: 1, maxAutonomousConcurrency: 1 }
        },
        assertReport: (report) => {
            assert.equal(report.decisions[0].recommendedAutonomy, 'manual_only');
            assert.equal(report.summary.posture === 'guarded' || report.summary.posture === 'restricted', true);
        }
    });
});
