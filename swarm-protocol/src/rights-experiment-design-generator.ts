import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Rights Experiment',
    readyPosture: 'rights_experiment_design_ready',
    defaultAgentId: 'agent:rights-experiment-design',
    recommendationTypes: {
        primary: 'generate_rights_experiment_design',
        guard: 'mitigate_rights_experiment_bias_risk',
        audit: 'audit_rights_experiment_design_signals',
        publish: 'publish_rights_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_rights_experiment_design: 'agent:rights',
        mitigate_rights_experiment_bias_risk: 'agent:research',
        audit_rights_experiment_design_signals: 'agent:trust',
        publish_rights_experiment_design_status: 'agent:ops'
    }
});

export function generateRightsExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsExperimentDesignGenerator extends BaseManager {}

export const __rightsExperimentDesignGeneratorInternals = toolkit.internals;
