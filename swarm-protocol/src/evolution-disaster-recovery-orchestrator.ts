import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Evolution Recovery Mission',
    readyPosture: 'evolution_disaster_recovery_ready',
    defaultAgentId: 'agent:evolution-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_evolution_disaster_recovery',
        guard: 'mitigate_evolution_recovery_gap_risk',
        audit: 'audit_evolution_disaster_recovery_signals',
        publish: 'publish_evolution_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_evolution_disaster_recovery: 'agent:evolution',
        mitigate_evolution_recovery_gap_risk: 'agent:reliability',
        audit_evolution_disaster_recovery_signals: 'agent:trust',
        publish_evolution_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateEvolutionDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionDisasterRecoveryOrchestrator extends BaseManager {}

export const __evolutionDisasterRecoveryOrchestratorInternals = toolkit.internals;
