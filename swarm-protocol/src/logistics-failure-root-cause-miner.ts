import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Logistics Failure',
    readyPosture: 'logistics_root_cause_ready',
    defaultAgentId: 'agent:logistics-root-cause',
    recommendationTypes: {
        primary: 'mine_logistics_failure_root_causes',
        guard: 'mitigate_logistics_repeat_failure',
        audit: 'audit_logistics_root_cause_signals',
        publish: 'publish_logistics_root_cause_status'
    },
    recommendationTargetMap: {
        mine_logistics_failure_root_causes: 'agent:logistics',
        mitigate_logistics_repeat_failure: 'agent:reliability',
        audit_logistics_root_cause_signals: 'agent:trust',
        publish_logistics_root_cause_status: 'agent:ops'
    }
});

export function mineLogisticsFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsFailureRootCauseMiner extends BaseManager {}

export const __logisticsFailureRootCauseMinerInternals = toolkit.internals;
