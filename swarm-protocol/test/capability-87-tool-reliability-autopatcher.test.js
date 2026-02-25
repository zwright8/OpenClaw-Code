import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    runToolReliabilityAutopatcher,
    autopatcherToTasks,
    ToolReliabilityAutopatcher
} from '../index.js';

test('capability 87 tool reliability autopatcher', () => {
    runCapabilityChecks({
        buildReport: runToolReliabilityAutopatcher,
        toTasks: autopatcherToTasks,
        ClassCtor: ToolReliabilityAutopatcher,
        input: {
            toolRuns: [
                { tool: 'tool:deploy', success: false, latencyMs: 4200, errorCode: 'timeout', severity: 84 },
                { tool: 'tool:deploy', success: false, latencyMs: 4100, errorCode: 'timeout', severity: 82 },
                { tool: 'tool:deploy', success: true, latencyMs: 1100, severity: 36 },
                { tool: 'tool:lint', success: true, latencyMs: 300, severity: 20 }
            ],
            patchLibrary: [
                { patchId: 'patch-timeout', tool: 'tool:deploy', errorCode: 'timeout', estimatedFixRate: 78, risk: 30 }
            ]
        },
        assertReport: (report) => {
            assert.equal(report.summary.flakyCount >= 1, true);
            assert.equal(report.alerts.includes('flaky_tools_detected'), true);
        }
    });
});
