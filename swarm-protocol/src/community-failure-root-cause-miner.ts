import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Community Failure',
    readyPosture: 'community_failure_root_causes_mined',
    defaultAgentId: 'agent:community-failure-analysis',
    recommendationTypes: {
        primary: 'mine_community_failure_root_causes',
        guard: 'mitigate_community_repeat_failures',
        audit: 'audit_community_failure_signals',
        publish: 'publish_community_failure_status'
    },
    recommendationTargetMap: {
        mine_community_failure_root_causes: 'agent:community',
        mitigate_community_repeat_failures: 'agent:reliability',
        audit_community_failure_signals: 'agent:trust',
        publish_community_failure_status: 'agent:ops'
    }
});

export function mineCommunityFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityFailureRootCauseMiner extends BaseManager {}

export const __communityFailureRootCauseMinerInternals = toolkit.internals;
