import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Oversight Experiment',
    readyPosture: 'oversight_experiment_design_ready',
    defaultAgentId: 'agent:oversight-experiment-design',
    recommendationTypes: {
        primary: 'generate_oversight_experiment_design',
        guard: 'mitigate_oversight_experiment_bias_risk',
        audit: 'audit_oversight_experiment_design_signals',
        publish: 'publish_oversight_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_oversight_experiment_design: 'agent:oversight',
        mitigate_oversight_experiment_bias_risk: 'agent:research',
        audit_oversight_experiment_design_signals: 'agent:trust',
        publish_oversight_experiment_design_status: 'agent:ops'
    }
});

export function generateOversightExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightExperimentDesignGenerator extends BaseManager {}

export const __oversightExperimentDesignGeneratorInternals = toolkit.internals;
