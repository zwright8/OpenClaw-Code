import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Inclusion Failure',
    readyPosture: 'inclusion_failure_root_causes_mined',
    defaultAgentId: 'agent:inclusion-failure-analysis',
    recommendationTypes: {
        primary: 'mine_inclusion_failure_root_causes',
        guard: 'mitigate_inclusion_repeat_failures',
        audit: 'audit_inclusion_failure_signals',
        publish: 'publish_inclusion_failure_status'
    },
    recommendationTargetMap: {
        mine_inclusion_failure_root_causes: 'agent:inclusion',
        mitigate_inclusion_repeat_failures: 'agent:reliability',
        audit_inclusion_failure_signals: 'agent:trust',
        publish_inclusion_failure_status: 'agent:ops'
    }
});

export function mineInclusionFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionFailureRootCauseMiner extends BaseManager {}

export const __inclusionFailureRootCauseMinerInternals = toolkit.internals;
