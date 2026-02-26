import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'education_tool_health_monitor',
    collectionField: 'tools',
    idField: 'toolId',
    defaultName: 'Education Tool',
    readyPosture: 'education_tool_health_stable',
    defaultAgentId: 'agent:education-tool-health',
    recommendationTypes: {
        primary: 'monitor_education_tool_health',
        guard: 'mitigate_education_tool_slo_risk',
        audit: 'audit_education_tool_health_signals',
        publish: 'publish_education_tool_health_status'
    },
    recommendationTargetMap: {
        monitor_education_tool_health: 'agent:education',
        mitigate_education_tool_slo_risk: 'agent:reliability',
        audit_education_tool_health_signals: 'agent:trust',
        publish_education_tool_health_status: 'agent:ops'
    }
});

export function monitorEducationToolHealth(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function educationToolHealthMonitorToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EducationToolHealthMonitor extends BaseManager {}

export const __educationToolHealthMonitorInternals = toolkit.internals;
