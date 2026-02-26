import test from 'node:test';
import assert from 'node:assert/strict';
import {
    CapabilityMarketplace,
    buildSkillMetadataContract,
    buildTaskRequest
} from '../index.js';

function createMarketplace(nowMs = 10_000) {
    let time = nowMs;
    return {
        market: new CapabilityMarketplace({ now: () => time }),
        setNow: (value) => {
            time = value;
        }
    };
}

function registerFixtures(market) {
    market.registerSkill({
        id: 'skill:analysis-fast',
        name: 'Fast Analyst',
        endpointAgentId: 'agent:analysis-fast',
        capabilities: ['analysis', 'reporting'],
        qualityScore: 0.88,
        costUsdPerTask: 5.2,
        latencyMsP50: 90,
        riskLevel: 'medium'
    });

    market.registerSkill({
        id: 'skill:analysis-cheap',
        name: 'Cheap Analyst',
        endpointAgentId: 'agent:analysis-cheap',
        capabilities: ['analysis'],
        qualityScore: 0.81,
        costUsdPerTask: 1.2,
        latencyMsP50: 180,
        riskLevel: 'low'
    });

    market.registerSkill({
        id: 'skill:ops',
        name: 'Ops Specialist',
        endpointAgentId: 'agent:ops',
        capabilities: ['operations', 'deploy'],
        qualityScore: 0.9,
        costUsdPerTask: 3,
        latencyMsP50: 150,
        riskLevel: 'high'
    });
}

test('registerSkillContract validates and upserts skill metadata', () => {
    const { market } = createMarketplace();

    const contract = buildSkillMetadataContract({
        id: '11111111-aaaa-4111-8111-111111111111',
        createdBy: 'agent:builder',
        createdAt: 10_000,
        skill: {
            id: 'skill:new',
            name: 'New Skill',
            endpointAgentId: 'agent:new',
            capabilities: ['analysis'],
            qualityScore: 0.8,
            costUsdPerTask: 1,
            latencyMsP50: 120,
            riskLevel: 'low'
        }
    });

    const result = market.registerSkillContract(contract);
    assert.equal(result.skill.id, 'skill:new');
    assert.equal(market.listSkills().length, 1);
});

test('probeSkill updates verification stats and degrade/active status', async () => {
    const { market } = createMarketplace();
    registerFixtures(market);

    const ok = await market.probeSkill('skill:analysis-fast', async () => ({
        ok: true,
        details: 'healthy'
    }));
    assert.equal(ok.ok, true);
    assert.equal(ok.verification.successes, 1);

    const failed = await market.probeSkill('skill:analysis-fast', async () => {
        throw new Error('network failure');
    });
    assert.equal(failed.ok, false);

    const skill = market.getSkill('skill:analysis-fast');
    assert.equal(skill.status, 'degraded');
    assert.equal(skill.verification.failures, 1);
    assert.equal(skill.verification.consecutiveFailures, 1);
});

test('evaluateRetirements auto-retires stale/failing skills', async () => {
    const { market, setNow } = createMarketplace();
    registerFixtures(market);

    for (let i = 0; i < 3; i++) {
        await market.probeSkill('skill:analysis-cheap', async () => ({ ok: false, error: 'bad' }));
    }

    const outcome = market.evaluateRetirements({
        maxConsecutiveFailures: 3
    });

    assert.equal(outcome.retired.length, 1);
    assert.equal(outcome.retired[0].skillId, 'skill:analysis-cheap');

    setNow(10_000 + (8 * 24 * 60 * 60 * 1000));
    await market.probeSkill('skill:ops', async () => ({ ok: true }));
    setNow(10_000 + (16 * 24 * 60 * 60 * 1000));
    const stale = market.evaluateRetirements({
        staleAfterMs: 5 * 24 * 60 * 60 * 1000
    });

    assert.ok(stale.retired.some((item) => item.skillId === 'skill:ops'));
});

test('selectSkillForTask routes by capabilities and scoring', async () => {
    const { market } = createMarketplace();
    registerFixtures(market);

    await market.probeSkill('skill:analysis-fast', async () => ({ ok: true }));
    await market.probeSkill('skill:analysis-cheap', async () => ({ ok: true }));

    const task = buildTaskRequest({
        id: '22222222-bbbb-4222-8222-222222222222',
        from: 'agent:main',
        task: 'Analyze incident timeline',
        priority: 'high',
        createdAt: 10_100,
        context: {
            requiredCapabilities: ['analysis']
        }
    });

    const selection = market.selectSkillForTask(task);
    assert.ok(selection.selectedSkillId);
    assert.ok(selection.selectedAgentId);
    assert.equal(selection.ranked[0].eligible, true);

    const routeTask = market.createRouteTaskFn();
    const routed = await routeTask(task);
    assert.equal(routed.selectedAgentId, selection.selectedAgentId);
});
