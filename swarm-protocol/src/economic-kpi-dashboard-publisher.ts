import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Economic KPI',
    readyPosture: 'economic_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:economic-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_economic_kpi_dashboard',
        guard: 'mitigate_economic_kpi_visibility_gap',
        audit: 'audit_economic_kpi_dashboard_signals',
        publish: 'broadcast_economic_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_economic_kpi_dashboard: 'agent:analytics',
        mitigate_economic_kpi_visibility_gap: 'agent:operations',
        audit_economic_kpi_dashboard_signals: 'agent:trust',
        broadcast_economic_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishEconomicKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicKpiDashboardPublisher extends BaseManager {}

export const __economicKpiDashboardPublisherInternals = toolkit.internals;
