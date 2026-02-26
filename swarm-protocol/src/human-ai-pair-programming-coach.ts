import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'human_ai_pair_programming_coach',
    collectionField: 'pairings',
    idField: 'pairingId',
    defaultName: 'Pairing',
    readyPosture: 'pair_programming_aligned',
    defaultAgentId: 'agent:pair-programming-coach',
    recommendationTypes: {
        primary: 'coach_pair_programming_workflow',
        guard: 'remediate_delivery_quality_gap',
        audit: 'audit_pairing_feedback_signals',
        publish: 'publish_pair_programming_digest'
    },
    recommendationTargetMap: {
        coach_pair_programming_workflow: 'agent:engineering',
        remediate_delivery_quality_gap: 'agent:enablement',
        audit_pairing_feedback_signals: 'agent:quality',
        publish_pair_programming_digest: 'agent:ops'
    }
});

export function coachHumanAiPairProgramming(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function pairProgrammingCoachToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class HumanAiPairProgrammingCoach extends BaseManager {}

export const __humanAiPairProgrammingCoachInternals = toolkit.internals;
