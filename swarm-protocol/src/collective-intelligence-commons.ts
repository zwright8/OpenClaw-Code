import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collective_intelligence_commons',
    collectionField: 'artifacts',
    idField: 'artifactId',
    defaultName: 'Artifact',
    readyPosture: 'commons_operational',
    defaultAgentId: 'agent:collective-commons',
    recommendationTypes: {
        primary: 'curate_collective_intelligence_artifact',
        guard: 'resolve_commons_reuse_gap',
        audit: 'audit_commons_trust_signals',
        publish: 'publish_collective_intelligence_digest'
    },
    recommendationTargetMap: {
        curate_collective_intelligence_artifact: 'agent:knowledge',
        resolve_commons_reuse_gap: 'agent:platform',
        audit_commons_trust_signals: 'agent:trust',
        publish_collective_intelligence_digest: 'agent:ops'
    }
});

export function operateCollectiveIntelligenceCommons(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collectiveIntelligenceCommonsToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollectiveIntelligenceCommons extends BaseManager {}

export const __collectiveIntelligenceCommonsInternals = toolkit.internals;
