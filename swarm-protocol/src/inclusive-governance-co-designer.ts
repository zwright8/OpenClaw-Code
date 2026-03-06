import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusive_governance_co_designer',
    collectionField: 'councils',
    idField: 'councilId',
    defaultName: 'Council',
    readyPosture: 'governance_inclusion_ready',
    defaultAgentId: 'agent:inclusive-governance',
    recommendationTypes: {
        primary: 'co_design_inclusive_governance',
        guard: 'resolve_governance_exclusion_gap',
        audit: 'audit_governance_participation_signals',
        publish: 'publish_inclusive_governance_plan'
    },
    recommendationTargetMap: {
        co_design_inclusive_governance: 'agent:governance',
        resolve_governance_exclusion_gap: 'agent:community',
        audit_governance_participation_signals: 'agent:quality',
        publish_inclusive_governance_plan: 'agent:ops'
    }
});

export function designInclusiveGovernance(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusiveGovernanceToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusiveGovernanceCoDesigner extends BaseManager {}

export const __inclusiveGovernanceCoDesignerInternals = toolkit.internals;
