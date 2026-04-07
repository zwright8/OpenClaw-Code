import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Rights KPI',
    readyPosture: 'rights_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:rights-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_rights_kpi_dashboard',
        guard: 'mitigate_rights_kpi_visibility_gap',
        audit: 'audit_rights_kpi_dashboard_signals',
        publish: 'broadcast_rights_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_rights_kpi_dashboard: 'agent:analytics',
        mitigate_rights_kpi_visibility_gap: 'agent:operations',
        audit_rights_kpi_dashboard_signals: 'agent:trust',
        broadcast_rights_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishRightsKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsKpiDashboardPublisher extends BaseManager {}

export const __rightsKpiDashboardPublisherInternals = toolkit.internals;
