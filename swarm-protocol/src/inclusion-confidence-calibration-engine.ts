import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Inclusion Calibration Set',
    readyPosture: 'inclusion_confidence_calibrated',
    defaultAgentId: 'agent:inclusion-calibration',
    recommendationTypes: {
        primary: 'calibrate_inclusion_confidence',
        guard: 'mitigate_miscalibrated_inclusion_confidence_risk',
        audit: 'audit_inclusion_confidence_signals',
        publish: 'publish_inclusion_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_inclusion_confidence: 'agent:inclusion',
        mitigate_miscalibrated_inclusion_confidence_risk: 'agent:risk',
        audit_inclusion_confidence_signals: 'agent:trust',
        publish_inclusion_confidence_status: 'agent:ops'
    }
});

export function calibrateInclusionConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionConfidenceCalibrationEngine extends BaseManager {}

export const __inclusionConfidenceCalibrationEngineInternals = toolkit.internals;
