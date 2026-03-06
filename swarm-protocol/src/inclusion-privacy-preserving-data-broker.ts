import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Inclusion Data Exchange',
    readyPosture: 'inclusion_privacy_broker_ready',
    defaultAgentId: 'agent:inclusion-privacy-broker',
    recommendationTypes: {
        primary: 'broker_inclusion_privacy_preserving_exchange',
        guard: 'mitigate_inclusion_data_exposure_risk',
        audit: 'audit_inclusion_privacy_broker_signals',
        publish: 'publish_inclusion_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_inclusion_privacy_preserving_exchange: 'agent:privacy',
        mitigate_inclusion_data_exposure_risk: 'agent:inclusion',
        audit_inclusion_privacy_broker_signals: 'agent:trust',
        publish_inclusion_privacy_broker_status: 'agent:ops'
    }
});

export function brokerInclusionPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionPrivacyPreservingDataBroker extends BaseManager {}

export const __inclusionPrivacyPreservingDataBrokerInternals = toolkit.internals;
