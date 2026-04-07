import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'emotional_harm_detection_guard',
    collectionField: 'conversations',
    idField: 'conversationId',
    defaultName: 'Conversation',
    readyPosture: 'emotional_safety_guarded',
    defaultAgentId: 'agent:emotional-harm-guard',
    recommendationTypes: {
        primary: 'intervene_emotional_harm_risk',
        guard: 'reinforce_safe_dialogue',
        audit: 'audit_emotional_harm_detection',
        publish: 'publish_emotional_safety_report'
    },
    recommendationTargetMap: {
        intervene_emotional_harm_risk: 'agent:safety',
        reinforce_safe_dialogue: 'agent:conversation',
        audit_emotional_harm_detection: 'agent:trust',
        publish_emotional_safety_report: 'agent:ops'
    }
});

export function detectEmotionalHarmRisk(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function emotionalHarmGuardToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EmotionalHarmDetectionGuard extends BaseManager {}

export const __emotionalHarmDetectionGuardInternals = toolkit.internals;
