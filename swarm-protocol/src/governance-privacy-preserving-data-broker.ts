import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Governance Data Exchange',
    readyPosture: 'governance_privacy_broker_ready',
    defaultAgentId: 'agent:governance-privacy-broker',
    recommendationTypes: {
        primary: 'broker_governance_privacy_preserving_exchange',
        guard: 'mitigate_governance_data_exposure_risk',
        audit: 'audit_governance_privacy_broker_signals',
        publish: 'publish_governance_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_governance_privacy_preserving_exchange: 'agent:privacy',
        mitigate_governance_data_exposure_risk: 'agent:security',
        audit_governance_privacy_broker_signals: 'agent:trust',
        publish_governance_privacy_broker_status: 'agent:ops'
    }
});

export function brokerGovernancePrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governancePrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernancePrivacyPreservingDataBroker extends BaseManager {}

export const __governancePrivacyPreservingDataBrokerInternals = toolkit.internals;
