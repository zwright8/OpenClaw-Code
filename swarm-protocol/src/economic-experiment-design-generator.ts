import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Economic Experiment',
    readyPosture: 'economic_experiment_design_ready',
    defaultAgentId: 'agent:economic-experiment-design',
    recommendationTypes: {
        primary: 'generate_economic_experiment_design',
        guard: 'mitigate_economic_experiment_bias_risk',
        audit: 'audit_economic_experiment_design_signals',
        publish: 'publish_economic_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_economic_experiment_design: 'agent:economic',
        mitigate_economic_experiment_bias_risk: 'agent:research',
        audit_economic_experiment_design_signals: 'agent:trust',
        publish_economic_experiment_design_status: 'agent:ops'
    }
});

export function generateEconomicExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicExperimentDesignGenerator extends BaseManager {}

export const __economicExperimentDesignGeneratorInternals = toolkit.internals;
