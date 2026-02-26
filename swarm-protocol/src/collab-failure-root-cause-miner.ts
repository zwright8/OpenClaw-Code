import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Collab Failure',
    readyPosture: 'collab_root_cause_ready',
    defaultAgentId: 'agent:collab-root-cause',
    recommendationTypes: {
        primary: 'mine_collab_failure_root_causes',
        guard: 'mitigate_collab_repeat_failure',
        audit: 'audit_collab_root_cause_signals',
        publish: 'publish_collab_root_cause_status'
    },
    recommendationTargetMap: {
        mine_collab_failure_root_causes: 'agent:collab',
        mitigate_collab_repeat_failure: 'agent:reliability',
        audit_collab_root_cause_signals: 'agent:trust',
        publish_collab_root_cause_status: 'agent:ops'
    }
});

export function mineCollabFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabFailureRootCauseMiner extends BaseManager {}

export const __collabFailureRootCauseMinerInternals = toolkit.internals;
