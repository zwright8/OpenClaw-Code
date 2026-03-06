import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'impact_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Impact Tool',
    readyPosture: 'impact_tool_health_stable',
    defaultAgentId: 'agent:impact-tool-health',
    recommendationTypes: {
        primary: 'monitor_impact_tool_health',
        guard: 'mitigate_impact_tool_slo_risk',
        audit: 'audit_impact_tool_health_signals',
        publish: 'publish_impact_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_impact_tool_health: 'agent:impact',
        mitigate_impact_tool_slo_risk: 'agent:reliability',
        audit_impact_tool_health_signals: 'agent:trust',
        publish_impact_tool_health_status: 'agent:ops'
    }
});

export function monitorImpactToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function impactToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ImpactToolHealthMonitor extends BaseManager {}

export const __impactToolHealthMonitorInternals = toolkit.internals;
