import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Oversight Data Exchange',
    readyPosture: 'oversight_privacy_broker_ready',
    defaultAgentId: 'agent:oversight-privacy-broker',
    recommendationTypes: {
        primary: 'broker_oversight_privacy_preserving_exchange',
        guard: 'mitigate_oversight_data_exposure_risk',
        audit: 'audit_oversight_privacy_broker_signals',
        publish: 'publish_oversight_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_oversight_privacy_preserving_exchange: 'agent:privacy',
        mitigate_oversight_data_exposure_risk: 'agent:security',
        audit_oversight_privacy_broker_signals: 'agent:trust',
        publish_oversight_privacy_broker_status: 'agent:ops'
    }
});

export function brokerOversightPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightPrivacyPreservingDataBroker extends BaseManager {}

export const __oversightPrivacyPreservingDataBrokerInternals = toolkit.internals;
