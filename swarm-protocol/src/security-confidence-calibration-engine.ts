import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'security_confidence_calibrated',
    defaultAgentId: 'agent:security-calibration',
    recommendationTypes: {
        primary: 'calibrate_security_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_security_confidence_signals',
        publish: 'publish_security_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_security_confidence: 'agent:security',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_security_confidence_signals: 'agent:trust',
        publish_security_confidence_status: 'agent:ops'
    }
});

export function calibrateSecurityConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityConfidenceCalibrationEngine extends BaseManager {}

export const __securityConfidenceCalibrationEngineInternals = toolkit.internals;
