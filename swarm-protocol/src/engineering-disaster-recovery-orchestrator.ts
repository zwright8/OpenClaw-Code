import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Engineering Recovery Mission',
    readyPosture: 'engineering_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:engineering-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_engineering_disaster_recovery_mission',
        guard: 'mitigate_engineering_recovery_failure_risk',
        audit: 'audit_engineering_disaster_recovery_signals',
        publish: 'publish_engineering_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_engineering_disaster_recovery_mission: 'agent:engineering',
        mitigate_engineering_recovery_failure_risk: 'agent:reliability',
        audit_engineering_disaster_recovery_signals: 'agent:trust',
        publish_engineering_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateEngineeringDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringDisasterRecoveryOrchestrator extends BaseManager {}

export const __engineeringDisasterRecoveryOrchestratorInternals = toolkit.internals;
