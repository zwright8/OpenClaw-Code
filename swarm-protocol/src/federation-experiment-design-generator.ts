import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Federation Experiment',
    readyPosture: 'federation_experiment_design_ready',
    defaultAgentId: 'agent:federation-experiment-design',
    recommendationTypes: {
        primary: 'generate_federation_experiment_design',
        guard: 'mitigate_federation_experiment_bias_risk',
        audit: 'audit_federation_experiment_design_signals',
        publish: 'publish_federation_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_federation_experiment_design: 'agent:federation',
        mitigate_federation_experiment_bias_risk: 'agent:research',
        audit_federation_experiment_design_signals: 'agent:trust',
        publish_federation_experiment_design_status: 'agent:ops'
    }
});

export function generateFederationExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationExperimentDesignGenerator extends BaseManager {}

export const __federationExperimentDesignGeneratorInternals = toolkit.internals;
