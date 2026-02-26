import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Collab Calibration Set',
    readyPosture: 'collab_confidence_calibrated',
    defaultAgentId: 'agent:collab-calibration',
    recommendationTypes: {
        primary: 'calibrate_collab_confidence',
        guard: 'mitigate_miscalibrated_collab_confidence_risk',
        audit: 'audit_collab_confidence_signals',
        publish: 'publish_collab_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_collab_confidence: 'agent:collab',
        mitigate_miscalibrated_collab_confidence_risk: 'agent:risk',
        audit_collab_confidence_signals: 'agent:trust',
        publish_collab_confidence_status: 'agent:ops'
    }
});

export function calibrateCollabConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabConfidenceCalibrationEngine extends BaseManager {}

export const __collabConfidenceCalibrationEngineInternals = toolkit.internals;
