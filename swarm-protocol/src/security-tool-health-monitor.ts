import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'security_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Security Tool',
    readyPosture: 'security_tool_health_stable',
    defaultAgentId: 'agent:security-tool-health',
    recommendationTypes: {
        primary: 'monitor_security_tool_health',
        guard: 'mitigate_security_tool_slo_risk',
        audit: 'audit_security_tool_health_signals',
        publish: 'publish_security_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_security_tool_health: 'agent:security',
        mitigate_security_tool_slo_risk: 'agent:reliability',
        audit_security_tool_health_signals: 'agent:trust',
        publish_security_tool_health_status: 'agent:ops'
    }
});

export function monitorSecurityToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function securityToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SecurityToolHealthMonitor extends BaseManager {}

export const __securityToolHealthMonitorInternals = toolkit.internals;
