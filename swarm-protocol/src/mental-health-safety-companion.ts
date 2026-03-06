import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'mental_health_safety_companion',
    collectionField: 'interactions',
    idField: 'interactionId',
    defaultName: 'Interaction',
    readyPosture: 'mental_safety_supported',
    defaultAgentId: 'agent:mental-health-safety',
    recommendationTypes: {
        primary: 'activate_mental_health_support',
        guard: 'escalate_mental_harm_risk',
        audit: 'audit_mental_safety_signals',
        publish: 'publish_mental_safety_brief'
    },
    recommendationTargetMap: {
        activate_mental_health_support: 'agent:safety',
        escalate_mental_harm_risk: 'agent:human-review',
        audit_mental_safety_signals: 'agent:trust',
        publish_mental_safety_brief: 'agent:ops'
    }
});

export function evaluateMentalHealthSafety(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function mentalHealthSafetyToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class MentalHealthSafetyCompanion extends BaseManager {}

export const __mentalHealthSafetyCompanionInternals = toolkit.internals;
