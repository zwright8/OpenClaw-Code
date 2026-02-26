import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_confidence_calibration_engine',
    collectionField: 'calibrationSets',
    idField: 'setId',
    defaultName: 'Evolution Calibration Set',
    readyPosture: 'evolution_confidence_calibrated',
    defaultAgentId: 'agent:evolution-calibration',
    recommendationTypes: {
        primary: 'calibrate_evolution_confidence',
        guard: 'mitigate_miscalibrated_evolution_confidence_risk',
        audit: 'audit_evolution_confidence_signals',
        publish: 'publish_evolution_confidence_status'
    },
    recommendationTargetMap: {
        calibrate_evolution_confidence: 'agent:evolution',
        mitigate_miscalibrated_evolution_confidence_risk: 'agent:risk',
        audit_evolution_confidence_signals: 'agent:trust',
        publish_evolution_confidence_status: 'agent:ops'
    }
});

export function calibrateEvolutionConfidence(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionConfidenceCalibrationEngineToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionConfidenceCalibrationEngine extends BaseManager {}

export const __evolutionConfidenceCalibrationEngineInternals = toolkit.internals;
