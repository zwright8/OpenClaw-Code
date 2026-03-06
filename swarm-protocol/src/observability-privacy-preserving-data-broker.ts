import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Observability Data Exchange',
    readyPosture: 'observability_privacy_broker_ready',
    defaultAgentId: 'agent:observability-privacy-broker',
    recommendationTypes: {
        primary: 'broker_observability_privacy_preserving_exchange',
        guard: 'mitigate_observability_data_exposure_risk',
        audit: 'audit_observability_privacy_broker_signals',
        publish: 'publish_observability_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_observability_privacy_preserving_exchange: 'agent:privacy',
        mitigate_observability_data_exposure_risk: 'agent:security',
        audit_observability_privacy_broker_signals: 'agent:trust',
        publish_observability_privacy_broker_status: 'agent:ops'
    }
});

export function brokerObservabilityPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityPrivacyPreservingDataBroker extends BaseManager {}

export const __observabilityPrivacyPreservingDataBrokerInternals = toolkit.internals;
