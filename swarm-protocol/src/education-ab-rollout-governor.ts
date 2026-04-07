import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_ab_rollout_governor',
    collectionField: 'rollouts',
    idField: 'rolloutId',
    defaultName: 'Education Rollout',
    readyPosture: 'education_ab_rollout_governed',
    defaultAgentId: 'agent:education-ab-rollout',
    recommendationTypes: {
        primary: 'govern_education_ab_rollout',
        guard: 'mitigate_education_rollout_regression_risk',
        audit: 'audit_education_ab_rollout_signals',
        publish: 'publish_education_ab_rollout_status'
    },
    recommendationTargetMap: {
        govern_education_ab_rollout: 'agent:education',
        mitigate_education_rollout_regression_risk: 'agent:release',
        audit_education_ab_rollout_signals: 'agent:trust',
        publish_education_ab_rollout_status: 'agent:ops'
    }
});

export function governEducationAbRollouts(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationAbRolloutGovernorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationAbRolloutGovernor extends BaseManager {}

export const __educationAbRolloutGovernorInternals = toolkit.internals;
