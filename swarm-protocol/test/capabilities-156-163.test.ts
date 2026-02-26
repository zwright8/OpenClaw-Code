import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 156,
        capabilityId: 'tooling_kpi_dashboard_publisher',
        evaluate: 'publishToolingKpiDashboard',
        toTasks: 'toolingKpiDashboardPublisherToTasks',
        className: 'ToolingKpiDashboardPublisher',
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 157,
        capabilityId: 'tooling_skill_gap_diagnoser',
        evaluate: 'diagnoseToolingSkillGaps',
        toTasks: 'toolingSkillGapDiagnoserToTasks',
        className: 'ToolingSkillGapDiagnoser',
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 158,
        capabilityId: 'tooling_training_curriculum_composer',
        evaluate: 'composeToolingTrainingCurriculum',
        toTasks: 'toolingTrainingCurriculumComposerToTasks',
        className: 'ToolingTrainingCurriculumComposer',
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 159,
        capabilityId: 'tooling_self_reflection_error_taxonomist',
        evaluate: 'taxonomyToolingSelfReflectionErrors',
        toTasks: 'toolingSelfReflectionErrorTaxonomistToTasks',
        className: 'ToolingSelfReflectionErrorTaxonomist',
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 160,
        capabilityId: 'tooling_continuous_improvement_planner',
        evaluate: 'planToolingContinuousImprovement',
        toTasks: 'toolingContinuousImprovementPlannerToTasks',
        className: 'ToolingContinuousImprovementPlanner',
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 161,
        capabilityId: 'governance_signal_ingestion_normalizer',
        evaluate: 'normalizeGovernanceSignalIngestion',
        toTasks: 'governanceSignalIngestionNormalizerToTasks',
        className: 'GovernanceSignalIngestionNormalizer',
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 162,
        capabilityId: 'governance_context_window_prioritizer',
        evaluate: 'prioritizeGovernanceContextWindow',
        toTasks: 'governanceContextWindowPrioritizerToTasks',
        className: 'GovernanceContextWindowPrioritizer',
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 163,
        capabilityId: 'governance_evidence_provenance_tracker',
        evaluate: 'trackGovernanceEvidenceProvenance',
        toTasks: 'governanceEvidenceProvenanceTrackerToTasks',
        className: 'GovernanceEvidenceProvenanceTracker',
        collectionField: 'evidenceNodes',
        idField: 'evidenceId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 80,
        capacity: 42,
        risk: 73,
        impact: 84,
        readiness: 43,
        resilience: 37,
        equity: 56,
        efficiency: 50,
        quality: 58,
        trust: 51,
        opportunity: 77,
        criticality: 89,
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
                    demand: 46,
                    capacity: 88,
                    risk: 23,
                    readiness: 83,
                    resilience: 86,
                    trust: 84,
                    quality: 81,
                    efficiency: 78,
                    criticality: 47
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 16,
                reviewHours: 6
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1820000 + index
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
                    demand: 50,
                    capacity: 90,
                    risk: 20,
                    readiness: 85,
                    resilience: 87,
                    trust: 86,
                    quality: 83,
                    efficiency: 80,
                    criticality: 45
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 40,
                reviewHours: 18
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 1830000 + index
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
            now: () => 1840000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
