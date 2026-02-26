import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Collab Experiment',
    readyPosture: 'collab_experiment_design_ready',
    defaultAgentId: 'agent:collab-experiment-design',
    recommendationTypes: {
        primary: 'generate_collab_experiment_design',
        guard: 'mitigate_collab_experiment_bias_risk',
        audit: 'audit_collab_experiment_design_signals',
        publish: 'publish_collab_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_collab_experiment_design: 'agent:collab',
        mitigate_collab_experiment_bias_risk: 'agent:research',
        audit_collab_experiment_design_signals: 'agent:trust',
        publish_collab_experiment_design_status: 'agent:ops'
    }
});

export function generateCollabExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabExperimentDesignGenerator extends BaseManager {}

export const __collabExperimentDesignGeneratorInternals = toolkit.internals;
