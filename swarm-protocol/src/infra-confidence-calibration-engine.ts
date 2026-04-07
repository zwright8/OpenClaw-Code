import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Infra Calibration Set',
    readyPosture: 'infra_confidence_calibrated',
    defaultAgentId: 'agent:infra-calibration',
    recommendationTypes: {
        primary: 'calibrate_infra_confidence',
        guard: 'mitigate_miscalibrated_infra_confidence_risk',
        audit: 'audit_infra_confidence_signals',
        publish: 'publish_infra_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_infra_confidence: 'agent:infra',
        mitigate_miscalibrated_infra_confidence_risk: 'agent:risk',
        audit_infra_confidence_signals: 'agent:trust',
        publish_infra_confidence_status: 'agent:ops'
    }
});

export function calibrateInfraConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraConfidenceCalibrationEngine extends BaseManager {}

export const __infraConfidenceCalibrationEngineInternals = toolkit.internals;
