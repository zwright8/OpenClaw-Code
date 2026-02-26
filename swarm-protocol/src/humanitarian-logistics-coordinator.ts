import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'humanitarian_logistics_coordinator',
    collectionField: 'corridors',
    idField: 'corridorId',
    defaultName: 'Corridor',
    readyPosture: 'humanitarian_logistics_balanced',
    defaultAgentId: 'agent:humanitarian-logistics',
    recommendationTypes: {
        primary: 'optimize_humanitarian_route',
        guard: 'unblock_humanitarian_bottleneck',
        audit: 'audit_logistics_situational_data',
        publish: 'publish_humanitarian_logistics_update'
    },
    recommendationTargetMap: {
        optimize_humanitarian_route: 'agent:logistics',
        unblock_humanitarian_bottleneck: 'agent:operations',
        audit_logistics_situational_data: 'agent:data-quality',
        publish_humanitarian_logistics_update: 'agent:ops'
    }
});

export function coordinateHumanitarianLogistics(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function humanitarianLogisticsToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class HumanitarianLogisticsCoordinator extends BaseManager {}

export const __humanitarianLogisticsCoordinatorInternals = toolkit.internals;
