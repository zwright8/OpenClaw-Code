import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Comms KPI',
    readyPosture: 'comms_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:comms-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_comms_kpi_dashboard',
        guard: 'mitigate_comms_kpi_visibility_gap',
        audit: 'audit_comms_kpi_dashboard_signals',
        publish: 'broadcast_comms_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_comms_kpi_dashboard: 'agent:analytics',
        mitigate_comms_kpi_visibility_gap: 'agent:operations',
        audit_comms_kpi_dashboard_signals: 'agent:trust',
        broadcast_comms_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishCommsKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsKpiDashboardPublisher extends BaseManager {}

export const __commsKpiDashboardPublisherInternals = toolkit.internals;
