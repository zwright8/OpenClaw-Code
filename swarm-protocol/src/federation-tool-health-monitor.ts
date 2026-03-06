import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'federation_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Federation Tool',
    readyPosture: 'federation_tool_health_stable',
    defaultAgentId: 'agent:federation-tool-health',
    recommendationTypes: {
        primary: 'monitor_federation_tool_health',
        guard: 'mitigate_federation_tool_slo_risk',
        audit: 'audit_federation_tool_health_signals',
        publish: 'publish_federation_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_federation_tool_health: 'agent:federation',
        mitigate_federation_tool_slo_risk: 'agent:reliability',
        audit_federation_tool_health_signals: 'agent:trust',
        publish_federation_tool_health_status: 'agent:ops'
    }
});

export function monitorFederationToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function federationToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class FederationToolHealthMonitor extends BaseManager {}

export const __federationToolHealthMonitorInternals = toolkit.internals;
