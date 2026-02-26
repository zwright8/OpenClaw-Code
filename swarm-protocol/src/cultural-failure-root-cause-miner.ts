import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Cultural Failure',
    readyPosture: 'cultural_failure_root_causes_mined',
    defaultAgentId: 'agent:cultural-failure-analysis',
    recommendationTypes: {
        primary: 'mine_cultural_failure_root_causes',
        guard: 'mitigate_cultural_repeat_failures',
        audit: 'audit_cultural_failure_signals',
        publish: 'publish_cultural_failure_status'
    },
    recommendationTargetMap: {
        mine_cultural_failure_root_causes: 'agent:cultural',
        mitigate_cultural_repeat_failures: 'agent:reliability',
        audit_cultural_failure_signals: 'agent:trust',
        publish_cultural_failure_status: 'agent:ops'
    }
});

export function mineCulturalFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalFailureRootCauseMiner extends BaseManager {}

export const __culturalFailureRootCauseMinerInternals = toolkit.internals;
