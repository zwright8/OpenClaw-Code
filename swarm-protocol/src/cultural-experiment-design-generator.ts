import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Cultural Experiment',
    readyPosture: 'cultural_experiment_design_ready',
    defaultAgentId: 'agent:cultural-experiment-design',
    recommendationTypes: {
        primary: 'generate_cultural_experiment_designs',
        guard: 'mitigate_cultural_experiment_bias',
        audit: 'audit_cultural_experiment_design_signals',
        publish: 'publish_cultural_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_cultural_experiment_designs: 'agent:cultural',
        mitigate_cultural_experiment_bias: 'agent:policy',
        audit_cultural_experiment_design_signals: 'agent:trust',
        publish_cultural_experiment_design_status: 'agent:ops'
    }
});

export function generateCulturalExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalExperimentDesignGenerator extends BaseManager {}

export const __culturalExperimentDesignGeneratorInternals = toolkit.internals;
