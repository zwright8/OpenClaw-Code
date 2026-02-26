import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Oversight Calibration Set',
    readyPosture: 'oversight_confidence_calibrated',
    defaultAgentId: 'agent:oversight-calibration',
    recommendationTypes: {
        primary: 'calibrate_oversight_confidence',
        guard: 'mitigate_miscalibrated_oversight_confidence_risk',
        audit: 'audit_oversight_confidence_signals',
        publish: 'publish_oversight_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_oversight_confidence: 'agent:oversight',
        mitigate_miscalibrated_oversight_confidence_risk: 'agent:risk',
        audit_oversight_confidence_signals: 'agent:trust',
        publish_oversight_confidence_status: 'agent:ops'
    }
});

export function calibrateOversightConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightConfidenceCalibrationEngine extends BaseManager {}

export const __oversightConfidenceCalibrationEngineInternals = toolkit.internals;
