import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Observability KPI',
    readyPosture: 'observability_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:observability-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_observability_kpi_dashboard',
        guard: 'mitigate_observability_kpi_visibility_gap',
        audit: 'audit_observability_kpi_dashboard_signals',
        publish: 'broadcast_observability_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_observability_kpi_dashboard: 'agent:analytics',
        mitigate_observability_kpi_visibility_gap: 'agent:operations',
        audit_observability_kpi_dashboard_signals: 'agent:trust',
        broadcast_observability_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishObservabilityKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityKpiDashboardPublisher extends BaseManager {}

export const __observabilityKpiDashboardPublisherInternals = toolkit.internals;
