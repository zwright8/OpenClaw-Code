import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'crisis_confidence_calibrated',
    defaultAgentId: 'agent:crisis-calibration',
    recommendationTypes: {
        primary: 'calibrate_crisis_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_crisis_confidence_signals',
        publish: 'publish_crisis_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_crisis_confidence: 'agent:crisis',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_crisis_confidence_signals: 'agent:trust',
        publish_crisis_confidence_status: 'agent:ops'
    }
});

export function calibrateCrisisConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisConfidenceCalibrationEngine extends BaseManager {}

export const __crisisConfidenceCalibrationEngineInternals = toolkit.internals;
