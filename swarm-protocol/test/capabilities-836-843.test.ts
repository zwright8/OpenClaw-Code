import test from 'node:test';
import assert from 'node:assert/strict';
import {
    InclusionKpiDashboardPublisher,
    inclusionKpiDashboardPublisherToTasks,
    publishInclusionKpiDashboard
} from '../src/inclusion-kpi-dashboard-publisher.js';
import {
    InclusionSkillGapDiagnoser,
    diagnoseInclusionSkillGaps,
    inclusionSkillGapDiagnoserToTasks
} from '../src/inclusion-skill-gap-diagnoser.js';
import {
    InclusionTrainingCurriculumComposer,
    composeInclusionTrainingCurriculum,
    inclusionTrainingCurriculumComposerToTasks
} from '../src/inclusion-training-curriculum-composer.js';
import {
    InclusionSelfReflectionErrorTaxonomist,
    inclusionSelfReflectionErrorTaxonomistToTasks,
    taxonomyInclusionSelfReflectionErrors
} from '../src/inclusion-self-reflection-error-taxonomist.js';
import {
    InclusionContinuousImprovementPlanner,
    inclusionContinuousImprovementPlannerToTasks,
    planInclusionContinuousImprovement
} from '../src/inclusion-continuous-improvement-planner.js';
import {
    CommunitySignalIngestionNormalizer,
    communitySignalIngestionNormalizerToTasks,
    normalizeCommunitySignalIngestion
} from '../src/community-signal-ingestion-normalizer.js';
import {
    CommunityContextWindowPrioritizer,
    communityContextWindowPrioritizerToTasks,
    prioritizeCommunityContextWindow
} from '../src/community-context-window-prioritizer.js';
import {
    CommunityEvidenceProvenanceTracker,
    communityEvidenceProvenanceTrackerToTasks,
    trackCommunityEvidenceProvenance
} from '../src/community-evidence-provenance-tracker.js';

const capabilities = [
    {
        number: 836,
        capabilityId: 'inclusion_kpi_dashboard_publisher',
        evaluate: publishInclusionKpiDashboard,
        toTasks: inclusionKpiDashboardPublisherToTasks,
        classRef: InclusionKpiDashboardPublisher,
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 837,
        capabilityId: 'inclusion_skill_gap_diagnoser',
        evaluate: diagnoseInclusionSkillGaps,
        toTasks: inclusionSkillGapDiagnoserToTasks,
        classRef: InclusionSkillGapDiagnoser,
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 838,
        capabilityId: 'inclusion_training_curriculum_composer',
        evaluate: composeInclusionTrainingCurriculum,
        toTasks: inclusionTrainingCurriculumComposerToTasks,
        classRef: InclusionTrainingCurriculumComposer,
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 839,
        capabilityId: 'inclusion_self_reflection_error_taxonomist',
        evaluate: taxonomyInclusionSelfReflectionErrors,
        toTasks: inclusionSelfReflectionErrorTaxonomistToTasks,
        classRef: InclusionSelfReflectionErrorTaxonomist,
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 840,
        capabilityId: 'inclusion_continuous_improvement_planner',
        evaluate: planInclusionContinuousImprovement,
        toTasks: inclusionContinuousImprovementPlannerToTasks,
        classRef: InclusionContinuousImprovementPlanner,
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 841,
        capabilityId: 'community_signal_ingestion_normalizer',
        evaluate: normalizeCommunitySignalIngestion,
        toTasks: communitySignalIngestionNormalizerToTasks,
        classRef: CommunitySignalIngestionNormalizer,
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 842,
        capabilityId: 'community_context_window_prioritizer',
        evaluate: prioritizeCommunityContextWindow,
        toTasks: communityContextWindowPrioritizerToTasks,
        classRef: CommunityContextWindowPrioritizer,
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 843,
        capabilityId: 'community_evidence_provenance_tracker',
        evaluate: trackCommunityEvidenceProvenance,
        toTasks: communityEvidenceProvenanceTrackerToTasks,
        classRef: CommunityEvidenceProvenanceTracker,
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
            now: () => 8360000 + index
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
            now: () => 8370000 + index
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
            now: () => 3500000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
