import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Engineering Data Exchange',
    readyPosture: 'engineering_privacy_broker_ready',
    defaultAgentId: 'agent:engineering-privacy-broker',
    recommendationTypes: {
        primary: 'broker_engineering_privacy_preserving_exchange',
        guard: 'mitigate_engineering_data_exposure_risk',
        audit: 'audit_engineering_privacy_broker_signals',
        publish: 'publish_engineering_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_engineering_privacy_preserving_exchange: 'agent:privacy',
        mitigate_engineering_data_exposure_risk: 'agent:security',
        audit_engineering_privacy_broker_signals: 'agent:trust',
        publish_engineering_privacy_broker_status: 'agent:ops'
    }
});

export function brokerEngineeringPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringPrivacyPreservingDataBroker extends BaseManager {}

export const __engineeringPrivacyPreservingDataBrokerInternals = toolkit.internals;
