import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Data Exchange',
    readyPosture: 'privacy_broker_ready',
    defaultAgentId: 'agent:tooling-privacy-broker',
    recommendationTypes: {
        primary: 'broker_privacy_preserving_exchange',
        guard: 'mitigate_data_exposure_risk',
        audit: 'audit_privacy_broker_signals',
        publish: 'publish_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_privacy_preserving_exchange: 'agent:privacy',
        mitigate_data_exposure_risk: 'agent:security',
        audit_privacy_broker_signals: 'agent:trust',
        publish_privacy_broker_status: 'agent:ops'
    }
});

export function brokerToolingPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingPrivacyPreservingDataBroker extends BaseManager {}

export const __toolingPrivacyPreservingDataBrokerInternals = toolkit.internals;
