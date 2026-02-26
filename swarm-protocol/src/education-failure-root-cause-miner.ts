import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Education Failure',
    readyPosture: 'education_root_cause_ready',
    defaultAgentId: 'agent:education-root-cause',
    recommendationTypes: {
        primary: 'mine_education_failure_root_causes',
        guard: 'mitigate_education_repeat_failure',
        audit: 'audit_education_root_cause_signals',
        publish: 'publish_education_root_cause_status'
    },
    recommendationTargetMap: {
        mine_education_failure_root_causes: 'agent:education',
        mitigate_education_repeat_failure: 'agent:reliability',
        audit_education_root_cause_signals: 'agent:trust',
        publish_education_root_cause_status: 'agent:ops'
    }
});

export function mineEducationFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationFailureRootCauseMiner extends BaseManager {}

export const __educationFailureRootCauseMinerInternals = toolkit.internals;

