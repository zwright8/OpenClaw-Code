import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'engineering_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Engineering Tool',
    readyPosture: 'engineering_tool_health_stable',
    defaultAgentId: 'agent:engineering-tool-health',
    recommendationTypes: {
        primary: 'monitor_engineering_tool_health',
        guard: 'mitigate_engineering_tool_slo_risk',
        audit: 'audit_engineering_tool_health_signals',
        publish: 'publish_engineering_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_engineering_tool_health: 'agent:engineering',
        mitigate_engineering_tool_slo_risk: 'agent:reliability',
        audit_engineering_tool_health_signals: 'agent:trust',
        publish_engineering_tool_health_status: 'agent:ops'
    }
});

export function monitorEngineeringToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function engineeringToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EngineeringToolHealthMonitor extends BaseManager {}

export const __engineeringToolHealthMonitorInternals = toolkit.internals;
