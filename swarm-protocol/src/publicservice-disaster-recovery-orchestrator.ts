import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'PublicService Recovery Mission',
    readyPosture: 'publicservice_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:publicservice-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_publicservice_disaster_recovery_mission',
        guard: 'mitigate_publicservice_recovery_failure_risk',
        audit: 'audit_publicservice_disaster_recovery_signals',
        publish: 'publish_publicservice_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_publicservice_disaster_recovery_mission: 'agent:publicservice',
        mitigate_publicservice_recovery_failure_risk: 'agent:reliability',
        audit_publicservice_disaster_recovery_signals: 'agent:trust',
        publish_publicservice_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestratePublicServiceDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceDisasterRecoveryOrchestrator extends BaseManager {}

export const __publicServiceDisasterRecoveryOrchestratorInternals = toolkit.internals;
