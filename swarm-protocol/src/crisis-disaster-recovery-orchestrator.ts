import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Crisis Recovery Mission',
    readyPosture: 'crisis_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:crisis-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_crisis_disaster_recovery_mission',
        guard: 'mitigate_crisis_recovery_failure_risk',
        audit: 'audit_crisis_disaster_recovery_signals',
        publish: 'publish_crisis_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_crisis_disaster_recovery_mission: 'agent:crisis',
        mitigate_crisis_recovery_failure_risk: 'agent:reliability',
        audit_crisis_disaster_recovery_signals: 'agent:trust',
        publish_crisis_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateCrisisDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisDisasterRecoveryOrchestrator extends BaseManager {}

export const __crisisDisasterRecoveryOrchestratorInternals = toolkit.internals;
