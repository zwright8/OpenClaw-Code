import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Research KPI',
    readyPosture: 'research_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:research-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_research_kpi_dashboard',
        guard: 'mitigate_research_kpi_visibility_gap',
        audit: 'audit_research_kpi_dashboard_signals',
        publish: 'broadcast_research_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_research_kpi_dashboard: 'agent:analytics',
        mitigate_research_kpi_visibility_gap: 'agent:operations',
        audit_research_kpi_dashboard_signals: 'agent:trust',
        broadcast_research_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishResearchKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchKpiDashboardPublisher extends BaseManager {}

export const __researchKpiDashboardPublisherInternals = toolkit.internals;
