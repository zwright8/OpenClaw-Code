import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'inclusion_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Inclusion Tool',
    readyPosture: 'inclusion_tool_health_stable',
    defaultAgentId: 'agent:inclusion-tool-health',
    recommendationTypes: {
        primary: 'monitor_inclusion_tool_health',
        guard: 'mitigate_inclusion_tool_slo_risk',
        audit: 'audit_inclusion_tool_health_signals',
        publish: 'publish_inclusion_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_inclusion_tool_health: 'agent:inclusion',
        mitigate_inclusion_tool_slo_risk: 'agent:reliability',
        audit_inclusion_tool_health_signals: 'agent:trust',
        publish_inclusion_tool_health_status: 'agent:ops'
    }
});

export function monitorInclusionToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function inclusionToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class InclusionToolHealthMonitor extends BaseManager {}

export const __inclusionToolHealthMonitorInternals = toolkit.internals;
