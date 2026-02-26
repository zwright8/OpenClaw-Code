import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_disaster_recovery_orchestrator',
    collectionField: 'recoveryMissions',
    idField: 'missionId',
    defaultName: 'Security Recovery Mission',
    readyPosture: 'security_disaster_recovery_orchestrated',
    defaultAgentId: 'agent:security-disaster-recovery',
    recommendationTypes: {
        primary: 'orchestrate_security_disaster_recovery_mission',
        guard: 'mitigate_security_recovery_failure_risk',
        audit: 'audit_security_disaster_recovery_signals',
        publish: 'publish_security_disaster_recovery_status'
    },
    recommendationTargetMap: {
        orchestrate_security_disaster_recovery_mission: 'agent:security',
        mitigate_security_recovery_failure_risk: 'agent:reliability',
        audit_security_disaster_recovery_signals: 'agent:trust',
        publish_security_disaster_recovery_status: 'agent:ops'
    }
});

export function orchestrateSecurityDisasterRecovery(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityDisasterRecoveryOrchestratorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityDisasterRecoveryOrchestrator extends BaseManager {}

export const __securityDisasterRecoveryOrchestratorInternals = toolkit.internals;
