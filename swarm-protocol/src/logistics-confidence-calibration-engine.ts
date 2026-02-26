import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Logistics Calibration Set',
    readyPosture: 'logistics_confidence_calibrated',
    defaultAgentId: 'agent:logistics-calibration',
    recommendationTypes: {
        primary: 'calibrate_logistics_confidence',
        guard: 'mitigate_logistics_miscalibrated_confidence_risk',
        audit: 'audit_logistics_confidence_signals',
        publish: 'publish_logistics_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_logistics_confidence: 'agent:logistics',
        mitigate_logistics_miscalibrated_confidence_risk: 'agent:risk',
        audit_logistics_confidence_signals: 'agent:trust',
        publish_logistics_confidence_status: 'agent:ops'
    }
});

export function calibrateLogisticsConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsConfidenceCalibrationEngine extends BaseManager {}

export const __logisticsConfidenceCalibrationEngineInternals = toolkit.internals;
