import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'economic_confidence_calibrated',
    defaultAgentId: 'agent:economic-calibration',
    recommendationTypes: {
        primary: 'calibrate_economic_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_economic_confidence_signals',
        publish: 'publish_economic_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_economic_confidence: 'agent:economic',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_economic_confidence_signals: 'agent:trust',
        publish_economic_confidence_status: 'agent:ops'
    }
});

export function calibrateEconomicConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicConfidenceCalibrationEngine extends BaseManager {}

export const __economicConfidenceCalibrationEngineInternals = toolkit.internals;
