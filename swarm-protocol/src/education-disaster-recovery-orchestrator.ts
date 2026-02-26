import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Education Recovery Mission',
    readyPosture: 'education_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:education-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_education_disaster_recovery_mission',
        guard: 'mitigate_education_recovery_failure_risk',
        audit: 'audit_education_disaster_recovery_signals',
        publish: 'publish_education_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_education_disaster_recovery_mission: 'agent:education',
        mitigate_education_recovery_failure_risk: 'agent:reliability',
        audit_education_disaster_recovery_signals: 'agent:trust',
        publish_education_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateEducationDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationDisasterRecoveryOrchestrator extends BaseManager {}

export const __educationDisasterRecoveryOrchestratorInternals = toolkit.internals;
