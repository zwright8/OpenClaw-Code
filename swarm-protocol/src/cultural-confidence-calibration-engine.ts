import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'cultural_confidence_calibrated',
    defaultAgentId: 'agent:cultural-calibration',
    recommendationTypes: {
        primary: 'calibrate_cultural_confidence',
        guard: 'mitigate_miscalibrated_cultural_confidence_risk',
        audit: 'audit_cultural_confidence_signals',
        publish: 'publish_cultural_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_cultural_confidence: 'agent:cultural',
        mitigate_miscalibrated_cultural_confidence_risk: 'agent:risk',
        audit_cultural_confidence_signals: 'agent:trust',
        publish_cultural_confidence_status: 'agent:ops'
    }
});

export function calibrateCulturalConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalConfidenceCalibrationEngine extends BaseManager {}

export const __culturalConfidenceCalibrationEngineInternals = toolkit.internals;
