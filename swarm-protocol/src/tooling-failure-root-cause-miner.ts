import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Failure',
    readyPosture: 'root_cause_visibility_ready',
    defaultAgentId: 'agent:tooling-root-cause-miner',
    recommendationTypes: {
        primary: 'mine_failure_root_cause_clusters',
        guard: 'mitigate_repeat_failure_risk',
        audit: 'audit_root_cause_signals',
        publish: 'publish_root_cause_status'
    },
    recommendationTargetMap: {
        mine_failure_root_cause_clusters: 'agent:analysis',
        mitigate_repeat_failure_risk: 'agent:reliability',
        audit_root_cause_signals: 'agent:trust',
        publish_root_cause_status: 'agent:ops'
    }
});

export function mineToolingFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingFailureRootCauseMiner extends BaseManager {}

export const __toolingFailureRootCauseMinerInternals = toolkit.internals;
