import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'carbon_sustainability_guard',
    collectionField: 'initiatives',
    idField: 'initiativeId',
    defaultName: 'Initiative',
    readyPosture: 'sustainability_guarded',
    defaultAgentId: 'agent:sustainability-guard',
    recommendationTypes: {
        primary: 'constrain_carbon_intensive_actions',
        guard: 'redesign_low_carbon_path',
        audit: 'audit_sustainability_evidence',
        publish: 'publish_sustainability_guard_report'
    },
    recommendationTargetMap: {
        constrain_carbon_intensive_actions: 'agent:sustainability',
        redesign_low_carbon_path: 'agent:policy',
        audit_sustainability_evidence: 'agent:compliance',
        publish_sustainability_guard_report: 'agent:ops'
    }
});

export function enforceCarbonSustainabilityGuard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function carbonSustainabilityToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CarbonSustainabilityGuard extends BaseManager {}

export const __carbonSustainabilityGuardInternals = toolkit.internals;
