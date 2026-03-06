import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'PublicService Failure',
    readyPosture: 'publicservice_root_cause_ready',
    defaultAgentId: 'agent:publicservice-root-cause',
    recommendationTypes: {
        primary: 'mine_publicservice_failure_root_causes',
        guard: 'mitigate_publicservice_repeat_failure',
        audit: 'audit_publicservice_root_cause_signals',
        publish: 'publish_publicservice_root_cause_status'
    },
    recommendationTargetMap: {
        mine_publicservice_failure_root_causes: 'agent:publicservice',
        mitigate_publicservice_repeat_failure: 'agent:reliability',
        audit_publicservice_root_cause_signals: 'agent:trust',
        publish_publicservice_root_cause_status: 'agent:ops'
    }
});

export function minePublicServiceFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceFailureRootCauseMiner extends BaseManager {}

export const __publicServiceFailureRootCauseMinerInternals = toolkit.internals;
