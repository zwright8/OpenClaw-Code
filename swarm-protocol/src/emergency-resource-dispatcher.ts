import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'emergency_resource_dispatcher',
    collectionField: 'incidents',
    idField: 'incidentId',
    defaultName: 'Incident',
    readyPosture: 'emergency_dispatch_ready',
    defaultAgentId: 'agent:emergency-dispatcher',
    recommendationTypes: {
        primary: 'dispatch_emergency_resource',
        guard: 'escalate_resource_shortfall',
        audit: 'audit_dispatch_readiness',
        publish: 'publish_emergency_dispatch_status'
    },
    recommendationTargetMap: {
        dispatch_emergency_resource: 'agent:dispatch',
        escalate_resource_shortfall: 'agent:operations',
        audit_dispatch_readiness: 'agent:quality',
        publish_emergency_dispatch_status: 'agent:ops'
    }
});

export function dispatchEmergencyResources(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function emergencyResourceDispatcherToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EmergencyResourceDispatcher extends BaseManager {}

export const __emergencyResourceDispatcherInternals = toolkit.internals;
