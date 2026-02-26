import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Recovery Mission',
    readyPosture: 'disaster_recovery_orchestrated',
    defaultAgentId: 'agent:tooling-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_disaster_recovery_mission',
        guard: 'mitigate_recovery_failure_risk',
        audit: 'audit_disaster_recovery_signals',
        publish: 'publish_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_disaster_recovery_mission: 'agent:recovery',
        mitigate_recovery_failure_risk: 'agent:reliability',
        audit_disaster_recovery_signals: 'agent:trust',
        publish_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateToolingDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingDisasterRecoveryOrchestrator extends BaseManager {}

export const __toolingDisasterRecoveryOrchestratorInternals = toolkit.internals;
