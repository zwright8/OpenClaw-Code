import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_privacy_preserving_data_broker',
    collectionField: 'dataExchanges',
    idField: 'exchangeId',
    defaultName: 'Evolution Data Exchange',
    readyPosture: 'evolution_privacy_data_broker_ready',
    defaultAgentId: 'agent:evolution-privacy-broker',
    recommendationTypes: {
        primary: 'broker_evolution_privacy_data',
        guard: 'mitigate_evolution_data_exposure_risk',
        audit: 'audit_evolution_privacy_data_signals',
        publish: 'publish_evolution_privacy_data_status'
    },
    recommendationTargetMap: {
        broker_evolution_privacy_data: 'agent:evolution',
        mitigate_evolution_data_exposure_risk: 'agent:privacy',
        audit_evolution_privacy_data_signals: 'agent:trust',
        publish_evolution_privacy_data_status: 'agent:ops'
    }
});

export function brokerEvolutionPrivacyData(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionPrivacyPreservingDataBrokerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionPrivacyPreservingDataBroker extends BaseManager {}

export const __evolutionPrivacyPreservingDataBrokerInternals = toolkit.internals;
