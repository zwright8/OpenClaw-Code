import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CommunityKpiDashboardPublisher,
    communityKpiDashboardPublisherToTasks,
    publishCommunityKpiDashboard
} from '../src/community-kpi-dashboard-publisher.js';
import {
    CommunitySkillGapDiagnoser,
    communitySkillGapDiagnoserToTasks,
    diagnoseCommunitySkillGaps
} from '../src/community-skill-gap-diagnoser.js';
import {
    CommunityTrainingCurriculumComposer,
    communityTrainingCurriculumComposerToTasks,
    composeCommunityTrainingCurriculum
} from '../src/community-training-curriculum-composer.js';
import {
    CommunitySelfReflectionErrorTaxonomist,
    communitySelfReflectionErrorTaxonomistToTasks,
    taxonomyCommunitySelfReflectionErrors
} from '../src/community-self-reflection-error-taxonomist.js';
import {
    CommunityContinuousImprovementPlanner,
    communityContinuousImprovementPlannerToTasks,
    planCommunityContinuousImprovement
} from '../src/community-continuous-improvement-planner.js';
import {
    RightsSignalIngestionNormalizer,
    normalizeRightsSignalIngestion,
    rightsSignalIngestionNormalizerToTasks
} from '../src/rights-signal-ingestion-normalizer.js';
import {
    RightsContextWindowPrioritizer,
    prioritizeRightsContextWindow,
    rightsContextWindowPrioritizerToTasks
} from '../src/rights-context-window-prioritizer.js';
import {
    RightsEvidenceProvenanceTracker,
    rightsEvidenceProvenanceTrackerToTasks,
    trackRightsEvidenceProvenance
} from '../src/rights-evidence-provenance-tracker.js';

const capabilities = [
    {
        number: 876,
        capabilityId: 'community_kpi_dashboard_publisher',
        evaluate: publishCommunityKpiDashboard,
        toTasks: communityKpiDashboardPublisherToTasks,
        classRef: CommunityKpiDashboardPublisher,
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 877,
        capabilityId: 'community_skill_gap_diagnoser',
        evaluate: diagnoseCommunitySkillGaps,
        toTasks: communitySkillGapDiagnoserToTasks,
        classRef: CommunitySkillGapDiagnoser,
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 878,
        capabilityId: 'community_training_curriculum_composer',
        evaluate: composeCommunityTrainingCurriculum,
        toTasks: communityTrainingCurriculumComposerToTasks,
        classRef: CommunityTrainingCurriculumComposer,
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 879,
        capabilityId: 'community_self_reflection_error_taxonomist',
        evaluate: taxonomyCommunitySelfReflectionErrors,
        toTasks: communitySelfReflectionErrorTaxonomistToTasks,
        classRef: CommunitySelfReflectionErrorTaxonomist,
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 880,
        capabilityId: 'community_continuous_improvement_planner',
        evaluate: planCommunityContinuousImprovement,
        toTasks: communityContinuousImprovementPlannerToTasks,
        classRef: CommunityContinuousImprovementPlanner,
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 881,
        capabilityId: 'rights_signal_ingestion_normalizer',
        evaluate: normalizeRightsSignalIngestion,
        toTasks: rightsSignalIngestionNormalizerToTasks,
        classRef: RightsSignalIngestionNormalizer,
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 882,
        capabilityId: 'rights_context_window_prioritizer',
        evaluate: prioritizeRightsContextWindow,
        toTasks: rightsContextWindowPrioritizerToTasks,
        classRef: RightsContextWindowPrioritizer,
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 883,
        capabilityId: 'rights_evidence_provenance_tracker',
        evaluate: trackRightsEvidenceProvenance,
        toTasks: rightsEvidenceProvenanceTrackerToTasks,
        classRef: RightsEvidenceProvenanceTracker,
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
            now: () => 8760000 + index
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
            now: () => 8770000 + index
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
            now: () => 4000000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
