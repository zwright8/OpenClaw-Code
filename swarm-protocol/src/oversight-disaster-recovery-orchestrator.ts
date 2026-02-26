import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Oversight Recovery Mission',
    readyPosture: 'oversight_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:oversight-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_oversight_disaster_recovery_mission',
        guard: 'mitigate_oversight_recovery_failure_risk',
        audit: 'audit_oversight_disaster_recovery_signals',
        publish: 'publish_oversight_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_oversight_disaster_recovery_mission: 'agent:oversight',
        mitigate_oversight_recovery_failure_risk: 'agent:reliability',
        audit_oversight_disaster_recovery_signals: 'agent:trust',
        publish_oversight_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateOversightDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightDisasterRecoveryOrchestrator extends BaseManager {}

export const __oversightDisasterRecoveryOrchestratorInternals = toolkit.internals;
