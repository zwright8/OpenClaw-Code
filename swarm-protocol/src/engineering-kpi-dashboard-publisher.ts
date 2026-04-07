import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Engineering KPI',
    readyPosture: 'engineering_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:engineering-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_engineering_kpi_dashboard',
        guard: 'mitigate_engineering_kpi_visibility_gap',
        audit: 'audit_engineering_kpi_dashboard_signals',
        publish: 'broadcast_engineering_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_engineering_kpi_dashboard: 'agent:analytics',
        mitigate_engineering_kpi_visibility_gap: 'agent:operations',
        audit_engineering_kpi_dashboard_signals: 'agent:trust',
        broadcast_engineering_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishEngineeringKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringKpiDashboardPublisher extends BaseManager {}

export const __engineeringKpiDashboardPublisherInternals = toolkit.internals;
