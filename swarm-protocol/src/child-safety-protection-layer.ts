import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'child_safety_protection_layer',
    collectionField: 'sessions',
    idField: 'sessionId',
    defaultName: 'Session',
    readyPosture: 'child_safety_protected',
    defaultAgentId: 'agent:child-safety',
    recommendationTypes: {
        primary: 'apply_child_safety_controls',
        guard: 'escalate_child_safety_incident',
        audit: 'audit_child_safety_signals',
        publish: 'publish_child_safety_compliance_report'
    },
    recommendationTargetMap: {
        apply_child_safety_controls: 'agent:safety',
        escalate_child_safety_incident: 'agent:human-review',
        audit_child_safety_signals: 'agent:trust',
        publish_child_safety_compliance_report: 'agent:ops'
    }
});

export function enforceChildSafetyProtection(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function childSafetyProtectionToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ChildSafetyProtectionLayer extends BaseManager {}

export const __childSafetyProtectionLayerInternals = toolkit.internals;
