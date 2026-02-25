import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'local_language_community_adapter',
    collectionField: 'communities',
    idField: 'communityId',
    defaultName: 'Community',
    readyPosture: 'language_aligned',
    defaultAgentId: 'agent:local-language',
    recommendationTypes: {
        primary: 'localize_community_experience',
        guard: 'close_language_coverage_gap',
        audit: 'audit_language_quality',
        publish: 'publish_language_adaptation_plan'
    },
    recommendationTargetMap: {
        localize_community_experience: 'agent:localization',
        close_language_coverage_gap: 'agent:community',
        audit_language_quality: 'agent:qa',
        publish_language_adaptation_plan: 'agent:ops'
    }
});

export function adaptLocalLanguageCommunity(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function localLanguageAdapterToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LocalLanguageCommunityAdapter extends BaseManager {}

export const __localLanguageCommunityAdapterInternals = toolkit.internals;
