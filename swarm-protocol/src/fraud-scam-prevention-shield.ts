import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'fraud_scam_prevention_shield',
    collectionField: 'transactions',
    idField: 'transactionId',
    defaultName: 'Transaction',
    readyPosture: 'fraud_resilient',
    defaultAgentId: 'agent:fraud-shield',
    recommendationTypes: {
        primary: 'block_fraud_scam_pattern',
        guard: 'harden_scam_prevention_rules',
        audit: 'audit_fraud_detection_coverage',
        publish: 'publish_fraud_prevention_digest'
    },
    recommendationTargetMap: {
        block_fraud_scam_pattern: 'agent:fraud',
        harden_scam_prevention_rules: 'agent:risk',
        audit_fraud_detection_coverage: 'agent:trust',
        publish_fraud_prevention_digest: 'agent:ops'
    }
});

export function preventFraudAndScams(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function fraudScamPreventionToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FraudScamPreventionShield extends BaseManager {}

export const __fraudScamPreventionShieldInternals = toolkit.internals;
