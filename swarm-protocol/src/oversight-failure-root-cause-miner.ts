import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Oversight Failure',
    readyPosture: 'oversight_root_cause_ready',
    defaultAgentId: 'agent:oversight-root-cause',
    recommendationTypes: {
        primary: 'mine_oversight_failure_root_causes',
        guard: 'mitigate_oversight_repeat_failure',
        audit: 'audit_oversight_root_cause_signals',
        publish: 'publish_oversight_root_cause_status'
    },
    recommendationTargetMap: {
        mine_oversight_failure_root_causes: 'agent:oversight',
        mitigate_oversight_repeat_failure: 'agent:reliability',
        audit_oversight_root_cause_signals: 'agent:trust',
        publish_oversight_root_cause_status: 'agent:ops'
    }
});

export function mineOversightFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightFailureRootCauseMiner extends BaseManager {}

export const __oversightFailureRootCauseMinerInternals = toolkit.internals;
