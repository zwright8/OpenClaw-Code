import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Evolution Rollout',
    readyPosture: 'evolution_ab_rollout_governed',
    defaultAgentId: 'agent:evolution-rollout',
    recommendationTypes: {
        primary: 'govern_evolution_ab_rollouts',
        guard: 'mitigate_evolution_rollout_externalities',
        audit: 'audit_evolution_rollout_signals',
        publish: 'publish_evolution_rollout_status'
    },
    recommendationTargetMap: {
        govern_evolution_ab_rollouts: 'agent:evolution',
        mitigate_evolution_rollout_externalities: 'agent:policy',
        audit_evolution_rollout_signals: 'agent:trust',
        publish_evolution_rollout_status: 'agent:ops'
    }
});

export function governEvolutionAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionAbRolloutGovernor extends BaseManager {}

export const __evolutionAbRolloutGovernorInternals = toolkit.internals;
