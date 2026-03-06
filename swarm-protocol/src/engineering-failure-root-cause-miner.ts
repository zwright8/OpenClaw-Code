import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Engineering Failure',
    readyPosture: 'engineering_root_cause_ready',
    defaultAgentId: 'agent:engineering-root-cause',
    recommendationTypes: {
        primary: 'mine_engineering_failure_root_causes',
        guard: 'mitigate_engineering_repeat_failure',
        audit: 'audit_engineering_root_cause_signals',
        publish: 'publish_engineering_root_cause_status'
    },
    recommendationTargetMap: {
        mine_engineering_failure_root_causes: 'agent:engineering',
        mitigate_engineering_repeat_failure: 'agent:reliability',
        audit_engineering_root_cause_signals: 'agent:trust',
        publish_engineering_root_cause_status: 'agent:ops'
    }
});

export function mineEngineeringFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringFailureRootCauseMiner extends BaseManager {}

export const __engineeringFailureRootCauseMinerInternals = toolkit.internals;
