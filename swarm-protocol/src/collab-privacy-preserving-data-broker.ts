import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Collab Data Exchange',
    readyPosture: 'collab_privacy_broker_ready',
    defaultAgentId: 'agent:collab-privacy-broker',
    recommendationTypes: {
        primary: 'broker_collab_privacy_preserving_exchange',
        guard: 'mitigate_collab_data_exposure_risk',
        audit: 'audit_collab_privacy_broker_signals',
        publish: 'publish_collab_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_collab_privacy_preserving_exchange: 'agent:privacy',
        mitigate_collab_data_exposure_risk: 'agent:security',
        audit_collab_privacy_broker_signals: 'agent:trust',
        publish_collab_privacy_broker_status: 'agent:ops'
    }
});

export function brokerCollabPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabPrivacyPreservingDataBroker extends BaseManager {}

export const __collabPrivacyPreservingDataBrokerInternals = toolkit.internals;
