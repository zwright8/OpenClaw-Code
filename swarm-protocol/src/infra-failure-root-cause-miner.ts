import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Infra Failure',
    readyPosture: 'infra_failure_root_causes_mined',
    defaultAgentId: 'agent:infra-failure-analysis',
    recommendationTypes: {
        primary: 'mine_infra_failure_root_causes',
        guard: 'mitigate_infra_repeat_failures',
        audit: 'audit_infra_failure_signals',
        publish: 'publish_infra_failure_status'
    },
    recommendationTargetMap: {
        mine_infra_failure_root_causes: 'agent:infra',
        mitigate_infra_repeat_failures: 'agent:reliability',
        audit_infra_failure_signals: 'agent:trust',
        publish_infra_failure_status: 'agent:ops'
    }
});

export function mineInfraFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraFailureRootCauseMiner extends BaseManager {}

export const __infraFailureRootCauseMinerInternals = toolkit.internals;
