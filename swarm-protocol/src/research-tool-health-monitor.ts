import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'research_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Research Tool',
    readyPosture: 'research_tool_health_stable',
    defaultAgentId: 'agent:research-tool-health',
    recommendationTypes: {
        primary: 'monitor_research_tool_health',
        guard: 'mitigate_research_tool_slo_risk',
        audit: 'audit_research_tool_health_signals',
        publish: 'publish_research_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_research_tool_health: 'agent:research',
        mitigate_research_tool_slo_risk: 'agent:reliability',
        audit_research_tool_health_signals: 'agent:trust',
        publish_research_tool_health_status: 'agent:ops'
    }
});

export function monitorResearchToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function researchToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class ResearchToolHealthMonitor extends BaseManager {}

export const __researchToolHealthMonitorInternals = toolkit.internals;
