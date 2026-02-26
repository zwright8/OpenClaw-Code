import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'public_transparency_portal_generator',
    collectionField: 'records',
    idField: 'recordId',
    defaultName: 'Record',
    readyPosture: 'transparency_ready',
    defaultAgentId: 'agent:transparency-portal',
    recommendationTypes: {
        primary: 'generate_transparency_portal_update',
        guard: 'fill_transparency_disclosure_gap',
        audit: 'audit_transparency_data_quality',
        publish: 'publish_transparency_portal_release'
    },
    recommendationTargetMap: {
        generate_transparency_portal_update: 'agent:transparency',
        fill_transparency_disclosure_gap: 'agent:compliance',
        audit_transparency_data_quality: 'agent:data-quality',
        publish_transparency_portal_release: 'agent:ops'
    }
});

export function generatePublicTransparencyPortal(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicTransparencyPortalToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicTransparencyPortalGenerator extends BaseManager {}

export const __publicTransparencyPortalGeneratorInternals = toolkit.internals;
