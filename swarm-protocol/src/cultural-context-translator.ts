import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_context_translator',
    collectionField: 'exchanges',
    idField: 'exchangeId',
    defaultName: 'Exchange',
    readyPosture: 'culturally_aligned',
    defaultAgentId: 'agent:cultural-context',
    recommendationTypes: {
        primary: 'preserve_cultural_nuance',
        guard: 'resolve_context_mismatch',
        audit: 'audit_translation_context',
        publish: 'publish_cultural_context_brief'
    },
    recommendationTargetMap: {
        preserve_cultural_nuance: 'agent:localization',
        resolve_context_mismatch: 'agent:community',
        audit_translation_context: 'agent:qa',
        publish_cultural_context_brief: 'agent:ops'
    }
});

export function translateCulturalContext(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalContextToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalContextTranslator extends BaseManager {}

export const __culturalContextTranslatorInternals = toolkit.internals;
