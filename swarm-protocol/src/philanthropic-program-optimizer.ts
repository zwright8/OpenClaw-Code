import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'philanthropic_program_optimizer',
    collectionField: 'portfolios',
    idField: 'portfolioId',
    defaultName: 'Portfolio',
    readyPosture: 'philanthropic_portfolio_optimized',
    defaultAgentId: 'agent:philanthropic-optimizer',
    recommendationTypes: {
        primary: 'optimize_philanthropic_allocation',
        guard: 'rebalance_philanthropic_risk',
        audit: 'audit_philanthropic_outcome_data',
        publish: 'publish_philanthropic_program_brief'
    },
    recommendationTargetMap: {
        optimize_philanthropic_allocation: 'agent:philanthropy',
        rebalance_philanthropic_risk: 'agent:risk',
        audit_philanthropic_outcome_data: 'agent:data-quality',
        publish_philanthropic_program_brief: 'agent:ops'
    }
});

export function optimizePhilanthropicPrograms(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function philanthropicProgramToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class PhilanthropicProgramOptimizer extends BaseManager {}

export const __philanthropicProgramOptimizerInternals = toolkit.internals;
