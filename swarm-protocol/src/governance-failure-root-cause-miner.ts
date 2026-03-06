import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_failure_root_cause_miner',
    collectionField: 'failures',
    idField: 'failureId',
    defaultName: 'Governance Failure',
    readyPosture: 'governance_root_cause_ready',
    defaultAgentId: 'agent:governance-root-cause',
    recommendationTypes: {
        primary: 'mine_governance_failure_root_causes',
        guard: 'mitigate_governance_repeat_failure',
        audit: 'audit_governance_root_cause_signals',
        publish: 'publish_governance_root_cause_status'
    },
    recommendationTargetMap: {
        mine_governance_failure_root_causes: 'agent:governance',
        mitigate_governance_repeat_failure: 'agent:reliability',
        audit_governance_root_cause_signals: 'agent:trust',
        publish_governance_root_cause_status: 'agent:ops'
    }
});

export function mineGovernanceFailureRootCauses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceFailureRootCauseMinerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceFailureRootCauseMiner extends BaseManager {}

export const __governanceFailureRootCauseMinerInternals = toolkit.internals;
