import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    buildApiCompatibilityAdapter,
    apiCompatibilityToTasks,
    APICompatibilityAdapter
} from '../index.js';

test('capability 88 api compatibility adapter', () => {
    runCapabilityChecks({
        buildReport: buildApiCompatibilityAdapter,
        toTasks: apiCompatibilityToTasks,
        ClassCtor: APICompatibilityAdapter,
        input: {
            apiChanges: [{
                apiId: 'billing-api',
                fromVersion: 'v1',
                toVersion: 'v2',
                trafficShare: 42,
                criticality: 86,
                breakingChanges: [
                    { type: 'removed_field', path: 'invoice.total', severity: 82 },
                    { type: 'type_change', path: 'invoice.id', severity: 74 }
                ]
            }],
            existingAdapters: []
        },
        assertReport: (report) => {
            assert.equal(report.summary.requiresAdapterCount, 1);
            assert.equal(report.alerts.includes('api_adapter_gaps_detected'), true);
        }
    });
});
