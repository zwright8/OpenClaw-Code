import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'observability_confidence_calibrated',
    defaultAgentId: 'agent:observability-calibration',
    recommendationTypes: {
        primary: 'calibrate_observability_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_observability_confidence_signals',
        publish: 'publish_observability_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_observability_confidence: 'agent:observability',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_observability_confidence_signals: 'agent:trust',
        publish_observability_confidence_status: 'agent:ops'
    }
});

export function calibrateObservabilityConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityConfidenceCalibrationEngine extends BaseManager {}

export const __observabilityConfidenceCalibrationEngineInternals = toolkit.internals;
