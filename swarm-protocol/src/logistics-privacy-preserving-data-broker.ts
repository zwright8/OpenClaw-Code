import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Logistics Data Exchange',
    readyPosture: 'logistics_privacy_broker_ready',
    defaultAgentId: 'agent:logistics-privacy-broker',
    recommendationTypes: {
        primary: 'broker_logistics_privacy_preserving_exchange',
        guard: 'mitigate_logistics_data_exposure_risk',
        audit: 'audit_logistics_privacy_broker_signals',
        publish: 'publish_logistics_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_logistics_privacy_preserving_exchange: 'agent:privacy',
        mitigate_logistics_data_exposure_risk: 'agent:security',
        audit_logistics_privacy_broker_signals: 'agent:trust',
        publish_logistics_privacy_broker_status: 'agent:ops'
    }
});

export function brokerLogisticsPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsPrivacyPreservingDataBroker extends BaseManager {}

export const __logisticsPrivacyPreservingDataBrokerInternals = toolkit.internals;
