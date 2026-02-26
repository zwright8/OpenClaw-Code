import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_experiment_design_generator',
    collectionField: 'experiments',
    idField: 'experimentId',
    defaultName: 'Community Experiment',
    readyPosture: 'community_experiment_design_ready',
    defaultAgentId: 'agent:community-experiment-design',
    recommendationTypes: {
        primary: 'generate_community_experiment_designs',
        guard: 'mitigate_community_experiment_bias',
        audit: 'audit_community_experiment_design_signals',
        publish: 'publish_community_experiment_design_status'
    },
    recommendationTargetMap: {
        generate_community_experiment_designs: 'agent:community',
        mitigate_community_experiment_bias: 'agent:policy',
        audit_community_experiment_design_signals: 'agent:trust',
        publish_community_experiment_design_status: 'agent:ops'
    }
});

export function generateCommunityExperimentDesigns(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityExperimentDesignGeneratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityExperimentDesignGenerator extends BaseManager {}

export const __communityExperimentDesignGeneratorInternals = toolkit.internals;
