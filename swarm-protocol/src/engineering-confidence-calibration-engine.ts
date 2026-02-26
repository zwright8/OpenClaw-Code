import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'engineering_confidence_calibrated',
    defaultAgentId: 'agent:engineering-calibration',
    recommendationTypes: {
        primary: 'calibrate_engineering_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_engineering_confidence_signals',
        publish: 'publish_engineering_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_engineering_confidence: 'agent:engineering',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_engineering_confidence_signals: 'agent:trust',
        publish_engineering_confidence_status: 'agent:ops'
    }
});

export function calibrateEngineeringConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringConfidenceCalibrationEngine extends BaseManager {}

export const __engineeringConfidenceCalibrationEngineInternals = toolkit.internals;
