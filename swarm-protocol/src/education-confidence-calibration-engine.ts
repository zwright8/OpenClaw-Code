import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'education_confidence_calibrated',
    defaultAgentId: 'agent:education-calibration',
    recommendationTypes: {
        primary: 'calibrate_education_confidence',
        guard: 'mitigate_miscalibrated_education_confidence_risk',
        audit: 'audit_education_confidence_signals',
        publish: 'publish_education_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_education_confidence: 'agent:education',
        mitigate_miscalibrated_education_confidence_risk: 'agent:risk',
        audit_education_confidence_signals: 'agent:trust',
        publish_education_confidence_status: 'agent:ops'
    }
});

export function calibrateEducationConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationConfidenceCalibrationEngine extends BaseManager {}

export const __educationConfidenceCalibrationEngineInternals = toolkit.internals;
