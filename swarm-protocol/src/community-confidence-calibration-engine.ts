import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Community Calibration Set',
    readyPosture: 'community_confidence_calibrated',
    defaultAgentId: 'agent:community-calibration',
    recommendationTypes: {
        primary: 'calibrate_community_confidence',
        guard: 'mitigate_miscalibrated_community_confidence_risk',
        audit: 'audit_community_confidence_signals',
        publish: 'publish_community_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_community_confidence: 'agent:community',
        mitigate_miscalibrated_community_confidence_risk: 'agent:risk',
        audit_community_confidence_signals: 'agent:trust',
        publish_community_confidence_status: 'agent:ops'
    }
});

export function calibrateCommunityConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityConfidenceCalibrationEngine extends BaseManager {}

export const __communityConfidenceCalibrationEngineInternals = toolkit.internals;
