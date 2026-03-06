import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Community Data Exchange',
    readyPosture: 'community_privacy_broker_ready',
    defaultAgentId: 'agent:community-privacy-broker',
    recommendationTypes: {
        primary: 'broker_community_privacy_preserving_exchange',
        guard: 'mitigate_community_data_exposure_risk',
        audit: 'audit_community_privacy_broker_signals',
        publish: 'publish_community_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_community_privacy_preserving_exchange: 'agent:privacy',
        mitigate_community_data_exposure_risk: 'agent:community',
        audit_community_privacy_broker_signals: 'agent:trust',
        publish_community_privacy_broker_status: 'agent:ops'
    }
});

export function brokerCommunityPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityPrivacyPreservingDataBroker extends BaseManager {}

export const __communityPrivacyPreservingDataBrokerInternals = toolkit.internals;
