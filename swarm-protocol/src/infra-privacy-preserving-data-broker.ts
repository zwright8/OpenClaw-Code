import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Infra Data Exchange',
    readyPosture: 'infra_privacy_data_broker_ready',
    defaultAgentId: 'agent:infra-privacy-broker',
    recommendationTypes: {
        primary: 'broker_infra_privacy_data',
        guard: 'mitigate_infra_data_exposure_risk',
        audit: 'audit_infra_privacy_data_signals',
        publish: 'publish_infra_privacy_data_status'
    },
    recommendationTargetMap: {
        broker_infra_privacy_data: 'agent:infra',
        mitigate_infra_data_exposure_risk: 'agent:privacy',
        audit_infra_privacy_data_signals: 'agent:trust',
        publish_infra_privacy_data_status: 'agent:ops'
    }
});

export function brokerInfraPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraPrivacyPreservingDataBroker extends BaseManager {}

export const __infraPrivacyPreservingDataBrokerInternals = toolkit.internals;
