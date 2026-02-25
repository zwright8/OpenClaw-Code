import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_impact_measurement_studio',
    collectionField: 'projects',
    idField: 'projectId',
    defaultName: 'Project',
    readyPosture: 'community_impact_measured',
    defaultAgentId: 'agent:community-impact',
    recommendationTypes: {
        primary: 'measure_community_impact_outcome',
        guard: 'close_impact_measurement_gap',
        audit: 'audit_impact_data_integrity',
        publish: 'publish_community_impact_scorecard'
    },
    recommendationTargetMap: {
        measure_community_impact_outcome: 'agent:impact',
        close_impact_measurement_gap: 'agent:programs',
        audit_impact_data_integrity: 'agent:data-quality',
        publish_community_impact_scorecard: 'agent:ops'
    }
});

export function measureCommunityImpact(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityImpactMeasurementToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityImpactMeasurementStudio extends BaseManager {}

export const __communityImpactMeasurementStudioInternals = toolkit.internals;
