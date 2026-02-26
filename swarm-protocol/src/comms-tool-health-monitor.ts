import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'comms_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Comms Tool',
    readyPosture: 'comms_tool_health_stable',
    defaultAgentId: 'agent:comms-tool-health',
    recommendationTypes: {
        primary: 'monitor_comms_tool_health',
        guard: 'mitigate_comms_tool_slo_risk',
        audit: 'audit_comms_tool_health_signals',
        publish: 'publish_comms_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_comms_tool_health: 'agent:comms',
        mitigate_comms_tool_slo_risk: 'agent:reliability',
        audit_comms_tool_health_signals: 'agent:trust',
        publish_comms_tool_health_status: 'agent:ops'
    }
});

export function monitorCommsToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function commsToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class CommsToolHealthMonitor extends BaseManager {}

export const __commsToolHealthMonitorInternals = toolkit.internals;
