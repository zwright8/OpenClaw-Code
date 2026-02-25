import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'hypothesis_prioritization_exchange',
    collectionField: 'hypotheses',
    idField: 'hypothesisId',
    defaultName: 'Hypothesis',
    readyPosture: 'hypothesis_flow_healthy',
    defaultAgentId: 'agent:hypothesis-exchange',
    recommendationTypes: {
        primary: 'route_high_value_hypothesis',
        guard: 'rebalance_hypothesis_backlog',
        audit: 'audit_hypothesis_scoring_quality',
        publish: 'publish_hypothesis_prioritization_board'
    },
    recommendationTargetMap: {
        route_high_value_hypothesis: 'agent:research',
        rebalance_hypothesis_backlog: 'agent:planning',
        audit_hypothesis_scoring_quality: 'agent:quality',
        publish_hypothesis_prioritization_board: 'agent:ops'
    }
});

export function prioritizeHypotheses(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function hypothesisPrioritizationToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class HypothesisPrioritizationExchange extends BaseManager {}

export const __hypothesisPrioritizationExchangeInternals = toolkit.internals;
