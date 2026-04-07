import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Governance Claim',
    readyPosture: 'governance_contradictions_managed',
    defaultAgentId: 'agent:governance-contradictions',
    recommendationTypes: {
        primary: 'detect_governance_contradictions',
        guard: 'mitigate_conflicting_governance_claims',
        audit: 'audit_governance_contradiction_signals',
        publish: 'publish_governance_contradiction_status'
    },
    recommendationTargetMap: {
        detect_governance_contradictions: 'agent:governance',
        mitigate_conflicting_governance_claims: 'agent:policy',
        audit_governance_contradiction_signals: 'agent:trust',
        publish_governance_contradiction_status: 'agent:ops'
    }
});

export function detectGovernanceContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceContradictionDetector extends BaseManager {}

export const __governanceContradictionDetectorInternals = toolkit.internals;
