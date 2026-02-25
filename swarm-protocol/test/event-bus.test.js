import test from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../index.js';

test('subscribe and emit delivers to handler', () => {
    const bus = new EventBus();
    const received = [];
    bus.subscribe('task.created', (event) => received.push(event));

    const result = bus.emit('task.created', { taskId: '123' });
    assert.equal(result.delivered, 1);
    assert.equal(received.length, 1);
    assert.equal(received[0].channel, 'task.created');
    assert.deepEqual(received[0].payload, { taskId: '123' });
});

test('wildcard subscription receives all events', () => {
    const bus = new EventBus();
    const received = [];
    bus.subscribe('*', (event) => received.push(event));

    bus.emit('task.created', {});
    bus.emit('agent.failed', {});
    assert.equal(received.length, 2);
});

test('prefix wildcard matches channel family', () => {
    const bus = new EventBus();
    const received = [];
    bus.subscribe('task.*', (event) => received.push(event));

    bus.emit('task.created', {});
    bus.emit('task.completed', {});
    bus.emit('agent.failed', {});
    assert.equal(received.length, 2);
});

test('unsubscribe removes handler', () => {
    const bus = new EventBus();
    const received = [];
    const id = bus.subscribe('test', (event) => received.push(event));

    bus.emit('test', {});
    assert.equal(received.length, 1);

    bus.unsubscribe(id);
    bus.emit('test', {});
    assert.equal(received.length, 1);
});

test('emit catches handler errors without stopping delivery', () => {
    const bus = new EventBus();
    const received = [];
    bus.subscribe('chan', () => { throw new Error('boom'); });
    bus.subscribe('chan', (event) => received.push(event));

    const result = bus.emit('chan', {});
    assert.equal(result.delivered, 2);
    assert.equal(result.results[0].ok, false);
    assert.equal(result.results[1].ok, true);
    assert.equal(received.length, 1);
});

test('emitAsync delivers to async handlers', async () => {
    const bus = new EventBus();
    const received = [];
    bus.subscribe('async.test', async (event) => {
        received.push(event);
    });

    const result = await bus.emitAsync('async.test', { v: 1 });
    assert.equal(result.delivered, 1);
    assert.equal(received.length, 1);
});

test('emitAsync catches async handler errors', async () => {
    const bus = new EventBus();
    bus.subscribe('fail', async () => { throw new Error('async boom'); });

    const result = await bus.emitAsync('fail', {});
    assert.equal(result.results[0].ok, false);
    assert.ok(result.results[0].error.includes('async boom'));
});

test('getHistory returns recent events', () => {
    const bus = new EventBus();
    bus.emit('a', { n: 1 });
    bus.emit('b', { n: 2 });
    bus.emit('a', { n: 3 });

    const all = bus.getHistory();
    assert.equal(all.length, 3);

    const onlyA = bus.getHistory({ channel: 'a' });
    assert.equal(onlyA.length, 2);
});

test('getHistory respects limit', () => {
    const bus = new EventBus();
    for (let i = 0; i < 10; i++) {
        bus.emit('ch', { i });
    }

    const limited = bus.getHistory({ limit: 3 });
    assert.equal(limited.length, 3);
    assert.equal(limited[0].payload.i, 7);
});

test('listSubscriptions returns active subscriptions', () => {
    const bus = new EventBus();
    bus.subscribe('a', () => {});
    bus.subscribe('b', () => {});

    const subs = bus.listSubscriptions();
    assert.equal(subs.length, 2);
    assert.ok(subs.some((s) => s.channel === 'a'));
    assert.ok(subs.some((s) => s.channel === 'b'));
});

test('clear removes all subscriptions and history', () => {
    const bus = new EventBus();
    bus.subscribe('x', () => {});
    bus.emit('x', {});
    bus.clear();

    assert.equal(bus.listSubscriptions().length, 0);
    assert.equal(bus.getHistory().length, 0);
});

test('subscribe rejects invalid arguments', () => {
    const bus = new EventBus();
    assert.throws(() => bus.subscribe('', () => {}));
    assert.throws(() => bus.subscribe('ch', 'not a function'));
});

test('emit rejects empty channel', () => {
    const bus = new EventBus();
    assert.throws(() => bus.emit('', {}));
});
