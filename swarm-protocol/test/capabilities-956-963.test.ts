import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InfraKpiDashboardPublisher,
    infraKpiDashboardPublisherToTasks,
    publishInfraKpiDashboard
} from '../src/infra-kpi-dashboard-publisher.js';
import {
    InfraSkillGapDiagnoser,
    diagnoseInfraSkillGaps,
    infraSkillGapDiagnoserToTasks
} from '../src/infra-skill-gap-diagnoser.js';
import {
    InfraTrainingCurriculumComposer,
    composeInfraTrainingCurriculum,
    infraTrainingCurriculumComposerToTasks
} from '../src/infra-training-curriculum-composer.js';
import {
    InfraSelfReflectionErrorTaxonomist,
    infraSelfReflectionErrorTaxonomistToTasks,
    taxonomyInfraSelfReflectionErrors
} from '../src/infra-self-reflection-error-taxonomist.js';
import {
    InfraContinuousImprovementPlanner,
    infraContinuousImprovementPlannerToTasks,
    planInfraContinuousImprovement
} from '../src/infra-continuous-improvement-planner.js';
import {
    EvolutionSignalIngestionNormalizer,
    evolutionSignalIngestionNormalizerToTasks,
    normalizeEvolutionSignalIngestion
} from '../src/evolution-signal-ingestion-normalizer.js';
import {
    EvolutionContextWindowPrioritizer,
    evolutionContextWindowPrioritizerToTasks,
    prioritizeEvolutionContextWindow
} from '../src/evolution-context-window-prioritizer.js';
import {
    EvolutionEvidenceProvenanceTracker,
    evolutionEvidenceProvenanceTrackerToTasks,
    trackEvolutionEvidenceProvenance
} from '../src/evolution-evidence-provenance-tracker.js';

const capabilities = [
    {
        number: 956,
        capabilityId: 'infra_kpi_dashboard_publisher',
        evaluate: publishInfraKpiDashboard,
        toTasks: infraKpiDashboardPublisherToTasks,
        classRef: InfraKpiDashboardPublisher,
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 957,
        capabilityId: 'infra_skill_gap_diagnoser',
        evaluate: diagnoseInfraSkillGaps,
        toTasks: infraSkillGapDiagnoserToTasks,
        classRef: InfraSkillGapDiagnoser,
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 958,
        capabilityId: 'infra_training_curriculum_composer',
        evaluate: composeInfraTrainingCurriculum,
        toTasks: infraTrainingCurriculumComposerToTasks,
        classRef: InfraTrainingCurriculumComposer,
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 959,
        capabilityId: 'infra_self_reflection_error_taxonomist',
        evaluate: taxonomyInfraSelfReflectionErrors,
        toTasks: infraSelfReflectionErrorTaxonomistToTasks,
        classRef: InfraSelfReflectionErrorTaxonomist,
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 960,
        capabilityId: 'infra_continuous_improvement_planner',
        evaluate: planInfraContinuousImprovement,
        toTasks: infraContinuousImprovementPlannerToTasks,
        classRef: InfraContinuousImprovementPlanner,
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 961,
        capabilityId: 'evolution_signal_ingestion_normalizer',
        evaluate: normalizeEvolutionSignalIngestion,
        toTasks: evolutionSignalIngestionNormalizerToTasks,
        classRef: EvolutionSignalIngestionNormalizer,
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 962,
        capabilityId: 'evolution_context_window_prioritizer',
        evaluate: prioritizeEvolutionContextWindow,
        toTasks: evolutionContextWindowPrioritizerToTasks,
        classRef: EvolutionContextWindowPrioritizer,
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 963,
        capabilityId: 'evolution_evidence_provenance_tracker',
        evaluate: trackEvolutionEvidenceProvenance,
        toTasks: evolutionEvidenceProvenanceTrackerToTasks,
        classRef: EvolutionEvidenceProvenanceTracker,
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
            now: () => 9560000 + index
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
            now: () => 9570000 + index
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
            now: () => 5000000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
