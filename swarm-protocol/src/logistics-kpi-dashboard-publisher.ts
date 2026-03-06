import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'logistics_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Logistics KPI',
    readyPosture: 'logistics_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:logistics-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_logistics_kpi_dashboard',
        guard: 'mitigate_logistics_kpi_visibility_gap',
        audit: 'audit_logistics_kpi_dashboard_signals',
        publish: 'broadcast_logistics_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_logistics_kpi_dashboard: 'agent:analytics',
        mitigate_logistics_kpi_visibility_gap: 'agent:operations',
        audit_logistics_kpi_dashboard_signals: 'agent:trust',
        broadcast_logistics_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishLogisticsKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function logisticsKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class LogisticsKpiDashboardPublisher extends BaseManager {}

export const __logisticsKpiDashboardPublisherInternals = toolkit.internals;
