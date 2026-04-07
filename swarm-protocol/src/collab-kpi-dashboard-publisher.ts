import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'collab_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Collab KPI',
    readyPosture: 'collab_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:collab-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_collab_kpi_dashboard',
        guard: 'mitigate_collab_kpi_visibility_gap',
        audit: 'audit_collab_kpi_dashboard_signals',
        publish: 'broadcast_collab_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_collab_kpi_dashboard: 'agent:analytics',
        mitigate_collab_kpi_visibility_gap: 'agent:operations',
        audit_collab_kpi_dashboard_signals: 'agent:trust',
        broadcast_collab_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishCollabKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function collabKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CollabKpiDashboardPublisher extends BaseManager {}

export const __collabKpiDashboardPublisherInternals = toolkit.internals;
