import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'uncertainty_communication_composer',
    collectionField: 'findings',
    idField: 'findingId',
    defaultName: 'Finding',
    readyPosture: 'communication_ready',
    defaultAgentId: 'agent:uncertainty-comms',
    signalMap: {
        demand: 'audienceDemand',
        capacity: 'communicationCapacity',
        risk: 'misinterpretationRisk',
        impact: 'decisionImpact',
        readiness: 'messageReadiness',
        resilience: 'feedbackResilience',
        equity: 'accessibilityEquity',
        efficiency: 'deliveryEfficiency',
        quality: 'clarityQuality',
        trust: 'audienceTrust',
        opportunity: 'learningOpportunity',
        criticality: 'urgency'
    },
    recommendationTypes: {
        primary: 'compose_uncertainty_guidance',
        guard: 'mitigate_uncertainty_misinterpretation',
        audit: 'calibrate_confidence_disclosure',
        publish: 'publish_uncertainty_digest'
    },
    recommendationTargetMap: {
        compose_uncertainty_guidance: 'agent:communications',
        mitigate_uncertainty_misinterpretation: 'agent:safety',
        calibrate_confidence_disclosure: 'agent:research',
        publish_uncertainty_digest: 'agent:ops'
    }
});

export function composeUncertaintyCommunication(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function uncertaintyCommunicationToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class UncertaintyCommunicationComposer extends BaseManager {}

export const __uncertaintyCommunicationComposerInternals = toolkit.internals;
