import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Crisis Failure',
    readyPosture: 'crisis_root_cause_ready',
    defaultAgentId: 'agent:crisis-root-cause',
    recommendationTypes: {
        primary: 'mine_crisis_failure_root_causes',
        guard: 'mitigate_crisis_repeat_failure',
        audit: 'audit_crisis_root_cause_signals',
        publish: 'publish_crisis_root_cause_status'
    },
    recommendationTargetMap: {
        mine_crisis_failure_root_causes: 'agent:crisis',
        mitigate_crisis_repeat_failure: 'agent:reliability',
        audit_crisis_root_cause_signals: 'agent:trust',
        publish_crisis_root_cause_status: 'agent:ops'
    }
});

export function mineCrisisFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisFailureRootCauseMiner extends BaseManager {}

export const __crisisFailureRootCauseMinerInternals = toolkit.internals;
