import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'consensus_formation_facilitator',
    collectionField: 'proposals',
    idField: 'proposalId',
    defaultName: 'Proposal',
    readyPosture: 'consensus_ready',
    defaultAgentId: 'agent:consensus',
    signalMap: {
        demand: 'stakeholderDemand',
        capacity: 'facilitationCapacity',
        risk: 'polarizationRisk',
        impact: 'agreementImpact',
        readiness: 'draftReadiness',
        resilience: 'compromiseResilience',
        equity: 'representationEquity',
        efficiency: 'decisionVelocity',
        quality: 'proposalQuality',
        trust: 'crossGroupTrust',
        opportunity: 'alignmentOpportunity',
        criticality: 'timelineCriticality'
    },
    recommendationTypes: {
        primary: 'launch_consensus_cycle',
        guard: 'resolve_consensus_blocker',
        audit: 'capture_stakeholder_dissent',
        publish: 'publish_consensus_brief'
    },
    recommendationTargetMap: {
        launch_consensus_cycle: 'agent:facilitation',
        resolve_consensus_blocker: 'agent:governance',
        capture_stakeholder_dissent: 'agent:research',
        publish_consensus_brief: 'agent:ops'
    }
});

export function facilitateConsensusFormation(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function consensusFormationToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ConsensusFormationFacilitator extends BaseManager {}

export const __consensusFormationFacilitatorInternals = toolkit.internals;
