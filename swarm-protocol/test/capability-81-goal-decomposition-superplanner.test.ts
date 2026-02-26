import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    decomposeGoalSuperplan,
    superplanToTasks,
    GoalDecompositionSuperplanner
} from '../index.js';

test('capability 81 goal decomposition superplanner', () => {
    runCapabilityChecks({
        buildReport: decomposeGoalSuperplan,
        toTasks: superplanToTasks,
        ClassCtor: GoalDecompositionSuperplanner,
        input: {
            goals: [
                {
                    goalId: 'goal-ship',
                    title: 'Ship migration',
                    urgency: 84,
                    complexity: 78,
                    riskScore: 72,
                    dependencies: ['goal-audit'],
                    requiredCapabilities: ['deploy']
                },
                {
                    goalId: 'goal-audit',
                    title: 'Audit migration readiness',
                    urgency: 68,
                    complexity: 42,
                    riskScore: 40
                }
            ],
            capacity: { maxParallelWaves: 2, executionBudget: 120 }
        },
        assertReport: (report) => {
            assert.ok(report.planNodes.length >= 8);
            assert.equal(report.summary.blockerCount > 0, true);
        }
    });
});
