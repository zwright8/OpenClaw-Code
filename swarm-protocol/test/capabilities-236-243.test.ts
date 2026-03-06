import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 236,
        capabilityId: 'oversight_kpi_dashboard_publisher',
        evaluate: 'publishOversightKpiDashboard',
        toTasks: 'oversightKpiDashboardPublisherToTasks',
        className: 'OversightKpiDashboardPublisher',
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 237,
        capabilityId: 'oversight_skill_gap_diagnoser',
        evaluate: 'diagnoseOversightSkillGaps',
        toTasks: 'oversightSkillGapDiagnoserToTasks',
        className: 'OversightSkillGapDiagnoser',
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 238,
        capabilityId: 'oversight_training_curriculum_composer',
        evaluate: 'composeOversightTrainingCurriculum',
        toTasks: 'oversightTrainingCurriculumComposerToTasks',
        className: 'OversightTrainingCurriculumComposer',
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 239,
        capabilityId: 'oversight_self_reflection_error_taxonomist',
        evaluate: 'taxonomyOversightSelfReflectionErrors',
        toTasks: 'oversightSelfReflectionErrorTaxonomistToTasks',
        className: 'OversightSelfReflectionErrorTaxonomist',
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 240,
        capabilityId: 'oversight_continuous_improvement_planner',
        evaluate: 'planOversightContinuousImprovement',
        toTasks: 'oversightContinuousImprovementPlannerToTasks',
        className: 'OversightContinuousImprovementPlanner',
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 241,
        capabilityId: 'collab_signal_ingestion_normalizer',
        evaluate: 'normalizeCollabSignalIngestion',
        toTasks: 'collabSignalIngestionNormalizerToTasks',
        className: 'CollabSignalIngestionNormalizer',
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 242,
        capabilityId: 'collab_context_window_prioritizer',
        evaluate: 'prioritizeCollabContextWindow',
        toTasks: 'collabContextWindowPrioritizerToTasks',
        className: 'CollabContextWindowPrioritizer',
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 243,
        capabilityId: 'collab_evidence_provenance_tracker',
        evaluate: 'trackCollabEvidenceProvenance',
        toTasks: 'collabEvidenceProvenanceTrackerToTasks',
        className: 'CollabEvidenceProvenanceTracker',
        collectionField: 'evidenceNodes',
        idField: 'evidenceId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 88,
        capacity: 39,
        risk: 83,
        impact: 87,
        readiness: 46,
        resilience: 31,
        equity: 59,
        efficiency: 53,
        quality: 61,
        trust: 54,
        opportunity: 86,
        criticality: 99,
        ...overrides
    };
}

for (const [index, capability] of capabilities.entries()) {
    test(`${capability.number} ${capability.capabilityId} generates capability report`, () => {
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        assert.equal(typeof evaluate, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-a`),
                buildEntity(capability.idField, `${capability.number}-b`, {
                    demand: 42,
                    capacity: 98,
                    risk: 13,
                    readiness: 93,
                    resilience: 96,
                    trust: 94,
                    quality: 91,
                    efficiency: 88,
                    criticality: 37
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 24,
                reviewHours: 13
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2120000 + index
        });

        assert.equal(typeof report.at, 'number');
        assert.equal(report.summary.entityCount, 2);
        assert.equal(report.assessments.length, 2);
        assert.equal(
            report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold,
            2
        );
        assert.equal(Array.isArray(report.alerts), true);
        assert.equal(Array.isArray(report.recommendations), true);
        assert.equal(report.recommendations.length > 0, true);
    });

    test(`${capability.number} ${capability.capabilityId} tasks and manager wrappers emit task requests`, () => {
        const evaluate = swarm[capability.evaluate as keyof typeof swarm];
        const toTasks = swarm[capability.toTasks as keyof typeof swarm];
        const ManagerClass = swarm[capability.className as keyof typeof swarm];

        assert.equal(typeof evaluate, 'function');
        assert.equal(typeof toTasks, 'function');
        assert.equal(typeof ManagerClass, 'function');

        const payload = {
            [capability.collectionField]: [
                buildEntity(capability.idField, `${capability.number}-x`),
                buildEntity(capability.idField, `${capability.number}-y`, {
                    demand: 46,
                    capacity: 100,
                    risk: 11,
                    readiness: 95,
                    resilience: 97,
                    trust: 96,
                    quality: 93,
                    efficiency: 90,
                    criticality: 35
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 54,
                reviewHours: 26
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2130000 + index
        });
        const tasks = (toTasks as (reportPayload: unknown, options: unknown) => any[])(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const ManagerCtor = ManagerClass as new (options: unknown) => {
            evaluate: (input: unknown) => any;
            buildTasks: (reportPayload: unknown) => any[];
            listHistory: (options: { limit: number }) => unknown[];
        };
        const manager = new ManagerCtor({
            localAgentId: 'agent:manager-local',
            now: () => 2140000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
