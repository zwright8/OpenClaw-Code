import test from 'node:test';
import assert from 'node:assert/strict';
import {
    compileMissionPlan,
    missionPlanToTaskRequests,
    missionPlanToWorkflowDefinition,
    validateWorkflowDefinition
} from '../index.js';

test('compileMissionPlan builds validated workflow DAG for analysis objective', () => {
    const plan = compileMissionPlan({
        objective: 'Generate a weekly reliability analysis report for API failures',
        context: {
            source: 'telemetry'
        },
        globalRequiredCapabilities: ['analysis']
    });

    assert.ok(plan.missionId.startsWith('mission-'));
    assert.equal(plan.profileId, 'analysis_reporting');
    assert.ok(plan.nodes.length >= 4);

    const workflow = missionPlanToWorkflowDefinition(plan);
    assert.equal(workflow.id, plan.missionId);
    assert.ok(workflow.nodes.length >= 4);
    assert.ok(validateWorkflowDefinition(workflow));
});

test('deploy objective maps to change-management profile with risk hints', () => {
    const plan = compileMissionPlan({
        objective: 'Deploy production migration for billing service',
        preferredTarget: 'agent:ops',
        globalRequiredCapabilities: ['operations']
    });

    assert.equal(plan.profileId, 'change_management');
    assert.equal(plan.riskSummary.level, 'high');

    const executeStep = plan.nodes.find((node) => node.id === 'execute_change');
    assert.ok(executeStep);
    assert.equal(executeStep.priority, 'critical');
    assert.equal(executeStep.approvalHint, 'required');
    assert.equal(executeStep.sandboxProfileHint, 'privileged-controlled');
    assert.equal(executeStep.target, 'agent:ops');
});

test('incident objective compiles with ordered dependencies and remediation flow', () => {
    const plan = compileMissionPlan({
        objective: 'Handle SEV1 incident and recover degraded checkout service',
        defaultPriority: 'high'
    });

    assert.equal(plan.profileId, 'incident_response');

    const triage = plan.nodes.find((node) => node.id === 'triage_incident');
    const contain = plan.nodes.find((node) => node.id === 'contain_blast_radius');
    const remediate = plan.nodes.find((node) => node.id === 'remediate_root_cause');
    assert.ok(triage && contain && remediate);
    assert.deepEqual(contain.dependencies, ['triage_incident']);
    assert.deepEqual(remediate.dependencies, ['contain_blast_radius']);
});

test('missionPlanToTaskRequests emits schema-valid task_request messages', () => {
    const plan = compileMissionPlan({
        objective: 'Summarize customer onboarding funnel issues'
    });

    const tasks = missionPlanToTaskRequests(plan, {
        fromAgentId: 'agent:planner',
        createdAt: 2_000
    });

    assert.equal(tasks.length, plan.nodes.length);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:planner');
    assert.equal(typeof tasks[0].task, 'string');
});
