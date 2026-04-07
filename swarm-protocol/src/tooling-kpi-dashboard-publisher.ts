import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'KPI',
    readyPosture: 'kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:tooling-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_tooling_kpi_dashboard',
        guard: 'mitigate_kpi_visibility_gap',
        audit: 'audit_kpi_dashboard_signals',
        publish: 'broadcast_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_tooling_kpi_dashboard: 'agent:analytics',
        mitigate_kpi_visibility_gap: 'agent:operations',
        audit_kpi_dashboard_signals: 'agent:trust',
        broadcast_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishToolingKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingKpiDashboardPublisher extends BaseManager {}

export const __toolingKpiDashboardPublisherInternals = toolkit.internals;
