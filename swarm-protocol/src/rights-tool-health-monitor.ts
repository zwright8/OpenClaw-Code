import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'rights_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Rights Tool',
    readyPosture: 'rights_tool_health_stable',
    defaultAgentId: 'agent:rights-tool-health',
    recommendationTypes: {
        primary: 'monitor_rights_tool_health',
        guard: 'mitigate_rights_tool_slo_risk',
        audit: 'audit_rights_tool_health_signals',
        publish: 'publish_rights_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_rights_tool_health: 'agent:rights',
        mitigate_rights_tool_slo_risk: 'agent:reliability',
        audit_rights_tool_health_signals: 'agent:trust',
        publish_rights_tool_health_status: 'agent:ops'
    }
});

export function monitorRightsToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function rightsToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class RightsToolHealthMonitor extends BaseManager {}

export const __rightsToolHealthMonitorInternals = toolkit.internals;
