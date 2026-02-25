import test from 'node:test';
import assert from 'node:assert/strict';
import { TelemetryPipeline } from '../index.js';

test('emit stores events and returns structured record', () => {
    const pipeline = new TelemetryPipeline({ now: () => 1000 });
    const record = pipeline.emit({
        eventType: 'task_created',
        source: 'orchestrator',
        payload: { taskId: 'abc' }
    });

    assert.equal(record.eventType, 'task_created');
    assert.equal(record.source, 'orchestrator');
    assert.deepStrictEqual(record.payload, { taskId: 'abc' });
    assert.equal(record.at, 1000);
    assert.ok(record.id);
});

test('emit notifies matching subscribers only', () => {
    const pipeline = new TelemetryPipeline();
    const received = [];
    const ignored = [];

    pipeline.subscribe((event) => received.push(event), {
        filter: (e) => e.eventType === 'task_created'
    });
    pipeline.subscribe((event) => ignored.push(event), {
        filter: (e) => e.eventType === 'task_failed'
    });

    pipeline.emit({ eventType: 'task_created', source: 'orchestrator' });
    pipeline.emit({ eventType: 'task_completed', source: 'orchestrator' });

    assert.equal(received.length, 1);
    assert.equal(received[0].eventType, 'task_created');
    assert.equal(ignored.length, 0);
});

test('unsubscribe stops delivery', () => {
    const pipeline = new TelemetryPipeline();
    const received = [];

    const subId = pipeline.subscribe((event) => received.push(event));
    pipeline.emit({ eventType: 'a', source: 'test' });
    assert.equal(received.length, 1);

    pipeline.unsubscribe(subId);
    pipeline.emit({ eventType: 'b', source: 'test' });
    assert.equal(received.length, 1);
});

test('subscriber errors do not break the pipeline', () => {
    const pipeline = new TelemetryPipeline();
    const received = [];

    pipeline.subscribe(() => { throw new Error('boom'); });
    pipeline.subscribe((event) => received.push(event));

    pipeline.emit({ eventType: 'test', source: 'test' });
    assert.equal(received.length, 1);
});

test('query filters by eventType, source, and time range', () => {
    const pipeline = new TelemetryPipeline();

    pipeline.emit({ eventType: 'task_created', source: 'orchestrator', at: 100 });
    pipeline.emit({ eventType: 'task_failed', source: 'orchestrator', at: 200 });
    pipeline.emit({ eventType: 'skill_registered', source: 'marketplace', at: 300 });
    pipeline.emit({ eventType: 'task_created', source: 'orchestrator', at: 400 });

    const byType = pipeline.query({ eventType: 'task_created' });
    assert.equal(byType.length, 2);

    const bySource = pipeline.query({ source: 'marketplace' });
    assert.equal(bySource.length, 1);

    const byTime = pipeline.query({ since: 150, until: 350 });
    assert.equal(byTime.length, 2);

    const combined = pipeline.query({
        eventType: 'task_created',
        source: 'orchestrator',
        since: 200
    });
    assert.equal(combined.length, 1);
    assert.equal(combined[0].at, 400);
});

test('query supports array filters for eventType and source', () => {
    const pipeline = new TelemetryPipeline();

    pipeline.emit({ eventType: 'task_created', source: 'orchestrator', at: 100 });
    pipeline.emit({ eventType: 'task_failed', source: 'sentinel', at: 200 });
    pipeline.emit({ eventType: 'skill_registered', source: 'marketplace', at: 300 });

    const results = pipeline.query({
        eventType: ['task_created', 'task_failed'],
        source: ['orchestrator', 'sentinel']
    });
    assert.equal(results.length, 2);
});

test('aggregate groups events by eventType within time window', () => {
    let now = 1000;
    const pipeline = new TelemetryPipeline({ now: () => now });

    pipeline.emit({ eventType: 'task_created', source: 'orchestrator', at: 200 });
    pipeline.emit({ eventType: 'task_created', source: 'orchestrator', at: 600 });
    pipeline.emit({ eventType: 'task_failed', source: 'orchestrator', at: 700 });
    pipeline.emit({ eventType: 'skill_probed', source: 'marketplace', at: 900 });

    // cutoff = 1000 - 500 = 500, so only events at 600, 700, 900 are included
    const agg = pipeline.aggregate({ windowMs: 500 });
    assert.equal(agg.totalEvents, 3);
    assert.equal(agg.groups['task_created'].count, 1);
    assert.equal(agg.groups['task_failed'].count, 1);
    assert.equal(agg.groups['skill_probed'].count, 1);

    const allAgg = pipeline.aggregate();
    assert.equal(allAgg.totalEvents, 4);
});

test('aggregate supports groupBy source', () => {
    const pipeline = new TelemetryPipeline();

    pipeline.emit({ eventType: 'task_created', source: 'orchestrator', at: 100 });
    pipeline.emit({ eventType: 'task_failed', source: 'orchestrator', at: 200 });
    pipeline.emit({ eventType: 'skill_probed', source: 'marketplace', at: 300 });

    const agg = pipeline.aggregate({ groupBy: 'source' });
    assert.equal(agg.groups['orchestrator'].count, 2);
    assert.equal(agg.groups['marketplace'].count, 1);
});

test('flush removes events older than maxAgeMs', () => {
    let now = 5000;
    const pipeline = new TelemetryPipeline({ maxAgeMs: 2000, now: () => now });

    pipeline.emit({ eventType: 'old', source: 'test', at: 1000 });
    pipeline.emit({ eventType: 'old', source: 'test', at: 2000 });
    pipeline.emit({ eventType: 'recent', source: 'test', at: 4000 });

    const result = pipeline.flush();
    assert.equal(result.removedCount, 2);
    assert.equal(result.remainingCount, 1);

    const remaining = pipeline.query();
    assert.equal(remaining.length, 1);
    assert.equal(remaining[0].eventType, 'recent');
});

test('maxEvents enforces event cap on emit', () => {
    const pipeline = new TelemetryPipeline({ maxEvents: 3 });

    for (let i = 0; i < 5; i++) {
        pipeline.emit({ eventType: `e${i}`, source: 'test', at: i * 100 });
    }

    const all = pipeline.query({ limit: 10 });
    assert.equal(all.length, 3);
    assert.equal(all[0].eventType, 'e2');
});

test('stats returns pipeline summary', () => {
    let now = 1000;
    const pipeline = new TelemetryPipeline({ now: () => now });

    pipeline.emit({ eventType: 'a', source: 'test', at: 500 });
    pipeline.emit({ eventType: 'b', source: 'test', at: 800 });

    pipeline.subscribe(() => {});

    const stats = pipeline.stats();
    assert.equal(stats.totalEvents, 2);
    assert.equal(stats.subscriberCount, 1);
    assert.equal(stats.oldestAt, 500);
    assert.equal(stats.newestAt, 800);
    assert.equal(stats.ageMs, 500);
});
