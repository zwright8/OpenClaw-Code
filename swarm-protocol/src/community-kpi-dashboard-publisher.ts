import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'community_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Community KPI',
    readyPosture: 'community_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:community-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_community_kpi_dashboard',
        guard: 'mitigate_community_kpi_visibility_gap',
        audit: 'audit_community_kpi_dashboard_signals',
        publish: 'broadcast_community_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_community_kpi_dashboard: 'agent:analytics',
        mitigate_community_kpi_visibility_gap: 'agent:operations',
        audit_community_kpi_dashboard_signals: 'agent:trust',
        broadcast_community_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishCommunityKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function communityKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommunityKpiDashboardPublisher extends BaseManager {}

export const __communityKpiDashboardPublisherInternals = toolkit.internals;
