import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'accessibility_personalization_engine',
    collectionField: 'profiles',
    idField: 'profileId',
    defaultName: 'Profile',
    readyPosture: 'accessibility_personalized',
    defaultAgentId: 'agent:accessibility-personalization',
    recommendationTypes: {
        primary: 'deploy_accessibility_personalization',
        guard: 'close_accessibility_support_gap',
        audit: 'audit_accessibility_preferences',
        publish: 'publish_accessibility_personalization_report'
    },
    recommendationTargetMap: {
        deploy_accessibility_personalization: 'agent:accessibility',
        close_accessibility_support_gap: 'agent:support',
        audit_accessibility_preferences: 'agent:qa',
        publish_accessibility_personalization_report: 'agent:ops'
    }
});

export function personalizeAccessibilitySupport(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function accessibilityPersonalizationToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class AccessibilityPersonalizationEngine extends BaseManager {}

export const __accessibilityPersonalizationEngineInternals = toolkit.internals;
