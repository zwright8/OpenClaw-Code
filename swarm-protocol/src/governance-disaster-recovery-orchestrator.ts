import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Governance Recovery Mission',
    readyPosture: 'governance_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:governance-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_governance_disaster_recovery_mission',
        guard: 'mitigate_governance_recovery_failure_risk',
        audit: 'audit_governance_disaster_recovery_signals',
        publish: 'publish_governance_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_governance_disaster_recovery_mission: 'agent:governance',
        mitigate_governance_recovery_failure_risk: 'agent:reliability',
        audit_governance_disaster_recovery_signals: 'agent:trust',
        publish_governance_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateGovernanceDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceDisasterRecoveryOrchestrator extends BaseManager {}

export const __governanceDisasterRecoveryOrchestratorInternals = toolkit.internals;
