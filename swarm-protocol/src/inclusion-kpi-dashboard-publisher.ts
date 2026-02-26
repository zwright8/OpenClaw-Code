import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Inclusion KPI',
    readyPosture: 'inclusion_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:inclusion-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_inclusion_kpi_dashboard',
        guard: 'mitigate_inclusion_kpi_visibility_gap',
        audit: 'audit_inclusion_kpi_dashboard_signals',
        publish: 'broadcast_inclusion_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_inclusion_kpi_dashboard: 'agent:analytics',
        mitigate_inclusion_kpi_visibility_gap: 'agent:operations',
        audit_inclusion_kpi_dashboard_signals: 'agent:trust',
        broadcast_inclusion_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishInclusionKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionKpiDashboardPublisher extends BaseManager {}

export const __inclusionKpiDashboardPublisherInternals = toolkit.internals;
