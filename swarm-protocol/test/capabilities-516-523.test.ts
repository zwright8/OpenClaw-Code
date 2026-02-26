import test from 'node:test';
import assert from 'node:assert/strict';
import * as swarm from '../index.js';

const capabilities = [
    {
        number: 516,
        capabilityId: 'research_kpi_dashboard_publisher',
        evaluate: 'publishResearchKpiDashboard',
        toTasks: 'researchKpiDashboardPublisherToTasks',
        className: 'ResearchKpiDashboardPublisher',
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 517,
        capabilityId: 'research_skill_gap_diagnoser',
        evaluate: 'diagnoseResearchSkillGaps',
        toTasks: 'researchSkillGapDiagnoserToTasks',
        className: 'ResearchSkillGapDiagnoser',
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 518,
        capabilityId: 'research_training_curriculum_composer',
        evaluate: 'composeResearchTrainingCurriculum',
        toTasks: 'researchTrainingCurriculumComposerToTasks',
        className: 'ResearchTrainingCurriculumComposer',
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 519,
        capabilityId: 'research_self_reflection_error_taxonomist',
        evaluate: 'taxonomyResearchSelfReflectionErrors',
        toTasks: 'researchSelfReflectionErrorTaxonomistToTasks',
        className: 'ResearchSelfReflectionErrorTaxonomist',
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 520,
        capabilityId: 'research_continuous_improvement_planner',
        evaluate: 'planResearchContinuousImprovement',
        toTasks: 'researchContinuousImprovementPlannerToTasks',
        className: 'ResearchContinuousImprovementPlanner',
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 521,
        capabilityId: 'engineering_signal_ingestion_normalizer',
        evaluate: 'normalizeEngineeringSignalIngestion',
        toTasks: 'engineeringSignalIngestionNormalizerToTasks',
        className: 'EngineeringSignalIngestionNormalizer',
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 522,
        capabilityId: 'engineering_context_window_prioritizer',
        evaluate: 'prioritizeEngineeringContextWindow',
        toTasks: 'engineeringContextWindowPrioritizerToTasks',
        className: 'EngineeringContextWindowPrioritizer',
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 523,
        capabilityId: 'engineering_evidence_provenance_tracker',
        evaluate: 'trackEngineeringEvidenceProvenance',
        toTasks: 'engineeringEvidenceProvenanceTrackerToTasks',
        className: 'EngineeringEvidenceProvenanceTracker',
        collectionField: 'evidenceNodes',
        idField: 'evidenceId'
    }
];

function buildEntity(idField: string, id: string, overrides: Record<string, unknown> = {}) {
    return {
        [idField]: id,
        name: `Entity ${id}`,
        demand: 82,
        capacity: 44,
        risk: 78,
        impact: 81,
        readiness: 39,
        resilience: 36,
        equity: 52,
        efficiency: 46,
        quality: 54,
        trust: 47,
        opportunity: 79,
        criticality: 93,
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
                    demand: 48,
                    capacity: 92,
                    risk: 19,
                    readiness: 87,
                    resilience: 90,
                    trust: 88,
                    quality: 85,
                    efficiency: 82,
                    criticality: 43
                })
            ],
            capacity: {
                executionSlots: 1,
                analysisHours: 18,
                reviewHours: 7
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 5160000 + index
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
                    demand: 52,
                    capacity: 94,
                    risk: 18,
                    readiness: 89,
                    resilience: 91,
                    trust: 90,
                    quality: 87,
                    efficiency: 84,
                    criticality: 41
                })
            ],
            capacity: {
                executionSlots: 2,
                analysisHours: 42,
                reviewHours: 20
            }
        };

        const report = (evaluate as (input: unknown, options: unknown) => any)(payload, {
            now: () => 5170000 + index
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
            now: () => 2230000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
