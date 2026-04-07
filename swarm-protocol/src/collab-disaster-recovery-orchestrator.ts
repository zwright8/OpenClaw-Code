import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Collab Recovery Mission',
    readyPosture: 'collab_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:collab-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_collab_disaster_recovery_mission',
        guard: 'mitigate_collab_recovery_failure_risk',
        audit: 'audit_collab_disaster_recovery_signals',
        publish: 'publish_collab_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_collab_disaster_recovery_mission: 'agent:collab',
        mitigate_collab_recovery_failure_risk: 'agent:reliability',
        audit_collab_disaster_recovery_signals: 'agent:trust',
        publish_collab_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateCollabDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabDisasterRecoveryOrchestrator extends BaseManager {}

export const __collabDisasterRecoveryOrchestratorInternals = toolkit.internals;
