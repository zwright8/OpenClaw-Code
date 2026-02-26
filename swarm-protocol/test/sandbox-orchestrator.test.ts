import test from 'node:test';
import assert from 'node:assert/strict';
import {
    SandboxOrchestrator,
    SandboxOrchestratorError,
    buildTaskRequest,
    verifyReplayEvents
} from '../index.js';

function makeClock(start = 5_000) {
    let now = start;
    return {
        now: () => now,
        set: (value) => {
            now = value;
        },
        advance: (delta) => {
            now += delta;
        }
    };
}

test('selectProfile chooses privileged profile for sensitive capabilities', () => {
    const orchestrator = new SandboxOrchestrator();

    const task = buildTaskRequest({
        id: '11111111-1111-4111-8111-111111111111',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Rotate credentials',
        createdAt: 1_000,
        context: {
            requiredCapabilities: ['credential_access']
        }
    });

    const selected = orchestrator.selectProfile(task);
    assert.equal(selected.profile.id, 'privileged-controlled');
});

test('executeTask emits deterministic replay packet and verifiable event chain', async () => {
    const clock = makeClock(8_000);
    const orchestrator = new SandboxOrchestrator({
        now: clock.now,
        executor: {
            async run() {
                clock.advance(20);
                return {
                    status: 'success',
                    output: 'safe execution complete',
                    artifacts: [],
                    metrics: { durationMs: 20 }
                };
            }
        }
    });

    const task = buildTaskRequest({
        id: '22222222-2222-4222-8222-222222222222',
        from: 'agent:main',
        target: 'agent:worker',
        task: 'Summarize diagnostics',
        createdAt: 8_000,
        context: {
            requiredCapabilities: ['analysis']
        }
    });

    const result = await orchestrator.executeTask(task);
    assert.equal(result.status, 'success');

    const packet = orchestrator.getReplayPacket(result.replayToken);
    assert.ok(packet);
    assert.equal(packet.verification.ok, true);

    const direct = verifyReplayEvents(packet.events);
    assert.equal(direct.ok, true);
});

test('privileged execution requires escalation approval', async () => {
    const clock = makeClock(12_000);
    const orchestrator = new SandboxOrchestrator({
        now: clock.now,
        executor: {
            async run() {
                return {
                    status: 'success',
                    output: 'privileged executed',
                    artifacts: []
                };
            }
        }
    });

    const task = buildTaskRequest({
        id: '33333333-3333-4333-8333-333333333333',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'Run privileged patch sequence',
        priority: 'high',
        createdAt: 12_000,
        context: {
            requiredCapabilities: ['destructive_shell']
        }
    });

    await assert.rejects(
        () => orchestrator.executeTask(task),
        (error) => {
            assert.equal(error instanceof SandboxOrchestratorError, true);
            assert.equal(error.code, 'ESCALATION_REQUIRED');
            return true;
        }
    );

    const requested = orchestrator.requestEscalation(task, {
        reason: 'ops_maintenance_window'
    });
    assert.equal(requested.requested, true);
    assert.equal(requested.escalation.status, 'pending');

    const approved = orchestrator.reviewEscalation(requested.escalation.token, {
        approved: true,
        reviewer: 'human:ops',
        reason: 'approved for maintenance'
    });
    assert.equal(approved.status, 'approved');

    const result = await orchestrator.executeTask(task, {
        escalationToken: requested.escalation.token
    });
    assert.equal(result.status, 'success');
    assert.equal(result.escalationUsed, true);
});

test('reviewEscalation deny blocks execution', async () => {
    const orchestrator = new SandboxOrchestrator();

    const task = buildTaskRequest({
        id: '44444444-4444-4444-8444-444444444444',
        from: 'agent:main',
        target: 'agent:ops',
        task: 'Deploy risky patch',
        createdAt: 13_000,
        context: {
            requiredCapabilities: ['production_deploy']
        }
    });

    const requested = orchestrator.requestEscalation(task);
    orchestrator.reviewEscalation(requested.escalation.token, {
        approved: false,
        reviewer: 'human:ops',
        reason: 'insufficient context'
    });

    await assert.rejects(
        () => orchestrator.executeTask(task, {
            escalationToken: requested.escalation.token
        }),
        (error) => {
            assert.equal(error instanceof SandboxOrchestratorError, true);
            assert.equal(error.code, 'ESCALATION_NOT_APPROVED');
            return true;
        }
    );
});
