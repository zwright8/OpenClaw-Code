import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Evolution Failure',
    readyPosture: 'evolution_failure_root_causes_mined',
    defaultAgentId: 'agent:evolution-failure-analysis',
    recommendationTypes: {
        primary: 'mine_evolution_failure_root_causes',
        guard: 'mitigate_evolution_repeat_failures',
        audit: 'audit_evolution_failure_signals',
        publish: 'publish_evolution_failure_status'
    },
    recommendationTargetMap: {
        mine_evolution_failure_root_causes: 'agent:evolution',
        mitigate_evolution_repeat_failures: 'agent:reliability',
        audit_evolution_failure_signals: 'agent:trust',
        publish_evolution_failure_status: 'agent:ops'
    }
});

export function mineEvolutionFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionFailureRootCauseMiner extends BaseManager {}

export const __evolutionFailureRootCauseMinerInternals = toolkit.internals;
