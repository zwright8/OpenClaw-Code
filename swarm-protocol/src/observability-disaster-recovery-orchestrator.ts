import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Observability Recovery Mission',
    readyPosture: 'observability_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:observability-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_observability_disaster_recovery_mission',
        guard: 'mitigate_observability_recovery_failure_risk',
        audit: 'audit_observability_disaster_recovery_signals',
        publish: 'publish_observability_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_observability_disaster_recovery_mission: 'agent:observability',
        mitigate_observability_recovery_failure_risk: 'agent:reliability',
        audit_observability_disaster_recovery_signals: 'agent:trust',
        publish_observability_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateObservabilityDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityDisasterRecoveryOrchestrator extends BaseManager {}

export const __observabilityDisasterRecoveryOrchestratorInternals = toolkit.internals;
