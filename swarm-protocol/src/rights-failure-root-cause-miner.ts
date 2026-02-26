import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Rights Failure',
    readyPosture: 'rights_failure_root_causes_mined',
    defaultAgentId: 'agent:rights-failure-analysis',
    recommendationTypes: {
        primary: 'mine_rights_failure_root_causes',
        guard: 'mitigate_rights_repeat_failures',
        audit: 'audit_rights_failure_signals',
        publish: 'publish_rights_failure_status'
    },
    recommendationTargetMap: {
        mine_rights_failure_root_causes: 'agent:rights',
        mitigate_rights_repeat_failures: 'agent:reliability',
        audit_rights_failure_signals: 'agent:trust',
        publish_rights_failure_status: 'agent:ops'
    }
});

export function mineRightsFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsFailureRootCauseMiner extends BaseManager {}

export const __rightsFailureRootCauseMinerInternals = toolkit.internals;
