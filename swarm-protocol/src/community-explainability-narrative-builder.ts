import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Community Decision',
    readyPosture: 'community_explainability_ready',
    defaultAgentId: 'agent:community-explainability',
    recommendationTypes: {
        primary: 'build_community_explainability_narratives',
        guard: 'mitigate_community_explainability_gaps',
        audit: 'audit_community_explainability_signals',
        publish: 'publish_community_explainability_status'
    },
    recommendationTargetMap: {
        build_community_explainability_narratives: 'agent:community',
        mitigate_community_explainability_gaps: 'agent:policy',
        audit_community_explainability_signals: 'agent:trust',
        publish_community_explainability_status: 'agent:ops'
    }
});

export function buildCommunityExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityExplainabilityNarrativeBuilder extends BaseManager {}

export const __communityExplainabilityNarrativeBuilderInternals = toolkit.internals;
