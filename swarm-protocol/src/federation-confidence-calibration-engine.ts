import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'federation_confidence_calibrated',
    defaultAgentId: 'agent:federation-calibration',
    recommendationTypes: {
        primary: 'calibrate_federation_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_federation_confidence_signals',
        publish: 'publish_federation_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_federation_confidence: 'agent:federation',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_federation_confidence_signals: 'agent:trust',
        publish_federation_confidence_status: 'agent:ops'
    }
});

export function calibrateFederationConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationConfidenceCalibrationEngine extends BaseManager {}

export const __federationConfidenceCalibrationEngineInternals = toolkit.internals;
