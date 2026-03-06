import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'publicservice_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'PublicService KPI',
    readyPosture: 'publicservice_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:publicservice-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_publicservice_kpi_dashboard',
        guard: 'mitigate_publicservice_kpi_visibility_gap',
        audit: 'audit_publicservice_kpi_dashboard_signals',
        publish: 'broadcast_publicservice_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_publicservice_kpi_dashboard: 'agent:analytics',
        mitigate_publicservice_kpi_visibility_gap: 'agent:operations',
        audit_publicservice_kpi_dashboard_signals: 'agent:trust',
        broadcast_publicservice_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishPublicServiceKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function publicServiceKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PublicServiceKpiDashboardPublisher extends BaseManager {}

export const __publicServiceKpiDashboardPublisherInternals = toolkit.internals;
