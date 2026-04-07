import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Infra KPI',
    readyPosture: 'infra_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:infra-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_infra_kpi_dashboard',
        guard: 'mitigate_infra_kpi_visibility_gap',
        audit: 'audit_infra_kpi_dashboard_signals',
        publish: 'broadcast_infra_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_infra_kpi_dashboard: 'agent:analytics',
        mitigate_infra_kpi_visibility_gap: 'agent:operations',
        audit_infra_kpi_dashboard_signals: 'agent:trust',
        broadcast_infra_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishInfraKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraKpiDashboardPublisher extends BaseManager {}

export const __infraKpiDashboardPublisherInternals = toolkit.internals;
