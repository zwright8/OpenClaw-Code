import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'observability_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Observability Tool',
    readyPosture: 'observability_tool_health_stable',
    defaultAgentId: 'agent:observability-tool-health',
    recommendationTypes: {
        primary: 'monitor_observability_tool_health',
        guard: 'mitigate_observability_tool_slo_risk',
        audit: 'audit_observability_tool_health_signals',
        publish: 'publish_observability_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_observability_tool_health: 'agent:observability',
        mitigate_observability_tool_slo_risk: 'agent:reliability',
        audit_observability_tool_health_signals: 'agent:trust',
        publish_observability_tool_health_status: 'agent:ops'
    }
});

export function monitorObservabilityToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function observabilityToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ObservabilityToolHealthMonitor extends BaseManager {}

export const __observabilityToolHealthMonitorInternals = toolkit.internals;
