import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Inclusion Recovery Mission',
    readyPosture: 'inclusion_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:inclusion-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_inclusion_disaster_recovery_mission',
        guard: 'mitigate_inclusion_recovery_failure_risk',
        audit: 'audit_inclusion_disaster_recovery_signals',
        publish: 'publish_inclusion_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_inclusion_disaster_recovery_mission: 'agent:inclusion',
        mitigate_inclusion_recovery_failure_risk: 'agent:reliability',
        audit_inclusion_disaster_recovery_signals: 'agent:trust',
        publish_inclusion_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateInclusionDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionDisasterRecoveryOrchestrator extends BaseManager {}

export const __inclusionDisasterRecoveryOrchestratorInternals = toolkit.internals;
