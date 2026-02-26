import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Comms Recovery Mission',
    readyPosture: 'comms_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:comms-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_comms_disaster_recovery_mission',
        guard: 'mitigate_comms_recovery_failure_risk',
        audit: 'audit_comms_disaster_recovery_signals',
        publish: 'publish_comms_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_comms_disaster_recovery_mission: 'agent:comms',
        mitigate_comms_recovery_failure_risk: 'agent:reliability',
        audit_comms_disaster_recovery_signals: 'agent:trust',
        publish_comms_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateCommsDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsDisasterRecoveryOrchestrator extends BaseManager {}

export const __commsDisasterRecoveryOrchestratorInternals = toolkit.internals;
