import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Economic Data Exchange',
    readyPosture: 'economic_privacy_broker_ready',
    defaultAgentId: 'agent:economic-privacy-broker',
    recommendationTypes: {
        primary: 'broker_economic_privacy_preserving_exchange',
        guard: 'mitigate_economic_data_exposure_risk',
        audit: 'audit_economic_privacy_broker_signals',
        publish: 'publish_economic_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_economic_privacy_preserving_exchange: 'agent:privacy',
        mitigate_economic_data_exposure_risk: 'agent:security',
        audit_economic_privacy_broker_signals: 'agent:trust',
        publish_economic_privacy_broker_status: 'agent:ops'
    }
});

export function brokerEconomicPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicPrivacyPreservingDataBroker extends BaseManager {}

export const __economicPrivacyPreservingDataBrokerInternals = toolkit.internals;
