import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_community_feedback_harvester',
    collectionField: 'feedbackEntries',
    idField: 'entryId',
    defaultName: 'Evolution Feedback Entry',
    readyPosture: 'evolution_feedback_harvested',
    defaultAgentId: 'agent:evolution-feedback',
    recommendationTypes: {
        primary: 'harvest_evolution_community_feedback',
        guard: 'mitigate_evolution_feedback_blindspots',
        audit: 'audit_evolution_feedback_signals',
        publish: 'publish_evolution_feedback_status'
    },
    recommendationTargetMap: {
        harvest_evolution_community_feedback: 'agent:evolution',
        mitigate_evolution_feedback_blindspots: 'agent:community',
        audit_evolution_feedback_signals: 'agent:trust',
        publish_evolution_feedback_status: 'agent:ops'
    }
});

export function harvestEvolutionCommunityFeedback(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionCommunityFeedbackHarvesterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionCommunityFeedbackHarvester extends BaseManager {}

export const __evolutionCommunityFeedbackHarvesterInternals = toolkit.internals;
