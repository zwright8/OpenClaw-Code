import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 276,
        capabilityId: 'collab_kpi_dashboard_publisher',
        evaluate: 'publishCollabKpiDashboard',
        toTasks: 'collabKpiDashboardPublisherToTasks',
        className: 'CollabKpiDashboardPublisher',
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 277,
        capabilityId: 'collab_skill_gap_diagnoser',
        evaluate: 'diagnoseCollabSkillGaps',
        toTasks: 'collabSkillGapDiagnoserToTasks',
        className: 'CollabSkillGapDiagnoser',
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 278,
        capabilityId: 'collab_training_curriculum_composer',
        evaluate: 'composeCollabTrainingCurriculum',
        toTasks: 'collabTrainingCurriculumComposerToTasks',
        className: 'CollabTrainingCurriculumComposer',
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 279,
        capabilityId: 'collab_self_reflection_error_taxonomist',
        evaluate: 'taxonomyCollabSelfReflectionErrors',
        toTasks: 'collabSelfReflectionErrorTaxonomistToTasks',
        className: 'CollabSelfReflectionErrorTaxonomist',
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 280,
        capabilityId: 'collab_continuous_improvement_planner',
        evaluate: 'planCollabContinuousImprovement',
        toTasks: 'collabContinuousImprovementPlannerToTasks',
        className: 'CollabContinuousImprovementPlanner',
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 281,
        capabilityId: 'federation_signal_ingestion_normalizer',
        evaluate: 'normalizeFederationSignalIngestion',
        toTasks: 'federationSignalIngestionNormalizerToTasks',
        className: 'FederationSignalIngestionNormalizer',
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 282,
        capabilityId: 'federation_context_window_prioritizer',
        evaluate: 'prioritizeFederationContextWindow',
        toTasks: 'federationContextWindowPrioritizerToTasks',
        className: 'FederationContextWindowPrioritizer',
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 283,
        capabilityId: 'federation_evidence_provenance_tracker',
        evaluate: 'trackFederationEvidenceProvenance',
        toTasks: 'federationEvidenceProvenanceTrackerToTasks',
        className: 'FederationEvidenceProvenanceTracker',
        collectionField: 'evidenceNodes',
        idField: 'evidenceId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 94,
        capacity: 33,
        risk: 89,
        impact: 93,
        readiness: 43,
        resilience: 25,
        equity: 65,
        efficiency: 58,
        quality: 67,
        trust: 60,
        opportunity: 92,
        criticality: 104,
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
                    demand: 37,
                    capacity: 109,
                    risk: 5,
                    readiness: 101,
                    resilience: 103,
                    trust: 102,
                    quality: 99,
                    efficiency: 96,
                    criticality: 29
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 29,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2270000 + index
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
                    demand: 41,
                    capacity: 110,
                    risk: 4,
                    readiness: 102,
                    resilience: 104,
                    trust: 103,
                    quality: 100,
                    efficiency: 97,
                    criticality: 28
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 64,
                reviewHours: 32
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 2280000 + index
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
            now: () => 2290000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
