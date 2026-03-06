import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'strategic_scenario_war_gamer',
    collectionField: 'scenarios',
    idField: 'scenarioId',
    defaultName: 'Scenario',
    readyPosture: 'scenario_branch_ready',
    defaultAgentId: 'agent:scenario-war-gamer',
    recommendationTypes: {
        primary: 'simulate_strategic_scenario_branch',
        guard: 'mitigate_scenario_exposure',
        audit: 'audit_scenario_assumption_quality',
        publish: 'publish_scenario_wargame_brief'
    },
    recommendationTargetMap: {
        simulate_strategic_scenario_branch: 'agent:strategy',
        mitigate_scenario_exposure: 'agent:risk',
        audit_scenario_assumption_quality: 'agent:quality',
        publish_scenario_wargame_brief: 'agent:ops'
    }
});

export function wargameStrategicScenarios(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function strategicScenarioToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class StrategicScenarioWarGamer extends BaseManager {}

export const __strategicScenarioWarGamerInternals = toolkit.internals;
