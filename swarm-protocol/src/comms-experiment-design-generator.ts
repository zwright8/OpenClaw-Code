import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Comms Experiment',
    readyPosture: 'comms_experiment_design_ready',
    defaultAgentId: 'agent:comms-experiment-design',
    recommendationTypes: {
        primary: 'generate_comms_experiment_design',
        guard: 'mitigate_comms_experiment_bias_risk',
        audit: 'audit_comms_experiment_design_signals',
        publish: 'publish_comms_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_comms_experiment_design: 'agent:comms',
        mitigate_comms_experiment_bias_risk: 'agent:research',
        audit_comms_experiment_design_signals: 'agent:trust',
        publish_comms_experiment_design_status: 'agent:ops'
    }
});

export function generateCommsExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsExperimentDesignGenerator extends BaseManager {}

export const __commsExperimentDesignGeneratorInternals = toolkit.internals;
