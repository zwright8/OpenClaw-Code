import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    adviseFundingAllocation,
    fundingAllocationToTasks,
    FundingAllocationAdvisor
} from '../index.js';

test('capability 98 funding allocation advisor', () => {
    runCapabilityChecks({
        buildReport: (input, options) => adviseFundingAllocation(input, {
            ...options,
            budget: 100_000,
            reserveRatio: 0.2
        }),
        toTasks: fundingAllocationToTasks,
        ClassCtor: FundingAllocationAdvisor,
        input: {
            programs: [
                { programId: 'prog-a', requestedFunding: 80_000, impactScore: 88, equityScore: 72, urgency: 80, executionRisk: 30 },
                { programId: 'prog-b', requestedFunding: 90_000, impactScore: 76, equityScore: 70, urgency: 74, executionRisk: 40 }
            ]
        },
        assertReport: (report) => {
            assert.equal(report.summary.programCount, 2);
            assert.equal(report.summary.unfundedCount >= 1, true);
        }
    });
});
