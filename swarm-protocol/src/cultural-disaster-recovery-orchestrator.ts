import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Cultural Recovery Mission',
    readyPosture: 'cultural_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:cultural-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_cultural_disaster_recovery_mission',
        guard: 'mitigate_cultural_recovery_failure_risk',
        audit: 'audit_cultural_disaster_recovery_signals',
        publish: 'publish_cultural_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_cultural_disaster_recovery_mission: 'agent:cultural',
        mitigate_cultural_recovery_failure_risk: 'agent:reliability',
        audit_cultural_disaster_recovery_signals: 'agent:trust',
        publish_cultural_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateCulturalDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalDisasterRecoveryOrchestrator extends BaseManager {}

export const __culturalDisasterRecoveryOrchestratorInternals = toolkit.internals;
