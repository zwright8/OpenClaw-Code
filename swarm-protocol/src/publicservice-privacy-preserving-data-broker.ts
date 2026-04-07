import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'PublicService Data Exchange',
    readyPosture: 'publicservice_privacy_broker_ready',
    defaultAgentId: 'agent:publicservice-privacy-broker',
    recommendationTypes: {
        primary: 'broker_publicservice_privacy_preserving_exchange',
        guard: 'mitigate_publicservice_data_exposure_risk',
        audit: 'audit_publicservice_privacy_broker_signals',
        publish: 'publish_publicservice_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_publicservice_privacy_preserving_exchange: 'agent:privacy',
        mitigate_publicservice_data_exposure_risk: 'agent:security',
        audit_publicservice_privacy_broker_signals: 'agent:trust',
        publish_publicservice_privacy_broker_status: 'agent:ops'
    }
});

export function brokerPublicServicePrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServicePrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServicePrivacyPreservingDataBroker extends BaseManager {}

export const __publicServicePrivacyPreservingDataBrokerInternals = toolkit.internals;
