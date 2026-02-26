import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'comms_confidence_calibrated',
    defaultAgentId: 'agent:comms-calibration',
    recommendationTypes: {
        primary: 'calibrate_comms_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_comms_confidence_signals',
        publish: 'publish_comms_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_comms_confidence: 'agent:comms',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_comms_confidence_signals: 'agent:trust',
        publish_comms_confidence_status: 'agent:ops'
    }
});

export function calibrateCommsConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsConfidenceCalibrationEngine extends BaseManager {}

export const __commsConfidenceCalibrationEngineInternals = toolkit.internals;
