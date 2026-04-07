import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Impact Data Exchange',
    readyPosture: 'impact_privacy_broker_ready',
    defaultAgentId: 'agent:impact-privacy-broker',
    recommendationTypes: {
        primary: 'broker_impact_privacy_preserving_exchange',
        guard: 'mitigate_impact_data_exposure_risk',
        audit: 'audit_impact_privacy_broker_signals',
        publish: 'publish_impact_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_impact_privacy_preserving_exchange: 'agent:privacy',
        mitigate_impact_data_exposure_risk: 'agent:impact',
        audit_impact_privacy_broker_signals: 'agent:trust',
        publish_impact_privacy_broker_status: 'agent:ops'
    }
});

export function brokerImpactPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactPrivacyPreservingDataBroker extends BaseManager {}

export const __impactPrivacyPreservingDataBrokerInternals = toolkit.internals;
