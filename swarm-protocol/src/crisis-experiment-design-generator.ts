import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Crisis Experiment',
    readyPosture: 'crisis_experiment_design_ready',
    defaultAgentId: 'agent:crisis-experiment-design',
    recommendationTypes: {
        primary: 'generate_crisis_experiment_design',
        guard: 'mitigate_crisis_experiment_bias_risk',
        audit: 'audit_crisis_experiment_design_signals',
        publish: 'publish_crisis_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_crisis_experiment_design: 'agent:crisis',
        mitigate_crisis_experiment_bias_risk: 'agent:research',
        audit_crisis_experiment_design_signals: 'agent:trust',
        publish_crisis_experiment_design_status: 'agent:ops'
    }
});

export function generateCrisisExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisExperimentDesignGenerator extends BaseManager {}

export const __crisisExperimentDesignGeneratorInternals = toolkit.internals;
