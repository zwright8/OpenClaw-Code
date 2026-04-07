import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Observability Experiment',
    readyPosture: 'observability_experiment_design_ready',
    defaultAgentId: 'agent:observability-experiment-design',
    recommendationTypes: {
        primary: 'generate_observability_experiment_design',
        guard: 'mitigate_observability_experiment_bias_risk',
        audit: 'audit_observability_experiment_design_signals',
        publish: 'publish_observability_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_observability_experiment_design: 'agent:observability',
        mitigate_observability_experiment_bias_risk: 'agent:research',
        audit_observability_experiment_design_signals: 'agent:trust',
        publish_observability_experiment_design_status: 'agent:ops'
    }
});

export function generateObservabilityExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityExperimentDesignGenerator extends BaseManager {}

export const __observabilityExperimentDesignGeneratorInternals = toolkit.internals;
