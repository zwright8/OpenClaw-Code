import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Evolution Claim',
    readyPosture: 'evolution_contradictions_managed',
    defaultAgentId: 'agent:evolution-contradictions',
    recommendationTypes: {
        primary: 'detect_evolution_contradictions',
        guard: 'mitigate_conflicting_evolution_claims',
        audit: 'audit_evolution_contradiction_signals',
        publish: 'publish_evolution_contradiction_status'
    },
    recommendationTargetMap: {
        detect_evolution_contradictions: 'agent:evolution',
        mitigate_conflicting_evolution_claims: 'agent:policy',
        audit_evolution_contradiction_signals: 'agent:trust',
        publish_evolution_contradiction_status: 'agent:ops'
    }
});

export function detectEvolutionContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionContradictionDetector extends BaseManager {}

export const __evolutionContradictionDetectorInternals = toolkit.internals;
