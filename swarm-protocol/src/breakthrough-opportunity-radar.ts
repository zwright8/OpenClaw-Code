import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'breakthrough_opportunity_radar',
    collectionField: 'opportunities',
    idField: 'opportunityId',
    defaultName: 'Opportunity',
    readyPosture: 'breakthrough_watch_ready',
    defaultAgentId: 'agent:breakthrough-radar',
    recommendationTypes: {
        primary: 'accelerate_breakthrough_opportunity',
        guard: 'hedge_breakthrough_execution_risk',
        audit: 'audit_opportunity_signal_quality',
        publish: 'publish_breakthrough_radar_report'
    },
    recommendationTargetMap: {
        accelerate_breakthrough_opportunity: 'agent:strategy',
        hedge_breakthrough_execution_risk: 'agent:risk',
        audit_opportunity_signal_quality: 'agent:quality',
        publish_breakthrough_radar_report: 'agent:ops'
    }
});

export function detectBreakthroughOpportunities(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function breakthroughOpportunityToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class BreakthroughOpportunityRadar extends BaseManager {}

export const __breakthroughOpportunityRadarInternals = toolkit.internals;
