import test from 'node:test';
import assert from 'node:assert/strict';
import {
    buildAutonomousEnterpriseOperatingModel,
    buildLeadToCashLaunchTaskRequest,
    buildLeadToCashWorkflowDefinition,
    parseLeadToCashLaunchTaskRequest
} from '../index.js';

test('buildAutonomousEnterpriseOperatingModel returns the core enterprise planes', () => {
    const model = buildAutonomousEnterpriseOperatingModel({
        companyName: 'OpenClaw Systems',
        productName: 'Autonomous Enterprise OS'
    });

    assert.equal(model.companyName, 'OpenClaw Systems');
    assert.ok(model.systems.some((system) => system.id === 'system:simulation'));
    assert.ok(model.systems.some((system) => system.id === 'system:billing' && system.sourceOfTruth));
    assert.ok(model.agents.some((agent) => agent.agentId === 'agent:world-sim'));
    assert.ok(model.agents.some((agent) => agent.agentId === 'agent:finance'));
    assert.ok(model.loops.includes('lead_to_cash'));
});

test('buildLeadToCashWorkflowDefinition emits a valid workflow with core dependencies', () => {
    const workflow = buildLeadToCashWorkflowDefinition({
        accountId: 'acct-123',
        accountName: 'Northwind',
        opportunityId: 'opp-456',
        productSku: 'sku-enterprise',
        offerSummary: 'Enterprise annual plan',
        primaryContactEmail: 'buyer@northwind.example',
        priceUsd: 120000
    });

    assert.ok(workflow.id.startsWith('lead-to-cash-'));
    assert.ok(workflow.nodes.some((node) => node.id === 'research_account'));
    assert.ok(workflow.nodes.some((node) => node.id === 'generate_quote'));
    assert.ok(workflow.nodes.some((node) => node.id === 'review_contract'));
    assert.ok(workflow.nodes.some((node) => node.id === 'provision_billing'));

    const onboarding = workflow.nodes.find((node) => node.id === 'launch_onboarding');
    assert.deepEqual(onboarding.dependencies, ['collect_signature', 'provision_billing']);
});

test('buildLeadToCashLaunchTaskRequest wraps workflow launch in a schema-valid task_request', () => {
    const task = buildLeadToCashLaunchTaskRequest({
        from: 'agent:executive',
        input: {
            accountId: 'acct-900',
            accountName: 'Contoso',
            opportunityId: 'opp-900',
            productSku: 'sku-platform',
            offerSummary: 'Platform subscription and onboarding',
            primaryContactEmail: 'cio@contoso.example',
            priceUsd: 48000,
            billingInterval: 'annual'
        }
    });

    const parsed = parseLeadToCashLaunchTaskRequest(task);

    assert.equal(task.kind, 'task_request');
    assert.equal(task.target, 'agent:revenue-ops');
    assert.equal(parsed.context.contract, 'enterprise_loop_launch');
    assert.equal(parsed.context.loopId, 'lead_to_cash');
    assert.ok(parsed.context.workflow.nodes.length >= 7);
});
