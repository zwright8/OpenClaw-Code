import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Security Error Pattern',
    readyPosture: 'security_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:security-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_security_self_reflection_errors',
        guard: 'mitigate_security_repeat_reasoning_errors',
        audit: 'audit_security_self_reflection_signals',
        publish: 'publish_security_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_security_self_reflection_errors: 'agent:quality',
        mitigate_security_repeat_reasoning_errors: 'agent:operations',
        audit_security_self_reflection_signals: 'agent:trust',
        publish_security_self_reflection_status: 'agent:ops'
    }
});

export function taxonomySecuritySelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securitySelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecuritySelfReflectionErrorTaxonomist extends BaseManager {}

export const __securitySelfReflectionErrorTaxonomistInternals = toolkit.internals;
