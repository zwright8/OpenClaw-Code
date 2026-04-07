import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Logistics Claim',
    readyPosture: 'logistics_contradictions_managed',
    defaultAgentId: 'agent:logistics-contradictions',
    recommendationTypes: {
        primary: 'detect_logistics_contradictions',
        guard: 'mitigate_conflicting_logistics_claims',
        audit: 'audit_logistics_contradiction_signals',
        publish: 'publish_logistics_contradiction_status'
    },
    recommendationTargetMap: {
        detect_logistics_contradictions: 'agent:logistics',
        mitigate_conflicting_logistics_claims: 'agent:policy',
        audit_logistics_contradiction_signals: 'agent:trust',
        publish_logistics_contradiction_status: 'agent:ops'
    }
});

export function detectLogisticsContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsContradictionDetector extends BaseManager {}

export const __logisticsContradictionDetectorInternals = toolkit.internals;
