import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_kpi_dashboard_publisher',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'Evolution KPI',
    readyPosture: 'evolution_kpi_dashboard_publish_ready',
    defaultAgentId: 'agent:evolution-kpi-dashboard',
    recommendationTypes: {
        primary: 'publish_evolution_kpi_dashboard',
        guard: 'mitigate_evolution_kpi_visibility_gap',
        audit: 'audit_evolution_kpi_dashboard_signals',
        publish: 'broadcast_evolution_kpi_dashboard_status'
    },
    recommendationTargetMap: {
        publish_evolution_kpi_dashboard: 'agent:analytics',
        mitigate_evolution_kpi_visibility_gap: 'agent:operations',
        audit_evolution_kpi_dashboard_signals: 'agent:trust',
        broadcast_evolution_kpi_dashboard_status: 'agent:ops'
    }
});

export function publishEvolutionKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionKpiDashboardPublisherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionKpiDashboardPublisher extends BaseManager {}

export const __evolutionKpiDashboardPublisherInternals = toolkit.internals;
