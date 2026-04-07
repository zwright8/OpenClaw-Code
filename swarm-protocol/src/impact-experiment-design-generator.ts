import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Impact Experiment',
    readyPosture: 'impact_experiment_design_ready',
    defaultAgentId: 'agent:impact-experiment-design',
    recommendationTypes: {
        primary: 'generate_impact_experiment_design',
        guard: 'mitigate_impact_experiment_bias_risk',
        audit: 'audit_impact_experiment_design_signals',
        publish: 'publish_impact_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_impact_experiment_design: 'agent:impact',
        mitigate_impact_experiment_bias_risk: 'agent:research',
        audit_impact_experiment_design_signals: 'agent:trust',
        publish_impact_experiment_design_status: 'agent:ops'
    }
});

export function generateImpactExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactExperimentDesignGenerator extends BaseManager {}

export const __impactExperimentDesignGeneratorInternals = toolkit.internals;
