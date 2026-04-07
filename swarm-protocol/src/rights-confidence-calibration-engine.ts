import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Rights Calibration Set',
    readyPosture: 'rights_confidence_calibrated',
    defaultAgentId: 'agent:rights-calibration',
    recommendationTypes: {
        primary: 'calibrate_rights_confidence',
        guard: 'mitigate_miscalibrated_rights_confidence_risk',
        audit: 'audit_rights_confidence_signals',
        publish: 'publish_rights_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_rights_confidence: 'agent:rights',
        mitigate_miscalibrated_rights_confidence_risk: 'agent:risk',
        audit_rights_confidence_signals: 'agent:trust',
        publish_rights_confidence_status: 'agent:ops'
    }
});

export function calibrateRightsConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsConfidenceCalibrationEngine extends BaseManager {}

export const __rightsConfidenceCalibrationEngineInternals = toolkit.internals;
