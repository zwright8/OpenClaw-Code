import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Research Recovery Mission',
    readyPosture: 'research_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:research-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_research_disaster_recovery_mission',
        guard: 'mitigate_research_recovery_failure_risk',
        audit: 'audit_research_disaster_recovery_signals',
        publish: 'publish_research_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_research_disaster_recovery_mission: 'agent:research',
        mitigate_research_recovery_failure_risk: 'agent:reliability',
        audit_research_disaster_recovery_signals: 'agent:trust',
        publish_research_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateResearchDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchDisasterRecoveryOrchestrator extends BaseManager {}

export const __researchDisasterRecoveryOrchestratorInternals = toolkit.internals;
