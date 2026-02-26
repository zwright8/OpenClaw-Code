import test from 'node:test';
import assert from 'node:assert/strict';
import {
    RightsKpiDashboardPublisher,
    publishRightsKpiDashboard,
    rightsKpiDashboardPublisherToTasks
} from '../src/rights-kpi-dashboard-publisher.js';
import {
    RightsSkillGapDiagnoser,
    diagnoseRightsSkillGaps,
    rightsSkillGapDiagnoserToTasks
} from '../src/rights-skill-gap-diagnoser.js';
import {
    RightsTrainingCurriculumComposer,
    composeRightsTrainingCurriculum,
    rightsTrainingCurriculumComposerToTasks
} from '../src/rights-training-curriculum-composer.js';
import {
    RightsSelfReflectionErrorTaxonomist,
    rightsSelfReflectionErrorTaxonomistToTasks,
    taxonomyRightsSelfReflectionErrors
} from '../src/rights-self-reflection-error-taxonomist.js';
import {
    RightsContinuousImprovementPlanner,
    planRightsContinuousImprovement,
    rightsContinuousImprovementPlannerToTasks
} from '../src/rights-continuous-improvement-planner.js';
import {
    InfraSignalIngestionNormalizer,
    infraSignalIngestionNormalizerToTasks,
    normalizeInfraSignalIngestion
} from '../src/infra-signal-ingestion-normalizer.js';
import {
    InfraContextWindowPrioritizer,
    infraContextWindowPrioritizerToTasks,
    prioritizeInfraContextWindow
} from '../src/infra-context-window-prioritizer.js';
import {
    InfraEvidenceProvenanceTracker,
    infraEvidenceProvenanceTrackerToTasks,
    trackInfraEvidenceProvenance
} from '../src/infra-evidence-provenance-tracker.js';

const capabilities = [
    {
        number: 916,
        capabilityId: 'rights_kpi_dashboard_publisher',
        evaluate: publishRightsKpiDashboard,
        toTasks: rightsKpiDashboardPublisherToTasks,
        classRef: RightsKpiDashboardPublisher,
        collectionField: 'kpis',
        idField: 'kpiId'
    },
    {
        number: 917,
        capabilityId: 'rights_skill_gap_diagnoser',
        evaluate: diagnoseRightsSkillGaps,
        toTasks: rightsSkillGapDiagnoserToTasks,
        classRef: RightsSkillGapDiagnoser,
        collectionField: 'skills',
        idField: 'skillId'
    },
    {
        number: 918,
        capabilityId: 'rights_training_curriculum_composer',
        evaluate: composeRightsTrainingCurriculum,
        toTasks: rightsTrainingCurriculumComposerToTasks,
        classRef: RightsTrainingCurriculumComposer,
        collectionField: 'curricula',
        idField: 'curriculumId'
    },
    {
        number: 919,
        capabilityId: 'rights_self_reflection_error_taxonomist',
        evaluate: taxonomyRightsSelfReflectionErrors,
        toTasks: rightsSelfReflectionErrorTaxonomistToTasks,
        classRef: RightsSelfReflectionErrorTaxonomist,
        collectionField: 'errorPatterns',
        idField: 'errorId'
    },
    {
        number: 920,
        capabilityId: 'rights_continuous_improvement_planner',
        evaluate: planRightsContinuousImprovement,
        toTasks: rightsContinuousImprovementPlannerToTasks,
        classRef: RightsContinuousImprovementPlanner,
        collectionField: 'improvements',
        idField: 'improvementId'
    },
    {
        number: 921,
        capabilityId: 'infra_signal_ingestion_normalizer',
        evaluate: normalizeInfraSignalIngestion,
        toTasks: infraSignalIngestionNormalizerToTasks,
        classRef: InfraSignalIngestionNormalizer,
        collectionField: 'signals',
        idField: 'signalId'
    },
    {
        number: 922,
        capabilityId: 'infra_context_window_prioritizer',
        evaluate: prioritizeInfraContextWindow,
        toTasks: infraContextWindowPrioritizerToTasks,
        classRef: InfraContextWindowPrioritizer,
        collectionField: 'contexts',
        idField: 'contextId'
    },
    {
        number: 923,
        capabilityId: 'infra_evidence_provenance_tracker',
        evaluate: trackInfraEvidenceProvenance,
        toTasks: infraEvidenceProvenanceTrackerToTasks,
        classRef: InfraEvidenceProvenanceTracker,
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
            now: () => 9160000 + index
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
            now: () => 9170000 + index
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
            now: () => 4500000 + index
        });

        const managerReport = manager.evaluate(payload);
        const managerTasks = manager.buildTasks(managerReport);

        assert.equal(manager.listHistory({ limit: 5 }).length, 1);
        assert.equal(managerTasks.length > 0, true);
        assert.equal(managerTasks[0].kind, 'task_request');
        assert.equal(managerTasks[0].from, 'agent:manager-local');
    });
}
