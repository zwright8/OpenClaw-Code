import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'social_benefit_kpi_dashboard',
    collectionField: 'kpis',
    idField: 'kpiId',
    defaultName: 'KPI',
    readyPosture: 'social_kpi_dashboard_ready',
    defaultAgentId: 'agent:social-kpi-dashboard',
    recommendationTypes: {
        primary: 'refresh_social_benefit_kpi',
        guard: 'remediate_kpi_coverage_gap',
        audit: 'audit_kpi_data_pipeline',
        publish: 'publish_social_kpi_dashboard'
    },
    recommendationTargetMap: {
        refresh_social_benefit_kpi: 'agent:analytics',
        remediate_kpi_coverage_gap: 'agent:programs',
        audit_kpi_data_pipeline: 'agent:data-quality',
        publish_social_kpi_dashboard: 'agent:ops'
    }
});

export function buildSocialBenefitKpiDashboard(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function socialBenefitKpiDashboardToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SocialBenefitKpiDashboard extends BaseManager {}

export const __socialBenefitKpiDashboardInternals = toolkit.internals;
