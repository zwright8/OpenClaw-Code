import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'cultural_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Cultural KPI',
    readyPosture: 'cultural_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:cultural-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_cultural_kpi_dashboard',
        guard: 'mitigate_cultural_kpi_visibility_gap',
        audit: 'audit_cultural_kpi_dashboard_signals',
        publish: 'broadcast_cultural_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_cultural_kpi_dashboard: 'agent:analytics',
        mitigate_cultural_kpi_visibility_gap: 'agent:operations',
        audit_cultural_kpi_dashboard_signals: 'agent:trust',
        broadcast_cultural_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishCulturalKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function culturalKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CulturalKpiDashboardPublisher extends BaseManager {}

export const __culturalKpiDashboardPublisherInternals = toolkit.internals;
