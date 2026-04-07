import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import {
    FileAuditLogStore,
    SignedAuditLog,
    signAuditEntry,
    verifySignedAuditEntry
} from '../index.js';

function mkTmpDir() {
    return fs.mkdtempSync(path.join(os.tmpdir(), 'swarm-audit-'));
}

test('signAuditEntry + verifySignedAuditEntry roundtrip', () => {
    const signed = signAuditEntry(
        {
            id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
            at: 1_000,
            eventType: 'task_created',
            actor: 'agent:main',
            payload: { taskId: 't1' }
        },
        {
            secret: 'test-secret',
            keyId: 'k1'
        }
    );

    const verified = verifySignedAuditEntry(signed, {
        secret: 'test-secret'
    });

    assert.equal(verified.ok, true);
});

test('SignedAuditLog verifies chain and detects tampering', () => {
    const log = new SignedAuditLog({ secret: 'chain-secret' });
    log.append({ at: 10, eventType: 'task_created', payload: { taskId: 'a' } });
    log.append({ at: 20, eventType: 'task_send_success', payload: { taskId: 'a' } });

    const entries = log.listEntries();
    assert.equal(log.verifyChain(entries).ok, true);

    entries[1].payload.taskId = 'tampered';
    const tampered = log.verifyChain(entries);
    assert.equal(tampered.ok, false);
    assert.equal(tampered.failedAt, 1);
});

test('FileAuditLogStore append/load roundtrip and skips malformed lines', () => {
    const dir = mkTmpDir();
    const filePath = path.join(dir, 'audit.log.jsonl');
    const store = new FileAuditLogStore({ filePath });

    store.append({ id: '1', eventType: 'a' });
    fs.appendFileSync(filePath, '{bad json\n');
    store.append({ id: '2', eventType: 'b' });

    const loaded = store.loadEntries();
    assert.equal(loaded.length, 2);
    assert.equal(loaded[0].id, '1');
    assert.equal(loaded[1].id, '2');
});
