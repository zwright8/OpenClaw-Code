import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_contradiction_detector',
    collectionField: 'claims',
    idField: 'claimId',
    defaultName: 'Research Claim',
    readyPosture: 'research_contradictions_managed',
    defaultAgentId: 'agent:research-contradictions',
    recommendationTypes: {
        primary: 'detect_research_contradictions',
        guard: 'mitigate_conflicting_research_claims',
        audit: 'audit_research_contradiction_signals',
        publish: 'publish_research_contradiction_status'
    },
    recommendationTargetMap: {
        detect_research_contradictions: 'agent:research',
        mitigate_conflicting_research_claims: 'agent:policy',
        audit_research_contradiction_signals: 'agent:trust',
        publish_research_contradiction_status: 'agent:ops'
    }
});

export function detectResearchContradictions(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchContradictionDetectorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchContradictionDetector extends BaseManager {}

export const __researchContradictionDetectorInternals = toolkit.internals;
