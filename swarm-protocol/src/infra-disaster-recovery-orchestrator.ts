import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Infra Recovery Mission',
    readyPosture: 'infra_disaster_recovery_ready',
    defaultAgentId: 'agent:infra-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_infra_disaster_recovery',
        guard: 'mitigate_infra_recovery_gap_risk',
        audit: 'audit_infra_disaster_recovery_signals',
        publish: 'publish_infra_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_infra_disaster_recovery: 'agent:infra',
        mitigate_infra_recovery_gap_risk: 'agent:reliability',
        audit_infra_disaster_recovery_signals: 'agent:trust',
        publish_infra_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateInfraDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraDisasterRecoveryOrchestrator extends BaseManager {}

export const __infraDisasterRecoveryOrchestratorInternals = toolkit.internals;
