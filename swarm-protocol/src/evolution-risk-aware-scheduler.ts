import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'evolution_risk_aware_scheduler',
    collectionField: 'scheduleItems',
    idField: 'scheduleId',
    defaultName: 'Evolution Schedule Item',
    readyPosture: 'evolution_risk_schedule_ready',
    defaultAgentId: 'agent:evolution-scheduler',
    recommendationTypes: {
        primary: 'schedule_evolution_actions_by_risk',
        guard: 'mitigate_evolution_timing_risk',
        audit: 'audit_evolution_schedule_signals',
        publish: 'publish_evolution_schedule_status'
    },
    recommendationTargetMap: {
        schedule_evolution_actions_by_risk: 'agent:evolution',
        mitigate_evolution_timing_risk: 'agent:risk',
        audit_evolution_schedule_signals: 'agent:trust',
        publish_evolution_schedule_status: 'agent:ops'
    }
});

export function scheduleEvolutionRiskAware(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function evolutionRiskAwareSchedulerToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class EvolutionRiskAwareScheduler extends BaseManager {}

export const __evolutionRiskAwareSchedulerInternals = toolkit.internals;
