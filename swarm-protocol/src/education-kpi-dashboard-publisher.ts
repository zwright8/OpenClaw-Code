import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Education KPI',
    readyPosture: 'education_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:education-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_education_kpi_dashboard',
        guard: 'mitigate_education_kpi_visibility_gap',
        audit: 'audit_education_kpi_dashboard_signals',
        publish: 'broadcast_education_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_education_kpi_dashboard: 'agent:analytics',
        mitigate_education_kpi_visibility_gap: 'agent:operations',
        audit_education_kpi_dashboard_signals: 'agent:trust',
        broadcast_education_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishEducationKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationKpiDashboardPublisher extends BaseManager {}

export const __educationKpiDashboardPublisherInternals = toolkit.internals;
