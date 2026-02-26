import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Engineering Experiment',
    readyPosture: 'engineering_experiment_design_ready',
    defaultAgentId: 'agent:engineering-experiment-design',
    recommendationTypes: {
        primary: 'generate_engineering_experiment_design',
        guard: 'mitigate_engineering_experiment_bias_risk',
        audit: 'audit_engineering_experiment_design_signals',
        publish: 'publish_engineering_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_engineering_experiment_design: 'agent:engineering',
        mitigate_engineering_experiment_bias_risk: 'agent:research',
        audit_engineering_experiment_design_signals: 'agent:trust',
        publish_engineering_experiment_design_status: 'agent:ops'
    }
});

export function generateEngineeringExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringExperimentDesignGenerator extends BaseManager {}

export const __engineeringExperimentDesignGeneratorInternals = toolkit.internals;
