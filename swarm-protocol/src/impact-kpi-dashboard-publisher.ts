import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Impact KPI',
    readyPosture: 'impact_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:impact-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_impact_kpi_dashboard',
        guard: 'mitigate_impact_kpi_visibility_gap',
        audit: 'audit_impact_kpi_dashboard_signals',
        publish: 'broadcast_impact_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_impact_kpi_dashboard: 'agent:analytics',
        mitigate_impact_kpi_visibility_gap: 'agent:operations',
        audit_impact_kpi_dashboard_signals: 'agent:trust',
        broadcast_impact_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishImpactKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactKpiDashboardPublisher extends BaseManager {}

export const __impactKpiDashboardPublisherInternals = toolkit.internals;
