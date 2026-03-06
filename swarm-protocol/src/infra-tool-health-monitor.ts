import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'infra_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Infra Tool',
    readyPosture: 'infra_tool_health_stable',
    defaultAgentId: 'agent:infra-tool-health',
    recommendationTypes: {
        primary: 'monitor_infra_tool_health',
        guard: 'mitigate_infra_tool_slo_risk',
        audit: 'audit_infra_tool_health_signals',
        publish: 'publish_infra_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_infra_tool_health: 'agent:infra',
        mitigate_infra_tool_slo_risk: 'agent:reliability',
        audit_infra_tool_health_signals: 'agent:trust',
        publish_infra_tool_health_status: 'agent:ops'
    }
});

export function monitorInfraToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function infraToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InfraToolHealthMonitor extends BaseManager {}

export const __infraToolHealthMonitorInternals = toolkit.internals;
