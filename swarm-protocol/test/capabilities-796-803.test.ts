import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CulturalKpiDashboardPublisher,
    culturalKpiDashboardPublisherToTasks,
    publishCulturalKpiDashboard
} from '../src/cultural-kpi-dashboard-publisher.js';
import {
    CulturalSkillGapDiagnoser,
    culturalSkillGapDiagnoserToTasks,
    diagnoseCulturalSkillGaps
} from '../src/cultural-skill-gap-diagnoser.js';
import {
    CulturalTrainingCurriculumComposer,
    composeCulturalTrainingCurriculum,
    culturalTrainingCurriculumComposerToTasks
} from '../src/cultural-training-curriculum-composer.js';
import {
    CulturalSelfReflectionErrorTaxonomist,
    culturalSelfReflectionErrorTaxonomistToTasks,
    taxonomyCulturalSelfReflectionErrors
} from '../src/cultural-self-reflection-error-taxonomist.js';
import {
    CulturalContinuousImprovementPlanner,
    culturalContinuousImprovementPlannerToTasks,
    planCulturalContinuousImprovement
} from '../src/cultural-continuous-improvement-planner.js';
import {
    InclusionSignalIngestionNormalizer,
    inclusionSignalIngestionNormalizerToTasks,
    normalizeInclusionSignalIngestion
} from '../src/inclusion-signal-ingestion-normalizer.js';
import {
    InclusionContextWindowPrioritizer,
    inclusionContextWindowPrioritizerToTasks,
    prioritizeInclusionContextWindow
} from '../src/inclusion-context-window-prioritizer.js';
import {
    InclusionEvidenceProvenanceTracker,
    inclusionEvidenceProvenanceTrackerToTasks,
    trackInclusionEvidenceProvenance
} from '../src/inclusion-evidence-provenance-tracker.js';

const capabilities = [
    {
        number: 796,
        capabilityId: 'cultural_kpi_dashboard_publisher',
        evaluate: publishCulturalKpiDashboard,
        toTasks: culturalKpiDashboardPublisherToTasks,
        classRef: CulturalKpiDashboardPublisher,
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 797,
        capabilityId: 'cultural_skill_gap_diagnoser',
        evaluate: diagnoseCulturalSkillGaps,
        toTasks: culturalSkillGapDiagnoserToTasks,
        classRef: CulturalSkillGapDiagnoser,
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 798,
        capabilityId: 'cultural_training_curriculum_composer',
        evaluate: composeCulturalTrainingCurriculum,
        toTasks: culturalTrainingCurriculumComposerToTasks,
        classRef: CulturalTrainingCurriculumComposer,
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 799,
        capabilityId: 'cultural_self_reflection_error_taxonomist',
        evaluate: taxonomyCulturalSelfReflectionErrors,
        toTasks: culturalSelfReflectionErrorTaxonomistToTasks,
        classRef: CulturalSelfReflectionErrorTaxonomist,
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 800,
        capabilityId: 'cultural_continuous_improvement_planner',
        evaluate: planCulturalContinuousImprovement,
        toTasks: culturalContinuousImprovementPlannerToTasks,
        classRef: CulturalContinuousImprovementPlanner,
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 801,
        capabilityId: 'inclusion_signal_ingestion_normalizer',
        evaluate: normalizeInclusionSignalIngestion,
        toTasks: inclusionSignalIngestionNormalizerToTasks,
        classRef: InclusionSignalIngestionNormalizer,
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 802,
        capabilityId: 'inclusion_context_window_prioritizer',
        evaluate: prioritizeInclusionContextWindow,
        toTasks: inclusionContextWindowPrioritizerToTasks,
        classRef: InclusionContextWindowPrioritizer,
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 803,
        capabilityId: 'inclusion_evidence_provenance_tracker',
        evaluate: trackInclusionEvidenceProvenance,
        toTasks: inclusionEvidenceProvenanceTrackerToTasks,
        classRef: InclusionEvidenceProvenanceTracker,
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
            now: () => 7960000 + index
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
            now: () => 7970000 + index
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
            now: () => 3000000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
