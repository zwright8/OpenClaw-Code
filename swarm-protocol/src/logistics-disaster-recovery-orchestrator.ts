import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Logistics Recovery Mission',
    readyPosture: 'logistics_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:logistics-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_logistics_disaster_recovery_mission',
        guard: 'mitigate_logistics_recovery_failure_risk',
        audit: 'audit_logistics_disaster_recovery_signals',
        publish: 'publish_logistics_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_logistics_disaster_recovery_mission: 'agent:logistics',
        mitigate_logistics_recovery_failure_risk: 'agent:reliability',
        audit_logistics_disaster_recovery_signals: 'agent:trust',
        publish_logistics_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateLogisticsDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsDisasterRecoveryOrchestrator extends BaseManager {}

export const __logisticsDisasterRecoveryOrchestratorInternals = toolkit.internals;
