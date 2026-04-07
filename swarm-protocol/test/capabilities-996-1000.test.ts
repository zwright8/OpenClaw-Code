import test from 'node:test';
import assert from 'node:assert/strict';
import {
    EvolutionKpiDashboardPublisher,
    evolutionKpiDashboardPublisherToTasks,
    publishEvolutionKpiDashboard
} from '../src/evolution-kpi-dashboard-publisher.js';
import {
    EvolutionSkillGapDiagnoser,
    diagnoseEvolutionSkillGaps,
    evolutionSkillGapDiagnoserToTasks
} from '../src/evolution-skill-gap-diagnoser.js';
import {
    EvolutionTrainingCurriculumComposer,
    composeEvolutionTrainingCurriculum,
    evolutionTrainingCurriculumComposerToTasks
} from '../src/evolution-training-curriculum-composer.js';
import {
    EvolutionSelfReflectionErrorTaxonomist,
    evolutionSelfReflectionErrorTaxonomistToTasks,
    taxonomyEvolutionSelfReflectionErrors
} from '../src/evolution-self-reflection-error-taxonomist.js';
import {
    EvolutionContinuousImprovementPlanner,
    evolutionContinuousImprovementPlannerToTasks,
    planEvolutionContinuousImprovement
} from '../src/evolution-continuous-improvement-planner.js';

const capabilities = [
    {
        number: 996,
        capabilityId: 'evolution_kpi_dashboard_publisher',
        evaluate: publishEvolutionKpiDashboard,
        toTasks: evolutionKpiDashboardPublisherToTasks,
        classRef: EvolutionKpiDashboardPublisher,
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 997,
        capabilityId: 'evolution_skill_gap_diagnoser',
        evaluate: diagnoseEvolutionSkillGaps,
        toTasks: evolutionSkillGapDiagnoserToTasks,
        classRef: EvolutionSkillGapDiagnoser,
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 998,
        capabilityId: 'evolution_training_curriculum_composer',
        evaluate: composeEvolutionTrainingCurriculum,
        toTasks: evolutionTrainingCurriculumComposerToTasks,
        classRef: EvolutionTrainingCurriculumComposer,
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 999,
        capabilityId: 'evolution_self_reflection_error_taxonomist',
        evaluate: taxonomyEvolutionSelfReflectionErrors,
        toTasks: evolutionSelfReflectionErrorTaxonomistToTasks,
        classRef: EvolutionSelfReflectionErrorTaxonomist,
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 1000,
        capabilityId: 'evolution_continuous_improvement_planner',
        evaluate: planEvolutionContinuousImprovement,
        toTasks: evolutionContinuousImprovementPlannerToTasks,
        classRef: EvolutionContinuousImprovementPlanner,
        collectionField: 'improvements',
        idField: 'improvementId'
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

        const report = capability.evaluate(payload, {
            now: () => 9960000 + index
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

        const report = capability.evaluate(payload, {
            now: () => 9970000 + index
        });
        const tasks = capability.toTasks(report, {
            fromAgentId: 'agent:test-runner'
        });

        assert.equal(tasks.length > 0, true);
        assert.equal(tasks[0].kind, 'task_request');
        assert.equal(tasks[0].from, 'agent:test-runner');

        const ManagerCtor = capability.classRef as new (options: unknown) => {
            evaluate: (input: unknown) => any;
            buildTasks: (reportPayload: unknown) => any[];
            listHistory: (options: { limit: number }) => unknown[];
        };
        const manager = new ManagerCtor({
            localAgentId: 'agent:manager-local',
            now: () => 5500000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
