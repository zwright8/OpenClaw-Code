import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Rights Data Exchange',
    readyPosture: 'rights_privacy_data_broker_ready',
    defaultAgentId: 'agent:rights-privacy-broker',
    recommendationTypes: {
        primary: 'broker_rights_privacy_data',
        guard: 'mitigate_rights_data_exposure_risk',
        audit: 'audit_rights_privacy_data_signals',
        publish: 'publish_rights_privacy_data_status'
    },
    recommendationTargetMap: {
        broker_rights_privacy_data: 'agent:rights',
        mitigate_rights_data_exposure_risk: 'agent:privacy',
        audit_rights_privacy_data_signals: 'agent:trust',
        publish_rights_privacy_data_status: 'agent:ops'
    }
});

export function brokerRightsPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsPrivacyPreservingDataBroker extends BaseManager {}

export const __rightsPrivacyPreservingDataBrokerInternals = toolkit.internals;
