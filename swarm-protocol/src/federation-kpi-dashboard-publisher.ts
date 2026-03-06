import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Federation KPI',
    readyPosture: 'federation_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:federation-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_federation_kpi_dashboard',
        guard: 'mitigate_federation_kpi_visibility_gap',
        audit: 'audit_federation_kpi_dashboard_signals',
        publish: 'broadcast_federation_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_federation_kpi_dashboard: 'agent:analytics',
        mitigate_federation_kpi_visibility_gap: 'agent:operations',
        audit_federation_kpi_dashboard_signals: 'agent:trust',
        broadcast_federation_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishFederationKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationKpiDashboardPublisher extends BaseManager {}

export const __federationKpiDashboardPublisherInternals = toolkit.internals;
