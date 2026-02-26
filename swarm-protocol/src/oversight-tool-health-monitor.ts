import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'oversight_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Oversight Tool',
    readyPosture: 'oversight_tool_health_stable',
    defaultAgentId: 'agent:oversight-tool-health',
    recommendationTypes: {
        primary: 'monitor_oversight_tool_health',
        guard: 'mitigate_oversight_tool_slo_risk',
        audit: 'audit_oversight_tool_health_signals',
        publish: 'publish_oversight_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_oversight_tool_health: 'agent:oversight',
        mitigate_oversight_tool_slo_risk: 'agent:reliability',
        audit_oversight_tool_health_signals: 'agent:trust',
        publish_oversight_tool_health_status: 'agent:ops'
    }
});

export function monitorOversightToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function oversightToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class OversightToolHealthMonitor extends BaseManager {}

export const __oversightToolHealthMonitorInternals = toolkit.internals;
