import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'humanity_mission_operating_system',
    collectionField: 'missions',
    idField: 'missionId',
    defaultName: 'Mission',
    readyPosture: 'humanity_mission_operational',
    defaultAgentId: 'agent:humanity-mission-os',
    recommendationTypes: {
        primary: 'orchestrate_humanity_mission_lane',
        guard: 'mitigate_mission_systemic_risk',
        audit: 'audit_mission_operating_signals',
        publish: 'publish_humanity_mission_status'
    },
    recommendationTargetMap: {
        orchestrate_humanity_mission_lane: 'agent:mission-control',
        mitigate_mission_systemic_risk: 'agent:risk',
        audit_mission_operating_signals: 'agent:trust',
        publish_humanity_mission_status: 'agent:ops'
    }
});

export function runHumanityMissionOperatingSystem(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function humanityMissionOperatingSystemToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class HumanityMissionOperatingSystem extends BaseManager {}

export const __humanityMissionOperatingSystemInternals = toolkit.internals;
