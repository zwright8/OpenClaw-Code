import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Calibration Set',
    readyPosture: 'research_confidence_calibrated',
    defaultAgentId: 'agent:research-calibration',
    recommendationTypes: {
        primary: 'calibrate_research_confidence',
        guard: 'mitigate_miscalibrated_confidence_risk',
        audit: 'audit_research_confidence_signals',
        publish: 'publish_research_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_research_confidence: 'agent:research',
        mitigate_miscalibrated_confidence_risk: 'agent:risk',
        audit_research_confidence_signals: 'agent:trust',
        publish_research_confidence_status: 'agent:ops'
    }
});

export function calibrateResearchConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchConfidenceCalibrationEngine extends BaseManager {}

export const __researchConfidenceCalibrationEngineInternals = toolkit.internals;
