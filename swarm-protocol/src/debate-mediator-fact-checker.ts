import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'debate_mediator_fact_checker',
    collectionField: 'debates',
    idField: 'debateId',
    defaultName: 'Debate',
    readyPosture: 'debate_ready',
    defaultAgentId: 'agent:debate-mediator',
    signalMap: {
        demand: 'debateVolume',
        capacity: 'moderationCapacity',
        risk: 'misinformationRisk',
        impact: 'publicImpact',
        readiness: 'briefingReadiness',
        resilience: 'dialogueResilience',
        equity: 'voiceBalance',
        efficiency: 'resolutionEfficiency',
        quality: 'evidenceQuality',
        trust: 'participantTrust',
        opportunity: 'learningOpportunity',
        criticality: 'urgency'
    },
    recommendationTypes: {
        primary: 'mediate_debate_round',
        guard: 'resolve_fact_conflict',
        audit: 'verify_claim_evidence',
        publish: 'publish_debate_factcheck_report'
    },
    recommendationTargetMap: {
        mediate_debate_round: 'agent:moderation',
        resolve_fact_conflict: 'agent:fact-check',
        verify_claim_evidence: 'agent:research',
        publish_debate_factcheck_report: 'agent:ops'
    }
});

export function mediateDebateAndFactCheck(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function debateMediationToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class DebateMediatorFactChecker extends BaseManager {}

export const __debateMediatorFactCheckerInternals = toolkit.internals;
