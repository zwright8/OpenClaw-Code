import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Oversight KPI',
    readyPosture: 'oversight_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:oversight-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_oversight_kpi_dashboard',
        guard: 'mitigate_oversight_kpi_visibility_gap',
        audit: 'audit_oversight_kpi_dashboard_signals',
        publish: 'broadcast_oversight_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_oversight_kpi_dashboard: 'agent:analytics',
        mitigate_oversight_kpi_visibility_gap: 'agent:operations',
        audit_oversight_kpi_dashboard_signals: 'agent:trust',
        broadcast_oversight_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishOversightKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightKpiDashboardPublisher extends BaseManager {}

export const __oversightKpiDashboardPublisherInternals = toolkit.internals;
