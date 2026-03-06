import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'energy_efficiency_optimizer',
    collectionField: 'facilities',
    idField: 'facilityId',
    defaultName: 'Facility',
    readyPosture: 'efficiency_optimized',
    defaultAgentId: 'agent:energy-efficiency',
    recommendationTypes: {
        primary: 'deploy_efficiency_upgrades',
        guard: 'reduce_energy_waste',
        audit: 'audit_energy_telemetry',
        publish: 'publish_energy_efficiency_plan'
    },
    recommendationTargetMap: {
        deploy_efficiency_upgrades: 'agent:operations',
        reduce_energy_waste: 'agent:facilities',
        audit_energy_telemetry: 'agent:observability',
        publish_energy_efficiency_plan: 'agent:ops'
    }
});

export function optimizeEnergyEfficiency(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function energyEfficiencyToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EnergyEfficiencyOptimizer extends BaseManager {}

export const __energyEfficiencyOptimizerInternals = toolkit.internals;
