import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Impact Recovery Mission',
    readyPosture: 'impact_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:impact-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_impact_disaster_recovery_mission',
        guard: 'mitigate_impact_recovery_failure_risk',
        audit: 'audit_impact_disaster_recovery_signals',
        publish: 'publish_impact_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_impact_disaster_recovery_mission: 'agent:impact',
        mitigate_impact_recovery_failure_risk: 'agent:reliability',
        audit_impact_disaster_recovery_signals: 'agent:trust',
        publish_impact_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateImpactDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactDisasterRecoveryOrchestrator extends BaseManager {}

export const __impactDisasterRecoveryOrchestratorInternals = toolkit.internals;
