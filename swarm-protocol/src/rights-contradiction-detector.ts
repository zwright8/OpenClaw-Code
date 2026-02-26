import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Rights Claim',
    readyPosture: 'rights_contradictions_managed',
    defaultAgentId: 'agent:rights-contradictions',
    recommendationTypes: {
        primary: 'detect_rights_contradictions',
        guard: 'mitigate_conflicting_rights_claims',
        audit: 'audit_rights_contradiction_signals',
        publish: 'publish_rights_contradiction_status'
    },
    recommendationTargetMap: {
        detect_rights_contradictions: 'agent:rights',
        mitigate_conflicting_rights_claims: 'agent:policy',
        audit_rights_contradiction_signals: 'agent:trust',
        publish_rights_contradiction_status: 'agent:ops'
    }
});

export function detectRightsContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsContradictionDetector extends BaseManager {}

export const __rightsContradictionDetectorInternals = toolkit.internals;
