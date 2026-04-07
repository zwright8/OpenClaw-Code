import test from 'node:test';
import assert from 'node:assert/strict';
import {
    curateOpenKnowledge,
    openKnowledgeToTasks,
    OpenKnowledgeCurator
} from '../index.js';

function baseInput() {
    return {
        artifacts: [
            {
                artifactId: 'artifact-cases',
                domains: ['casework'],
                sourceTrust: 72,
                freshnessDays: 18,
                reusability: 66,
                licenseClarity: 58,
                evidenceDepth: 62,
                duplicationRisk: 36
            },
            {
                artifactId: 'artifact-intake',
                domains: ['intake'],
                sourceTrust: 80,
                freshnessDays: 12,
                reusability: 70,
                licenseClarity: 74,
                evidenceDepth: 72,
                duplicationRisk: 22
            }
        ],
        communityNeeds: [
            {
                needId: 'need-casework',
                domain: 'casework',
                priorityImpact: 88,
                urgency: 78
            },
            {
                needId: 'need-housing',
                domain: 'housing',
                priorityImpact: 82,
                urgency: 74
            }
        ],
        capacity: {
            curationSlots: 1,
            reviewerHours: 6,
            publicationSlots: 1
        }
    };
}

test('curateOpenKnowledge surfaces coverage and reviewer gaps under constrained curation capacity', () => {
    const report = curateOpenKnowledge(baseInput(), {
        now: () => 1_900_000
    });

    assert.equal(report.summary.needCount, 2);
    assert.equal(report.summary.laneCounts.now + report.summary.laneCounts.next + report.summary.laneCounts.hold, 2);
    assert.equal(
        report.alerts.includes('knowledge_curation_hold_queue_present')
        || report.alerts.includes('knowledge_domain_coverage_gap')
        || report.alerts.includes('knowledge_reviewer_capacity_gap'),
        true
    );
    assert.equal(report.recommendations.some((entry) => (
        entry.type === 'close_domain_coverage_gap' || entry.type === 'run_quality_verification'
    )), true);
});

test('curateOpenKnowledge reports curation_ready for well-covered and well-resourced needs', () => {
    const report = curateOpenKnowledge({
        artifacts: [
            {
                artifactId: 'artifact-ok',
                domains: ['public-health'],
                sourceTrust: 92,
                freshnessDays: 2,
                reusability: 90,
                licenseClarity: 92,
                evidenceDepth: 88,
                duplicationRisk: 8
            }
        ],
        communityNeeds: [
            {
                needId: 'need-ok',
                domain: 'public-health',
                priorityImpact: 60,
                urgency: 54
            }
        ],
        capacity: {
            curationSlots: 4,
            reviewerHours: 60,
            publicationSlots: 4
        }
    }, {
        now: () => 1_901_000
    });

    assert.equal(report.summary.posture, 'curation_ready');
    assert.equal(report.summary.laneCounts.hold, 0);
});

test('openKnowledgeToTasks and class wrapper emit schema-valid tasks and history', () => {
    const curator = new OpenKnowledgeCurator({
        localAgentId: 'agent:knowledge-local',
        now: () => 1_902_000
    });

    const report = curator.evaluate(baseInput());
    const tasks = openKnowledgeToTasks(report, {
        fromAgentId: 'agent:planner'
    });
    const classTasks = curator.buildTasks(report);

    assert.equal(tasks.length > 0, true);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(classTasks.length > 0, true);
    assert.equal(classTasks[0].from, 'agent:knowledge-local');
    assert.equal(curator.listHistory({ limit: 5 }).length, 1);
});
