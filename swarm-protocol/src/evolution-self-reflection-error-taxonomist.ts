import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_self_reflection_error_taxonomist',
    collectionField: 'errorPatterns',
    idField: 'errorId',
    defaultName: 'Evolution Error Pattern',
    readyPosture: 'evolution_self_reflection_taxonomy_ready',
    defaultAgentId: 'agent:evolution-self-reflection',
    recommendationTypes: {
        primary: 'taxonomy_evolution_self_reflection_errors',
        guard: 'mitigate_evolution_repeat_reasoning_errors',
        audit: 'audit_evolution_self_reflection_signals',
        publish: 'publish_evolution_self_reflection_status'
    },
    recommendationTargetMap: {
        taxonomy_evolution_self_reflection_errors: 'agent:quality',
        mitigate_evolution_repeat_reasoning_errors: 'agent:operations',
        audit_evolution_self_reflection_signals: 'agent:trust',
        publish_evolution_self_reflection_status: 'agent:ops'
    }
});

export function taxonomyEvolutionSelfReflectionErrors(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionSelfReflectionErrorTaxonomistToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionSelfReflectionErrorTaxonomist extends BaseManager {}

export const __evolutionSelfReflectionErrorTaxonomistInternals = toolkit.internals;
