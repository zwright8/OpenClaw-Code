import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Education Experiment',
    readyPosture: 'education_experiment_design_ready',
    defaultAgentId: 'agent:education-experiment-design',
    recommendationTypes: {
        primary: 'generate_education_experiment_design',
        guard: 'mitigate_education_experiment_bias_risk',
        audit: 'audit_education_experiment_design_signals',
        publish: 'publish_education_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_education_experiment_design: 'agent:education',
        mitigate_education_experiment_bias_risk: 'agent:research',
        audit_education_experiment_design_signals: 'agent:trust',
        publish_education_experiment_design_status: 'agent:ops'
    }
});

export function generateEducationExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationExperimentDesignGenerator extends BaseManager {}

export const __educationExperimentDesignGeneratorInternals = toolkit.internals;
