import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { FileTaskStore } from '../index.js';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'swarm-task-store-'));
}

test('saveRecord/loadRecords/deleteRecord roundtrip', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const filePath = path.join(dir, 'tasks.journal.jsonl');
    const store = new FileTaskStore({ filePath, now: () => 1_000 });

    await store.saveRecord({ taskId: 'a', status: 'dispatched', attempts: 1 });
    await store.saveRecord({ taskId: 'b', status: 'completed', attempts: 2 });
    await store.saveRecord({ taskId: 'a', status: 'completed', attempts: 2 });
    await store.deleteRecord('b');

    const records = await store.loadRecords();
    assert.equal(records.length, 1);
    assert.equal(records[0].taskId, 'a');
    assert.equal(records[0].status, 'completed');
});

test('compact rewrites file to snapshot and preserves records', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const filePath = path.join(dir, 'tasks.journal.jsonl');
    const store = new FileTaskStore({ filePath, now: () => 2_000 });

    await store.saveRecord({ taskId: 'a', status: 'dispatched', attempts: 1 });
    await store.saveRecord({ taskId: 'b', status: 'completed', attempts: 1 });
    await store.compact([
        { taskId: 'a', status: 'completed', attempts: 3 },
        { taskId: 'c', status: 'dispatched', attempts: 1 }
    ]);

    const content = fs.readFileSync(filePath, 'utf8').trim().split('\n');
    assert.equal(content.length, 1);

    const records = await store.loadRecords();
    assert.equal(records.length, 2);
    const byId = Object.fromEntries(records.map((record) => [record.taskId, record]));
    assert.equal(byId.a.status, 'completed');
    assert.equal(byId.c.status, 'dispatched');
});

test('loadRecords skips malformed lines', async (t) => {
    const dir = mkTmpDir();
    t.after(() => fs.rmSync(dir, { recursive: true, force: true }));

    const filePath = path.join(dir, 'tasks.journal.jsonl');
    fs.writeFileSync(filePath, '{bad-json}\n');
    fs.appendFileSync(filePath, `${JSON.stringify({
        type: 'upsert',
        taskId: 'x',
        at: 1,
        record: { taskId: 'x', status: 'dispatched' }
    })}\n`);

    const store = new FileTaskStore({
        filePath,
        logger: {
            warn() {}
        }
    });

    const records = await store.loadRecords();
    assert.equal(records.length, 1);
    assert.equal(records[0].taskId, 'x');
});
