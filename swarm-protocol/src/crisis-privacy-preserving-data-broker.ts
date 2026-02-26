import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Crisis Data Exchange',
    readyPosture: 'crisis_privacy_broker_ready',
    defaultAgentId: 'agent:crisis-privacy-broker',
    recommendationTypes: {
        primary: 'broker_crisis_privacy_preserving_exchange',
        guard: 'mitigate_crisis_data_exposure_risk',
        audit: 'audit_crisis_privacy_broker_signals',
        publish: 'publish_crisis_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_crisis_privacy_preserving_exchange: 'agent:privacy',
        mitigate_crisis_data_exposure_risk: 'agent:crisis',
        audit_crisis_privacy_broker_signals: 'agent:trust',
        publish_crisis_privacy_broker_status: 'agent:ops'
    }
});

export function brokerCrisisPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisPrivacyPreservingDataBroker extends BaseManager {}

export const __crisisPrivacyPreservingDataBrokerInternals = toolkit.internals;
