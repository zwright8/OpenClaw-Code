import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Security Failure',
    readyPosture: 'security_root_cause_ready',
    defaultAgentId: 'agent:security-root-cause',
    recommendationTypes: {
        primary: 'mine_security_failure_root_causes',
        guard: 'mitigate_security_repeat_failure',
        audit: 'audit_security_root_cause_signals',
        publish: 'publish_security_root_cause_status'
    },
    recommendationTargetMap: {
        mine_security_failure_root_causes: 'agent:security',
        mitigate_security_repeat_failure: 'agent:reliability',
        audit_security_root_cause_signals: 'agent:trust',
        publish_security_root_cause_status: 'agent:ops'
    }
});

export function mineSecurityFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityFailureRootCauseMiner extends BaseManager {}

export const __securityFailureRootCauseMinerInternals = toolkit.internals;
