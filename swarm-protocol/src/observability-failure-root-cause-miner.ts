import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Observability Failure',
    readyPosture: 'observability_root_cause_ready',
    defaultAgentId: 'agent:observability-root-cause',
    recommendationTypes: {
        primary: 'mine_observability_failure_root_causes',
        guard: 'mitigate_observability_repeat_failure',
        audit: 'audit_observability_root_cause_signals',
        publish: 'publish_observability_root_cause_status'
    },
    recommendationTargetMap: {
        mine_observability_failure_root_causes: 'agent:observability',
        mitigate_observability_repeat_failure: 'agent:reliability',
        audit_observability_root_cause_signals: 'agent:trust',
        publish_observability_root_cause_status: 'agent:ops'
    }
});

export function mineObservabilityFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityFailureRootCauseMiner extends BaseManager {}

export const __observabilityFailureRootCauseMinerInternals = toolkit.internals;
