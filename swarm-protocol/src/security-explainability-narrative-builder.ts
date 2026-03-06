import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_explainability_narrative_builder',
    collectionField: 'decisions',
    idField: 'decisionId',
    defaultName: 'Security Decision',
    readyPosture: 'security_explainability_ready',
    defaultAgentId: 'agent:security-explainability',
    recommendationTypes: {
        primary: 'build_security_explainability_narrative',
        guard: 'mitigate_security_explanation_gap',
        audit: 'audit_security_explainability_signals',
        publish: 'publish_security_explainability_status'
    },
    recommendationTargetMap: {
        build_security_explainability_narrative: 'agent:security',
        mitigate_security_explanation_gap: 'agent:policy',
        audit_security_explainability_signals: 'agent:trust',
        publish_security_explainability_status: 'agent:ops'
    }
});

export function buildSecurityExplainabilityNarratives(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityExplainabilityNarrativeBuilderToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityExplainabilityNarrativeBuilder extends BaseManager {}

export const __securityExplainabilityNarrativeBuilderInternals = toolkit.internals;
