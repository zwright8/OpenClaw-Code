import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Inclusion Experiment',
    readyPosture: 'inclusion_experiment_design_ready',
    defaultAgentId: 'agent:inclusion-experiment-design',
    recommendationTypes: {
        primary: 'generate_inclusion_experiment_designs',
        guard: 'mitigate_inclusion_experiment_bias',
        audit: 'audit_inclusion_experiment_design_signals',
        publish: 'publish_inclusion_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_inclusion_experiment_designs: 'agent:inclusion',
        mitigate_inclusion_experiment_bias: 'agent:policy',
        audit_inclusion_experiment_design_signals: 'agent:trust',
        publish_inclusion_experiment_design_status: 'agent:ops'
    }
});

export function generateInclusionExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionExperimentDesignGenerator extends BaseManager {}

export const __inclusionExperimentDesignGeneratorInternals = toolkit.internals;
