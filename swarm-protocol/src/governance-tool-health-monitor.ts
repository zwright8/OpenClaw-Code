import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'governance_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Governance Tool',
    readyPosture: 'governance_tool_health_stable',
    defaultAgentId: 'agent:governance-tool-health',
    recommendationTypes: {
        primary: 'monitor_governance_tool_health',
        guard: 'mitigate_governance_tool_slo_risk',
        audit: 'audit_governance_tool_health_signals',
        publish: 'publish_governance_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_governance_tool_health: 'agent:governance',
        mitigate_governance_tool_slo_risk: 'agent:reliability',
        audit_governance_tool_health_signals: 'agent:trust',
        publish_governance_tool_health_status: 'agent:ops'
    }
});

export function monitorGovernanceToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function governanceToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class GovernanceToolHealthMonitor extends BaseManager {}

export const __governanceToolHealthMonitorInternals = toolkit.internals;
