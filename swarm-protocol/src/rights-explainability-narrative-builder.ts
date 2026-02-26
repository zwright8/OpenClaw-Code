import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Rights Decision',
    readyPosture: 'rights_explainability_ready',
    defaultAgentId: 'agent:rights-explainability',
    recommendationTypes: {
        primary: 'build_rights_explainability_narratives',
        guard: 'mitigate_rights_explainability_gaps',
        audit: 'audit_rights_explainability_signals',
        publish: 'publish_rights_explainability_status'
    },
    recommendationTargetMap: {
        build_rights_explainability_narratives: 'agent:rights',
        mitigate_rights_explainability_gaps: 'agent:policy',
        audit_rights_explainability_signals: 'agent:trust',
        publish_rights_explainability_status: 'agent:ops'
    }
});

export function buildRightsExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsExplainabilityNarrativeBuilder extends BaseManager {}

export const __rightsExplainabilityNarrativeBuilderInternals = toolkit.internals;
