import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'economic_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Economic Tool',
    readyPosture: 'economic_tool_health_stable',
    defaultAgentId: 'agent:economic-tool-health',
    recommendationTypes: {
        primary: 'monitor_economic_tool_health',
        guard: 'mitigate_economic_tool_slo_risk',
        audit: 'audit_economic_tool_health_signals',
        publish: 'publish_economic_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_economic_tool_health: 'agent:economic',
        mitigate_economic_tool_slo_risk: 'agent:reliability',
        audit_economic_tool_health_signals: 'agent:trust',
        publish_economic_tool_health_status: 'agent:ops'
    }
});

export function monitorEconomicToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function economicToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EconomicToolHealthMonitor extends BaseManager {}

export const __economicToolHealthMonitorInternals = toolkit.internals;
