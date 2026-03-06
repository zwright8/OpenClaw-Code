import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Impact Failure',
    readyPosture: 'impact_root_cause_ready',
    defaultAgentId: 'agent:impact-root-cause',
    recommendationTypes: {
        primary: 'mine_impact_failure_root_causes',
        guard: 'mitigate_impact_repeat_failure',
        audit: 'audit_impact_root_cause_signals',
        publish: 'publish_impact_root_cause_status'
    },
    recommendationTargetMap: {
        mine_impact_failure_root_causes: 'agent:impact',
        mitigate_impact_repeat_failure: 'agent:reliability',
        audit_impact_root_cause_signals: 'agent:trust',
        publish_impact_root_cause_status: 'agent:ops'
    }
});

export function mineImpactFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactFailureRootCauseMiner extends BaseManager {}

export const __impactFailureRootCauseMinerInternals = toolkit.internals;
