import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Federation Data Exchange',
    readyPosture: 'federation_privacy_broker_ready',
    defaultAgentId: 'agent:federation-privacy-broker',
    recommendationTypes: {
        primary: 'broker_federation_privacy_preserving_exchange',
        guard: 'mitigate_federation_data_exposure_risk',
        audit: 'audit_federation_privacy_broker_signals',
        publish: 'publish_federation_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_federation_privacy_preserving_exchange: 'agent:privacy',
        mitigate_federation_data_exposure_risk: 'agent:security',
        audit_federation_privacy_broker_signals: 'agent:trust',
        publish_federation_privacy_broker_status: 'agent:ops'
    }
});

export function brokerFederationPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationPrivacyPreservingDataBroker extends BaseManager {}

export const __federationPrivacyPreservingDataBrokerInternals = toolkit.internals;
