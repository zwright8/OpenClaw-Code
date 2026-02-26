import { createCapabilityToolkit } from './capability-toolkit.js';

const toolkit = createCapabilityToolkit({
    capabilityId: 'skill_gap_diagnostic_engine',
    collectionField: 'participants',
    idField: 'participantId',
    defaultName: 'Participant',
    readyPosture: 'skill_gaps_managed',
    defaultAgentId: 'agent:skill-diagnostics',
    recommendationTypes: {
        primary: 'diagnose_skill_gap_hotspots',
        guard: 'launch_targeted_upskilling',
        audit: 'audit_skill_assessment_quality',
        publish: 'publish_skill_gap_report'
    },
    recommendationTargetMap: {
        diagnose_skill_gap_hotspots: 'agent:learning',
        launch_targeted_upskilling: 'agent:coaching',
        audit_skill_assessment_quality: 'agent:quality',
        publish_skill_gap_report: 'agent:ops'
    }
});

export function diagnoseSkillGaps(inputPayload, options = {}) {
    return toolkit.evaluate(inputPayload, options);
}

export function skillGapDiagnosticToTasks(reportPayload, options = {}) {
    return toolkit.toTasks(reportPayload, options);
}

const BaseManager = toolkit.createManagerClass();

export class SkillGapDiagnosticEngine extends BaseManager {}

export const __skillGapDiagnosticEngineInternals = toolkit.internals;
