import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Comms Data Exchange',
    readyPosture: 'comms_privacy_broker_ready',
    defaultAgentId: 'agent:comms-privacy-broker',
    recommendationTypes: {
        primary: 'broker_comms_privacy_preserving_exchange',
        guard: 'mitigate_comms_data_exposure_risk',
        audit: 'audit_comms_privacy_broker_signals',
        publish: 'publish_comms_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_comms_privacy_preserving_exchange: 'agent:privacy',
        mitigate_comms_data_exposure_risk: 'agent:comms',
        audit_comms_privacy_broker_signals: 'agent:trust',
        publish_comms_privacy_broker_status: 'agent:ops'
    }
});

export function brokerCommsPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsPrivacyPreservingDataBroker extends BaseManager {}

export const __commsPrivacyPreservingDataBrokerInternals = toolkit.internals;
