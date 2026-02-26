import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'impact_confidence_calibrated',
    defaultAgentId: 'agent:impact-calibration',
    recommendationTypes: {
        primary: 'calibrate_impact_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_impact_confidence_signals',
        publish: 'publish_impact_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_impact_confidence: 'agent:impact',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_impact_confidence_signals: 'agent:trust',
        publish_impact_confidence_status: 'agent:ops'
    }
});

export function calibrateImpactConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactConfidenceCalibrationEngine extends BaseManager {}

export const __impactConfidenceCalibrationEngineInternals = toolkit.internals;
