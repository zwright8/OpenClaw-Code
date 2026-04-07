import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Evolution Tool',
    readyPosture: 'evolution_tool_health_stable',
    defaultAgentId: 'agent:evolution-tool-health',
    recommendationTypes: {
        primary: 'monitor_evolution_tool_health',
        guard: 'mitigate_evolution_tool_slo_risk',
        audit: 'audit_evolution_tool_health_signals',
        publish: 'publish_evolution_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_evolution_tool_health: 'agent:evolution',
        mitigate_evolution_tool_slo_risk: 'agent:reliability',
        audit_evolution_tool_health_signals: 'agent:trust',
        publish_evolution_tool_health_status: 'agent:ops'
    }
});

export function monitorEvolutionToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionToolHealthMonitor extends BaseManager {}

export const __evolutionToolHealthMonitorInternals = toolkit.internals;
