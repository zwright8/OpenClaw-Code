import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Research Experiment',
    readyPosture: 'research_experiment_design_ready',
    defaultAgentId: 'agent:research-experiment-design',
    recommendationTypes: {
        primary: 'generate_research_experiment_design',
        guard: 'mitigate_research_experiment_bias_risk',
        audit: 'audit_research_experiment_design_signals',
        publish: 'publish_research_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_research_experiment_design: 'agent:research',
        mitigate_research_experiment_bias_risk: 'agent:research',
        audit_research_experiment_design_signals: 'agent:trust',
        publish_research_experiment_design_status: 'agent:ops'
    }
});

export function generateResearchExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchExperimentDesignGenerator extends BaseManager {}

export const __researchExperimentDesignGeneratorInternals = toolkit.internals;
