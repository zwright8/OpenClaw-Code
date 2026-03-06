import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Experiment',
    readyPosture: 'experiment_design_ready',
    defaultAgentId: 'agent:tooling-experiment-design',
    recommendationTypes: {
        primary: 'generate_experiment_design',
        guard: 'mitigate_experiment_bias_risk',
        audit: 'audit_experiment_design_signals',
        publish: 'publish_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_experiment_design: 'agent:research',
        mitigate_experiment_bias_risk: 'agent:science',
        audit_experiment_design_signals: 'agent:trust',
        publish_experiment_design_status: 'agent:ops'
    }
});

export function generateToolingExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingExperimentDesignGenerator extends BaseManager {}

export const __toolingExperimentDesignGeneratorInternals = toolkit.internals;
