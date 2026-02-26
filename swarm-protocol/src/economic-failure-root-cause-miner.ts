import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Economic Failure',
    readyPosture: 'economic_root_cause_ready',
    defaultAgentId: 'agent:economic-root-cause',
    recommendationTypes: {
        primary: 'mine_economic_failure_root_causes',
        guard: 'mitigate_economic_repeat_failure',
        audit: 'audit_economic_root_cause_signals',
        publish: 'publish_economic_root_cause_status'
    },
    recommendationTargetMap: {
        mine_economic_failure_root_causes: 'agent:economic',
        mitigate_economic_repeat_failure: 'agent:reliability',
        audit_economic_root_cause_signals: 'agent:trust',
        publish_economic_root_cause_status: 'agent:ops'
    }
});

export function mineEconomicFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicFailureRootCauseMiner extends BaseManager {}

export const __economicFailureRootCauseMinerInternals = toolkit.internals;
