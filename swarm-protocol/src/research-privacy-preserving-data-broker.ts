import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Research Data Exchange',
    readyPosture: 'research_privacy_broker_ready',
    defaultAgentId: 'agent:research-privacy-broker',
    recommendationTypes: {
        primary: 'broker_research_privacy_preserving_exchange',
        guard: 'mitigate_research_data_exposure_risk',
        audit: 'audit_research_privacy_broker_signals',
        publish: 'publish_research_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_research_privacy_preserving_exchange: 'agent:privacy',
        mitigate_research_data_exposure_risk: 'agent:security',
        audit_research_privacy_broker_signals: 'agent:trust',
        publish_research_privacy_broker_status: 'agent:ops'
    }
});

export function brokerResearchPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchPrivacyPreservingDataBroker extends BaseManager {}

export const __researchPrivacyPreservingDataBrokerInternals = toolkit.internals;
