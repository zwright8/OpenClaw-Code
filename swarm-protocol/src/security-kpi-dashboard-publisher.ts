import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Security KPI',
    readyPosture: 'security_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:security-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_security_kpi_dashboard',
        guard: 'mitigate_security_kpi_visibility_gap',
        audit: 'audit_security_kpi_dashboard_signals',
        publish: 'broadcast_security_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_security_kpi_dashboard: 'agent:analytics',
        mitigate_security_kpi_visibility_gap: 'agent:operations',
        audit_security_kpi_dashboard_signals: 'agent:trust',
        broadcast_security_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishSecurityKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityKpiDashboardPublisher extends BaseManager {}

export const __securityKpiDashboardPublisherInternals = toolkit.internals;
