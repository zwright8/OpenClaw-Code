import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'PublicService Calibration Set',
    readyPosture: 'publicservice_confidence_calibrated',
    defaultAgentId: 'agent:publicservice-calibration',
    recommendationTypes: {
        primary: 'calibrate_publicservice_confidence',
        guard: 'mitigate_publicservice_miscalibrated_confidence_risk',
        audit: 'audit_publicservice_confidence_signals',
        publish: 'publish_publicservice_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_publicservice_confidence: 'agent:publicservice',
        mitigate_publicservice_miscalibrated_confidence_risk: 'agent:risk',
        audit_publicservice_confidence_signals: 'agent:trust',
        publish_publicservice_confidence_status: 'agent:ops'
    }
});

export function calibratePublicServiceConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceConfidenceCalibrationEngine extends BaseManager {}

export const __publicServiceConfidenceCalibrationEngineInternals = toolkit.internals;
