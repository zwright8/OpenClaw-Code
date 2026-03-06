import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Federation Recovery Mission',
    readyPosture: 'federation_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:federation-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_federation_disaster_recovery_mission',
        guard: 'mitigate_federation_recovery_failure_risk',
        audit: 'audit_federation_disaster_recovery_signals',
        publish: 'publish_federation_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_federation_disaster_recovery_mission: 'agent:federation',
        mitigate_federation_recovery_failure_risk: 'agent:reliability',
        audit_federation_disaster_recovery_signals: 'agent:trust',
        publish_federation_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateFederationDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationDisasterRecoveryOrchestrator extends BaseManager {}

export const __federationDisasterRecoveryOrchestratorInternals = toolkit.internals;
