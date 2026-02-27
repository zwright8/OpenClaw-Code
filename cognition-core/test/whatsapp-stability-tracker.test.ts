import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { analyzeWhatsAppStability } from '../src/whatsapp-stability-tracker.js';

function tmpFile(content: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wa-stability-'));
  const file = path.join(dir, 'gateway.err.log');
  fs.writeFileSync(file, content);
  return file;
}

test('detects reconnect loops and disconnected current state', () => {
  const now = Date.parse('2026-02-27T15:00:00.000Z');
  const logPath = tmpFile([
    '2026-02-27T14:50:00.000Z [whatsapp] Web connection closed (status 503). Retry 1/12 in 2.0s',
    '2026-02-27T14:52:00.000Z [whatsapp] Web connection closed (status 503). Retry 1/12 in 2.0s',
    '2026-02-27T14:54:00.000Z [whatsapp] Web connection closed (status 503). Retry 1/12 in 2.0s',
    '2026-02-27T14:56:00.000Z [whatsapp] No messages received in 30m - restarting connection'
  ].join('\n'));

  const summary = analyzeWhatsAppStability(logPath, { nowMs: now, lookbackHours: 2 });

  assert.equal(summary.disconnects, 4);
  assert.equal(summary.restarts, 4);
  assert.equal(summary.currentState, 'disconnected');
  assert.equal(summary.loops.length, 1);
  assert.ok(summary.alerts.some((a) => a.code === 'reconnect_loop'));
  assert.ok(summary.alerts.some((a) => a.code === 'currently_disconnected'));
});

test('tracks reconnects and avoids loop alert when stable', () => {
  const now = Date.parse('2026-02-27T15:00:00.000Z');
  const logPath = tmpFile([
    '2026-02-27T14:00:00.000Z [whatsapp] Web connection closed (status 499). Retry 1/12 in 2.0s',
    '2026-02-27T14:02:00.000Z [whatsapp] gateway connected',
    '2026-02-27T14:30:00.000Z [whatsapp] Sending message -> sha256:abc123'
  ].join('\n'));

  const summary = analyzeWhatsAppStability(logPath, { nowMs: now, lookbackHours: 2 });

  assert.equal(summary.disconnects, 1);
  assert.equal(summary.reconnects, 1);
  assert.equal(summary.currentState, 'connected');
  assert.equal(summary.loops.length, 0);
  assert.equal(summary.alerts.some((a) => a.code === 'reconnect_loop'), false);
});
