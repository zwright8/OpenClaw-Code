import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 196,
        capabilityId: 'governance_kpi_dashboard_publisher',
        evaluate: 'publishGovernanceKpiDashboard',
        toTasks: 'governanceKpiDashboardPublisherToTasks',
        className: 'GovernanceKpiDashboardPublisher',
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 197,
        capabilityId: 'governance_skill_gap_diagnoser',
        evaluate: 'diagnoseGovernanceSkillGaps',
        toTasks: 'governanceSkillGapDiagnoserToTasks',
        className: 'GovernanceSkillGapDiagnoser',
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 198,
        capabilityId: 'governance_training_curriculum_composer',
        evaluate: 'composeGovernanceTrainingCurriculum',
        toTasks: 'governanceTrainingCurriculumComposerToTasks',
        className: 'GovernanceTrainingCurriculumComposer',
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 199,
        capabilityId: 'governance_self_reflection_error_taxonomist',
        evaluate: 'taxonomyGovernanceSelfReflectionErrors',
        toTasks: 'governanceSelfReflectionErrorTaxonomistToTasks',
        className: 'GovernanceSelfReflectionErrorTaxonomist',
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 200,
        capabilityId: 'governance_continuous_improvement_planner',
        evaluate: 'planGovernanceContinuousImprovement',
        toTasks: 'governanceContinuousImprovementPlannerToTasks',
        className: 'GovernanceContinuousImprovementPlanner',
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 201,
        capabilityId: 'oversight_signal_ingestion_normalizer',
        evaluate: 'normalizeOversightSignalIngestion',
        toTasks: 'oversightSignalIngestionNormalizerToTasks',
        className: 'OversightSignalIngestionNormalizer',
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 202,
        capabilityId: 'oversight_context_window_prioritizer',
        evaluate: 'prioritizeOversightContextWindow',
        toTasks: 'oversightContextWindowPrioritizerToTasks',
        className: 'OversightContextWindowPrioritizer',
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 203,
        capabilityId: 'oversight_evidence_provenance_tracker',
        evaluate: 'trackOversightEvidenceProvenance',
        toTasks: 'oversightEvidenceProvenanceTrackerToTasks',
        className: 'OversightEvidenceProvenanceTracker',
        collectionField: 'evidenceNodes',
        idField: 'evidenceId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 83,
        capacity: 45,
        risk: 77,
        impact: 82,
        readiness: 41,
        resilience: 37,
        equity: 54,
        efficiency: 48,
        quality: 56,
        trust: 49,
        opportunity: 81,
        criticality: 94,
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
                    demand: 47,
                    capacity: 93,
                    risk: 18,
                    readiness: 88,
                    resilience: 91,
                    trust: 89,
                    quality: 86,
                    efficiency: 83,
                    criticality: 42
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 19,
                reviewHours: 8
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1970000 + index
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
                    demand: 51,
                    capacity: 95,
                    risk: 16,
                    readiness: 90,
                    resilience: 92,
                    trust: 91,
                    quality: 88,
                    efficiency: 85,
                    criticality: 40
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 44,
                reviewHours: 21
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1980000 + index
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
            now: () => 1990000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
