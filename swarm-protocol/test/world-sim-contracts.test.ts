import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildWorldSimBuildGraphTaskRequest,
    parseWorldSimBuildGraphTaskRequest,
    WorldSimBuildGraphTaskContext
} from '../index.js';

test('buildWorldSimBuildGraphTaskRequest emits a schema-valid task for agent:world-sim', () => {
    const task = buildWorldSimBuildGraphTaskRequest({
        from: 'agent:planner',
        request: {
            worldId: 'world-public-sentiment-001',
            projectId: 'mirofish-pilot',
            objective: 'Model likely public response to a new pricing policy',
            scenarioPrompt: 'Simulate a three-day public opinion cascade after a surprise policy announcement.',
            seedMaterials: [
                {
                    id: 'seed-1',
                    kind: 'news',
                    title: 'Policy draft summary',
                    inlineText: 'A draft policy changes pricing tiers for enterprise customers.'
                }
            ],
            tags: ['public-opinion', 'pricing', 'pilot']
        }
    });

    assert.equal(task.kind, 'task_request');
    assert.equal(task.target, 'agent:world-sim');
    assert.equal(task.priority, 'high');
    assert.equal(task.context.contract, 'world_sim_task');
    assert.equal(task.context.operation, 'build_world_graph');
    assert.equal(task.context.provider, 'mirofish');
    assert.equal(task.context.replyTarget, 'agent:planner');
    assert.equal(task.context.request.seedMaterials.length, 1);
});
test('parseWorldSimBuildGraphTaskRequest returns typed world-sim context', () => {
    const task = buildWorldSimBuildGraphTaskRequest({
        from: 'agent:main',
        correlationId: 'mission-42',
        request: {
            worldId: 'world-risk-042',
            projectId: 'risk-lab',
            objective: 'Build a scenario graph for a reputational incident drill',
            scenarioPrompt: 'Model the first 48 hours of discussion after an executive memo leaks.',
            seedMaterials: [
                {
                    id: 'seed-brief',
                    title: 'Internal memo excerpt',
                    kind: 'document',
                    notes: 'Leak contains internal language likely to trigger backlash.'
                }
            ],
            resultRouting: {
                artifactDir: 'reports/world-sim/world-risk-042',
                memoryContractType: 'report'
            }
        }
    });

    const parsed = parseWorldSimBuildGraphTaskRequest(task);
    const typedContext = WorldSimBuildGraphTaskContext.parse(parsed.context);

    assert.equal(parsed.from, 'agent:main');
    assert.equal(typedContext.correlationId, 'mission-42');
    assert.equal(typedContext.request.resultRouting.artifactDir, 'reports/world-sim/world-risk-042');
    assert.equal(typedContext.request.resultRouting.publishTaskResult, true);
});
