import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Governance Decision',
    readyPosture: 'governance_explainability_ready',
    defaultAgentId: 'agent:governance-explainability',
    recommendationTypes: {
        primary: 'build_governance_explainability_narrative',
        guard: 'mitigate_governance_explanation_gap',
        audit: 'audit_governance_explainability_signals',
        publish: 'publish_governance_explainability_status'
    },
    recommendationTargetMap: {
        build_governance_explainability_narrative: 'agent:governance',
        mitigate_governance_explanation_gap: 'agent:policy',
        audit_governance_explainability_signals: 'agent:trust',
        publish_governance_explainability_status: 'agent:ops'
    }
});

export function buildGovernanceExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceExplainabilityNarrativeBuilder extends BaseManager {}

export const __governanceExplainabilityNarrativeBuilderInternals = toolkit.internals;
