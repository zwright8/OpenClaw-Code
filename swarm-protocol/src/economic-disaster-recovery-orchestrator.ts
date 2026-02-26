import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Economic Recovery Mission',
    readyPosture: 'economic_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:economic-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_economic_disaster_recovery_mission',
        guard: 'mitigate_economic_recovery_failure_risk',
        audit: 'audit_economic_disaster_recovery_signals',
        publish: 'publish_economic_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_economic_disaster_recovery_mission: 'agent:economic',
        mitigate_economic_recovery_failure_risk: 'agent:reliability',
        audit_economic_disaster_recovery_signals: 'agent:trust',
        publish_economic_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateEconomicDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicDisasterRecoveryOrchestrator extends BaseManager {}

export const __economicDisasterRecoveryOrchestratorInternals = toolkit.internals;
