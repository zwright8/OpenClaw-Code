import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Logistics Experiment',
    readyPosture: 'logistics_experiment_design_ready',
    defaultAgentId: 'agent:logistics-experiment-design',
    recommendationTypes: {
        primary: 'generate_logistics_experiment_design',
        guard: 'mitigate_logistics_experiment_bias_risk',
        audit: 'audit_logistics_experiment_design_signals',
        publish: 'publish_logistics_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_logistics_experiment_design: 'agent:logistics',
        mitigate_logistics_experiment_bias_risk: 'agent:research',
        audit_logistics_experiment_design_signals: 'agent:trust',
        publish_logistics_experiment_design_status: 'agent:ops'
    }
});

export function generateLogisticsExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsExperimentDesignGenerator extends BaseManager {}

export const __logisticsExperimentDesignGeneratorInternals = toolkit.internals;
