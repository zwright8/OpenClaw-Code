import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'crisis_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Crisis KPI',
    readyPosture: 'crisis_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:crisis-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_crisis_kpi_dashboard',
        guard: 'mitigate_crisis_kpi_visibility_gap',
        audit: 'audit_crisis_kpi_dashboard_signals',
        publish: 'broadcast_crisis_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_crisis_kpi_dashboard: 'agent:analytics',
        mitigate_crisis_kpi_visibility_gap: 'agent:operations',
        audit_crisis_kpi_dashboard_signals: 'agent:trust',
        broadcast_crisis_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishCrisisKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function crisisKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CrisisKpiDashboardPublisher extends BaseManager {}

export const __crisisKpiDashboardPublisherInternals = toolkit.internals;
