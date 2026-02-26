import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Governance KPI',
    readyPosture: 'governance_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:governance-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_governance_kpi_dashboard',
        guard: 'mitigate_governance_kpi_visibility_gap',
        audit: 'audit_governance_kpi_dashboard_signals',
        publish: 'broadcast_governance_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_governance_kpi_dashboard: 'agent:analytics',
        mitigate_governance_kpi_visibility_gap: 'agent:operations',
        audit_governance_kpi_dashboard_signals: 'agent:trust',
        broadcast_governance_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishGovernanceKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceKpiDashboardPublisher extends BaseManager {}

export const __governanceKpiDashboardPublisherInternals = toolkit.internals;
