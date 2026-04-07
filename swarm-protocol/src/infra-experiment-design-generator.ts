import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Infra Experiment',
    readyPosture: 'infra_experiment_design_ready',
    defaultAgentId: 'agent:infra-experiment-design',
    recommendationTypes: {
        primary: 'generate_infra_experiment_design',
        guard: 'mitigate_infra_experiment_bias_risk',
        audit: 'audit_infra_experiment_design_signals',
        publish: 'publish_infra_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_infra_experiment_design: 'agent:infra',
        mitigate_infra_experiment_bias_risk: 'agent:research',
        audit_infra_experiment_design_signals: 'agent:trust',
        publish_infra_experiment_design_status: 'agent:ops'
    }
});

export function generateInfraExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraExperimentDesignGenerator extends BaseManager {}

export const __infraExperimentDesignGeneratorInternals = toolkit.internals;
