import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Rights Recovery Mission',
    readyPosture: 'rights_disaster_recovery_ready',
    defaultAgentId: 'agent:rights-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_rights_disaster_recovery',
        guard: 'mitigate_rights_recovery_gap_risk',
        audit: 'audit_rights_disaster_recovery_signals',
        publish: 'publish_rights_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_rights_disaster_recovery: 'agent:rights',
        mitigate_rights_recovery_gap_risk: 'agent:reliability',
        audit_rights_disaster_recovery_signals: 'agent:trust',
        publish_rights_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateRightsDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsDisasterRecoveryOrchestrator extends BaseManager {}

export const __rightsDisasterRecoveryOrchestratorInternals = toolkit.internals;
