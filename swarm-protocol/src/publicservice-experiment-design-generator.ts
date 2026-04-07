import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'PublicService Experiment',
    readyPosture: 'publicservice_experiment_design_ready',
    defaultAgentId: 'agent:publicservice-experiment-design',
    recommendationTypes: {
        primary: 'generate_publicservice_experiment_design',
        guard: 'mitigate_publicservice_experiment_bias_risk',
        audit: 'audit_publicservice_experiment_design_signals',
        publish: 'publish_publicservice_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_publicservice_experiment_design: 'agent:publicservice',
        mitigate_publicservice_experiment_bias_risk: 'agent:research',
        audit_publicservice_experiment_design_signals: 'agent:trust',
        publish_publicservice_experiment_design_status: 'agent:ops'
    }
});

export function generatePublicServiceExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceExperimentDesignGenerator extends BaseManager {}

export const __publicServiceExperimentDesignGeneratorInternals = toolkit.internals;
