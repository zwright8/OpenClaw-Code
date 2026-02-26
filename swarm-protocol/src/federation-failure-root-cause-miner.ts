import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Federation Failure',
    readyPosture: 'federation_root_cause_ready',
    defaultAgentId: 'agent:federation-root-cause',
    recommendationTypes: {
        primary: 'mine_federation_failure_root_causes',
        guard: 'mitigate_federation_repeat_failure',
        audit: 'audit_federation_root_cause_signals',
        publish: 'publish_federation_root_cause_status'
    },
    recommendationTargetMap: {
        mine_federation_failure_root_causes: 'agent:federation',
        mitigate_federation_repeat_failure: 'agent:reliability',
        audit_federation_root_cause_signals: 'agent:trust',
        publish_federation_root_cause_status: 'agent:ops'
    }
});

export function mineFederationFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationFailureRootCauseMiner extends BaseManager {}

export const __federationFailureRootCauseMinerInternals = toolkit.internals;
