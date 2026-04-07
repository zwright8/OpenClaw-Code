import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Governance Error Pattern',
    readyPosture: 'governance_error_taxonomy_ready',
    defaultAgentId: 'agent:governance-error-taxonomy',
    recommendationTypes: {
        primary: 'taxonomy_governance_self_reflection_errors',
        guard: 'mitigate_governance_repeat_reasoning_failure',
        audit: 'audit_governance_error_taxonomy_signals',
        publish: 'publish_governance_error_taxonomy_status'
    },
    recommendationTargetMap: {
        taxonomy_governance_self_reflection_errors: 'agent:analysis',
        mitigate_governance_repeat_reasoning_failure: 'agent:quality',
        audit_governance_error_taxonomy_signals: 'agent:trust',
        publish_governance_error_taxonomy_status: 'agent:ops'
    }
});

export function taxonomyGovernanceSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceSelfReflectionErrorTaxonomist extends BaseManager {}

export const __governanceSelfReflectionErrorTaxonomistInternals = toolkit.internals;
