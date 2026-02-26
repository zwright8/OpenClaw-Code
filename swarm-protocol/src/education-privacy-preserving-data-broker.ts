import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Education Data Exchange',
    readyPosture: 'education_privacy_broker_ready',
    defaultAgentId: 'agent:education-privacy-broker',
    recommendationTypes: {
        primary: 'broker_education_privacy_preserving_exchange',
        guard: 'mitigate_education_data_exposure_risk',
        audit: 'audit_education_privacy_broker_signals',
        publish: 'publish_education_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_education_privacy_preserving_exchange: 'agent:privacy',
        mitigate_education_data_exposure_risk: 'agent:security',
        audit_education_privacy_broker_signals: 'agent:trust',
        publish_education_privacy_broker_status: 'agent:ops'
    }
});

export function brokerEducationPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationPrivacyPreservingDataBroker extends BaseManager {}

export const __educationPrivacyPreservingDataBrokerInternals = toolkit.internals;
