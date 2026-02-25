import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    planSupplyChainResilience,
    supplyChainResilienceToTasks,
    SupplyChainResiliencePlanner
} from '../index.js';

test('capability 99 supply chain resilience planner', () => {
    runCapabilityChecks({
        buildReport: planSupplyChainResilience,
        toTasks: supplyChainResilienceToTasks,
        ClassCtor: SupplyChainResiliencePlanner,
        input: {
            nodes: [{
                nodeId: 'supplier-a',
                tier: 1,
                leadTimeDays: 40,
                singleSource: true,
                disruptionRisk: 84,
                capacityScore: 36,
                substitutionScore: 20,
                inventoryBufferDays: 4
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.criticalFragilityCount, 1);
            assert.equal(report.alerts.includes('supply_chain_fragility_critical'), true);
        }
    });
});
