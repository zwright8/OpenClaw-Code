import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Security Data Exchange',
    readyPosture: 'security_privacy_broker_ready',
    defaultAgentId: 'agent:security-privacy-broker',
    recommendationTypes: {
        primary: 'broker_security_privacy_preserving_exchange',
        guard: 'mitigate_security_data_exposure_risk',
        audit: 'audit_security_privacy_broker_signals',
        publish: 'publish_security_privacy_broker_status'
    },
    recommendationTargetMap: {
        broker_security_privacy_preserving_exchange: 'agent:privacy',
        mitigate_security_data_exposure_risk: 'agent:security',
        audit_security_privacy_broker_signals: 'agent:trust',
        publish_security_privacy_broker_status: 'agent:ops'
    }
});

export function brokerSecurityPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityPrivacyPreservingDataBroker extends BaseManager {}

export const __securityPrivacyPreservingDataBrokerInternals = toolkit.internals;
