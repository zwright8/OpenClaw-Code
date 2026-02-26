import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Evolution Experiment',
    readyPosture: 'evolution_experiment_design_ready',
    defaultAgentId: 'agent:evolution-experiment-design',
    recommendationTypes: {
        primary: 'generate_evolution_experiment_design',
        guard: 'mitigate_evolution_experiment_bias_risk',
        audit: 'audit_evolution_experiment_design_signals',
        publish: 'publish_evolution_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_evolution_experiment_design: 'agent:evolution',
        mitigate_evolution_experiment_bias_risk: 'agent:research',
        audit_evolution_experiment_design_signals: 'agent:trust',
        publish_evolution_experiment_design_status: 'agent:ops'
    }
});

export function generateEvolutionExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionExperimentDesignGenerator extends BaseManager {}

export const __evolutionExperimentDesignGeneratorInternals = toolkit.internals;
