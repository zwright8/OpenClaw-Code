import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommsKpiDashboardPublisher,
    commsKpiDashboardPublisherToTasks,
    publishCommsKpiDashboard
} from '../src/comms-kpi-dashboard-publisher.js';
import {
    CommsSkillGapDiagnoser,
    commsSkillGapDiagnoserToTasks,
    diagnoseCommsSkillGaps
} from '../src/comms-skill-gap-diagnoser.js';
import {
    CommsTrainingCurriculumComposer,
    commsTrainingCurriculumComposerToTasks,
    composeCommsTrainingCurriculum
} from '../src/comms-training-curriculum-composer.js';
import {
    CommsSelfReflectionErrorTaxonomist,
    commsSelfReflectionErrorTaxonomistToTasks,
    taxonomyCommsSelfReflectionErrors
} from '../src/comms-self-reflection-error-taxonomist.js';
import {
    CommsContinuousImprovementPlanner,
    commsContinuousImprovementPlannerToTasks,
    planCommsContinuousImprovement
} from '../src/comms-continuous-improvement-planner.js';
import {
    CulturalSignalIngestionNormalizer,
    culturalSignalIngestionNormalizerToTasks,
    normalizeCulturalSignalIngestion
} from '../src/cultural-signal-ingestion-normalizer.js';
import {
    CulturalContextWindowPrioritizer,
    culturalContextWindowPrioritizerToTasks,
    prioritizeCulturalContextWindow
} from '../src/cultural-context-window-prioritizer.js';
import {
    CulturalEvidenceProvenanceTracker,
    culturalEvidenceProvenanceTrackerToTasks,
    trackCulturalEvidenceProvenance
} from '../src/cultural-evidence-provenance-tracker.js';

const capabilities = [
    {
        number: 756,
        capabilityId: 'comms_kpi_dashboard_publisher',
        evaluate: publishCommsKpiDashboard,
        toTasks: commsKpiDashboardPublisherToTasks,
        classRef: CommsKpiDashboardPublisher,
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 757,
        capabilityId: 'comms_skill_gap_diagnoser',
        evaluate: diagnoseCommsSkillGaps,
        toTasks: commsSkillGapDiagnoserToTasks,
        classRef: CommsSkillGapDiagnoser,
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 758,
        capabilityId: 'comms_training_curriculum_composer',
        evaluate: composeCommsTrainingCurriculum,
        toTasks: commsTrainingCurriculumComposerToTasks,
        classRef: CommsTrainingCurriculumComposer,
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 759,
        capabilityId: 'comms_self_reflection_error_taxonomist',
        evaluate: taxonomyCommsSelfReflectionErrors,
        toTasks: commsSelfReflectionErrorTaxonomistToTasks,
        classRef: CommsSelfReflectionErrorTaxonomist,
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 760,
        capabilityId: 'comms_continuous_improvement_planner',
        evaluate: planCommsContinuousImprovement,
        toTasks: commsContinuousImprovementPlannerToTasks,
        classRef: CommsContinuousImprovementPlanner,
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 761,
        capabilityId: 'cultural_signal_ingestion_normalizer',
        evaluate: normalizeCulturalSignalIngestion,
        toTasks: culturalSignalIngestionNormalizerToTasks,
        classRef: CulturalSignalIngestionNormalizer,
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 762,
        capabilityId: 'cultural_context_window_prioritizer',
        evaluate: prioritizeCulturalContextWindow,
        toTasks: culturalContextWindowPrioritizerToTasks,
        classRef: CulturalContextWindowPrioritizer,
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 763,
        capabilityId: 'cultural_evidence_provenance_tracker',
        evaluate: trackCulturalEvidenceProvenance,
        toTasks: culturalEvidenceProvenanceTrackerToTasks,
        classRef: CulturalEvidenceProvenanceTracker,
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
            now: () => 7560000 + index
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
            now: () => 7570000 + index
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
            now: () => 2500000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
