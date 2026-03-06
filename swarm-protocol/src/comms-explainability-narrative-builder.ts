import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Comms Decision',
    readyPosture: 'comms_explainability_ready',
    defaultAgentId: 'agent:comms-explainability',
    recommendationTypes: {
        primary: 'build_comms_explainability_narrative',
        guard: 'mitigate_comms_explanation_gap',
        audit: 'audit_comms_explainability_signals',
        publish: 'publish_comms_explainability_status'
    },
    recommendationTargetMap: {
        build_comms_explainability_narrative: 'agent:comms',
        mitigate_comms_explanation_gap: 'agent:policy',
        audit_comms_explainability_signals: 'agent:trust',
        publish_comms_explainability_status: 'agent:ops'
    }
});

export function buildCommsExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsExplainabilityNarrativeBuilder extends BaseManager {}

export const __commsExplainabilityNarrativeBuilderInternals = toolkit.internals;
