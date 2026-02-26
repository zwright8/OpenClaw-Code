import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'governance_confidence_calibrated',
    defaultAgentId: 'agent:governance-calibration',
    recommendationTypes: {
        primary: 'calibrate_governance_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_governance_confidence_signals',
        publish: 'publish_governance_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_governance_confidence: 'agent:governance',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_governance_confidence_signals: 'agent:trust',
        publish_governance_confidence_status: 'agent:ops'
    }
});

export function calibrateGovernanceConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceConfidenceCalibrationEngine extends BaseManager {}

export const __governanceConfidenceCalibrationEngineInternals = toolkit.internals;
