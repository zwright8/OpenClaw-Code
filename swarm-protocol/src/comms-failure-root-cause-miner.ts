import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Comms Failure',
    readyPosture: 'comms_root_cause_ready',
    defaultAgentId: 'agent:comms-root-cause',
    recommendationTypes: {
        primary: 'mine_comms_failure_root_causes',
        guard: 'mitigate_comms_repeat_failure',
        audit: 'audit_comms_root_cause_signals',
        publish: 'publish_comms_root_cause_status'
    },
    recommendationTargetMap: {
        mine_comms_failure_root_causes: 'agent:comms',
        mitigate_comms_repeat_failure: 'agent:reliability',
        audit_comms_root_cause_signals: 'agent:trust',
        publish_comms_root_cause_status: 'agent:ops'
    }
});

export function mineCommsFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsFailureRootCauseMiner extends BaseManager {}

export const __commsFailureRootCauseMinerInternals = toolkit.internals;
