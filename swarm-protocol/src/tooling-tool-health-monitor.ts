import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'tooling_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Tool',
    readyPosture: 'tool_health_stable',
    defaultAgentId: 'agent:tooling-health-monitor',
    recommendationTypes: {
        primary: 'stabilize_unhealthy_tool',
        guard: 'mitigate_tool_slo_risk',
        audit: 'audit_tool_health_signals',
        publish: 'publish_tool_health_status'
    },
    recommendationTargetMap: {
        stabilize_unhealthy_tool: 'agent:sre',
        mitigate_tool_slo_risk: 'agent:reliability',
        audit_tool_health_signals: 'agent:trust',
        publish_tool_health_status: 'agent:ops'
    }
});

export function monitorToolingToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function toolingToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ToolingToolHealthMonitor extends BaseManager {}

export const __toolingToolHealthMonitorInternals = toolkit.internals;
