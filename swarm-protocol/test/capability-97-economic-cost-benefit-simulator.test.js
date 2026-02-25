import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    simulateEconomicCostBenefit,
    economicSimulationToTasks,
    EconomicCostBenefitSimulator
} from '../index.js';

test('capability 97 economic cost-benefit simulator', () => {
    runCapabilityChecks({
        buildReport: simulateEconomicCostBenefit,
        toTasks: economicSimulationToTasks,
        ClassCtor: EconomicCostBenefitSimulator,
        input: {
            interventions: [
                {
                    interventionId: 'int-positive',
                    upfrontCost: 100_000,
                    annualBenefit: 90_000,
                    annualCost: 20_000,
                    probabilityOfSuccess: 72,
                    horizonYears: 4,
                    externalityImpact: 10_000
                },
                {
                    interventionId: 'int-negative',
                    upfrontCost: 120_000,
                    annualBenefit: 10_000,
                    annualCost: 25_000,
                    probabilityOfSuccess: 40,
                    horizonYears: 2,
                    externalityImpact: -5_000
                }
            ]
        },
        assertReport: (report) => {
            assert.equal(report.summary.interventionCount, 2);
            assert.equal(report.summary.negativeNpvCount >= 1, true);
        }
    });
});
