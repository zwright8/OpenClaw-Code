import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Economic Claim',
    readyPosture: 'economic_contradictions_managed',
    defaultAgentId: 'agent:economic-contradictions',
    recommendationTypes: {
        primary: 'detect_economic_contradictions',
        guard: 'mitigate_conflicting_economic_claims',
        audit: 'audit_economic_contradiction_signals',
        publish: 'publish_economic_contradiction_status'
    },
    recommendationTargetMap: {
        detect_economic_contradictions: 'agent:economic',
        mitigate_conflicting_economic_claims: 'agent:policy',
        audit_economic_contradiction_signals: 'agent:trust',
        publish_economic_contradiction_status: 'agent:ops'
    }
});

export function detectEconomicContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicContradictionDetector extends BaseManager {}

export const __economicContradictionDetectorInternals = toolkit.internals;
