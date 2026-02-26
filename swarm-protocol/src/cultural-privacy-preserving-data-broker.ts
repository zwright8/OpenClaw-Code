import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Cultural Data Exchange',
    readyPosture: 'cultural_privacy_broker_ready',
    defaultAgentId: 'agent:cultural-privacy-broker',
    recommendationTypes: {
        primary: 'broker_cultural_privacy_preserving_exchange',
        guard: 'mitigate_cultural_data_exposure_risk',
        audit: 'audit_cultural_privacy_broker_signals',
        publish: 'publish_cultural_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_cultural_privacy_preserving_exchange: 'agent:privacy',
        mitigate_cultural_data_exposure_risk: 'agent:cultural',
        audit_cultural_privacy_broker_signals: 'agent:trust',
        publish_cultural_privacy_broker_status: 'agent:ops'
    }
});

export function brokerCulturalPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalPrivacyPreservingDataBroker extends BaseManager {}

export const __culturalPrivacyPreservingDataBrokerInternals = toolkit.internals;
