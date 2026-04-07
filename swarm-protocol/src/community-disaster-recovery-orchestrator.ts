import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Community Recovery Mission',
    readyPosture: 'community_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:community-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_community_disaster_recovery_mission',
        guard: 'mitigate_community_recovery_failure_risk',
        audit: 'audit_community_disaster_recovery_signals',
        publish: 'publish_community_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_community_disaster_recovery_mission: 'agent:community',
        mitigate_community_recovery_failure_risk: 'agent:reliability',
        audit_community_disaster_recovery_signals: 'agent:trust',
        publish_community_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateCommunityDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityDisasterRecoveryOrchestrator extends BaseManager {}

export const __communityDisasterRecoveryOrchestratorInternals = toolkit.internals;
