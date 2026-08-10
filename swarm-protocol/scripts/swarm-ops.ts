import path from 'path';
import {
    FileAuditLogStore,
    FileTaskStore,
    collectLifecycleEvents,
    drainTarget,
    listQueue,
    overrideApproval,
    recoverStaleDispatchRecord,
    replayTask,
    rerouteTaskRecord,
    signAuditEntry,
    summarizeTaskRecords,
    verifySignedAuditEntry
} from '../runtime.js';

function printHelp() {
    console.log(`Swarm operator control plane

Usage:
  tsx scripts/swarm-ops.ts <command> [args] [options]

Commands:
  status
  queue [--approvals] [--target <agent>] [--limit <n>]
  replay <taskId>
  tail [--task <taskId>] [--target <agent>] [--limit <n>]
  reroute <taskId> <newTarget> [--actor <id>] [--reason <text>]
  drain <target> [--redirect <newTarget>] [--actor <id>] [--reason <text>]
  override <approve|deny> <taskId> [--actor <id>] [--reason <text>]
  recover-dispatch <decision> <taskId> [--fingerprint <sha256>] [--stale-ms <n>] [--side-effect <status>] [--correlation <id>] [--evidence <csv>] [--notes <text>] [--actor <id>] [--reason <text>]
  audit-verify

Global options:
  --store <path>   Task store path (default: ./state/tasks.journal.jsonl)
  --audit <path>   Operator audit path (default: ./state/operator-audit.jsonl)
  --secret <text>  Audit signing secret (default: SWARM_AUDIT_SECRET env)
  -h, --help       Show help
`);
}

function parseArgs(argv) {
    if (argv.length === 0) {
        return { command: null, positional: [], options: { help: true } };
    }

    const options = {
        storePath: path.resolve(process.cwd(), 'state/tasks.journal.jsonl'),
        auditPath: path.resolve(process.cwd(), 'state/operator-audit.jsonl'),
        secret: process.env.SWARM_AUDIT_SECRET || null,
        actor: 'human:ops',
        reason: null,
        help: false,
        approvals: false,
        target: null,
        task: null,
        redirect: null,
        sideEffect: 'unknown',
        correlation: null,
        evidence: null,
        notes: null,
        fingerprint: null,
        staleDispatchMs: 30 * 60 * 1000,
        limit: 25
    };

    const positional = [];
    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }

        if (!token.startsWith('--')) {
            positional.push(token);
            continue;
        }

        if (token === '--approvals') {
            options.approvals = true;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--audit') {
            options.auditPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--secret') {
            options.secret = value;
            i++;
            continue;
        }
        if (token === '--actor') {
            options.actor = value;
            i++;
            continue;
        }
        if (token === '--reason') {
            options.reason = value;
            i++;
            continue;
        }
        if (token === '--target') {
            options.target = value;
            i++;
            continue;
        }
        if (token === '--task') {
            options.task = value;
            i++;
            continue;
        }
        if (token === '--redirect') {
            options.redirect = value;
            i++;
            continue;
        }
        if (token === '--side-effect') {
            options.sideEffect = value;
            i++;
            continue;
        }
        if (token === '--correlation') {
            options.correlation = value;
            i++;
            continue;
        }
        if (token === '--evidence') {
            options.evidence = value;
            i++;
            continue;
        }
        if (token === '--notes') {
            options.notes = value;
            i++;
            continue;
        }

        if (token === '--stale-ms') {
            options.staleDispatchMs = Number(value);
            if (!Number.isFinite(options.staleDispatchMs) || options.staleDispatchMs <= 0) {
                throw new Error('--stale-ms must be a positive number');
            }
            i++;
            continue;
        }
        if (token === '--fingerprint') {
            options.fingerprint = value;
            i++;
            continue;
        }
        if (token === '--limit') {
            options.limit = Math.max(1, Number.parseInt(value, 10) || 25);
            i++;
            continue;
        }

        throw new Error(`Unknown option: ${token}`);
    }

    const [command = null, ...rest] = positional;
    return {
        command,
        positional: rest,
        options
    };
}

function requireSecret(secret) {
    if (typeof secret === 'string' && secret.length > 0) return secret;
    throw new Error('Mutating commands require --secret (or SWARM_AUDIT_SECRET)');
}

function verifyAuditChain(entries, secret) {
    let previousHash = null;
    for (let index = 0; index < entries.length; index++) {
        const verification = verifySignedAuditEntry(entries[index], {
            secret,
            expectedPreviousHash: previousHash
        });
        if (!verification.ok) {
            return {
                ok: false,
                failedAt: index,
                reason: verification.reason
            };
        }
        previousHash = entries[index].digest;
    }

    return {
        ok: true,
        count: entries.length
    };
}

function appendAuditEntry(auditStore, secret, eventType, actor, payload) {
    const existing = auditStore.loadEntries();
    const previousHash = existing.length > 0
        ? existing[existing.length - 1].digest
        : null;

    const signed = signAuditEntry({
        eventType,
        actor,
        payload
    }, {
        secret,
        keyId: 'operator',
        previousHash
    });

    auditStore.append(signed);
    return signed;
}

function printQueue(rows) {
    if (rows.length === 0) {
        console.log('Queue is empty.');
        return;
    }

    for (const row of rows) {
        const age = row.ageMs === null || row.ageMs === undefined
            ? 'unknown'
            : `${Math.floor(row.ageMs / 1000)}s`;
        const deadline = row.deadlineInMs === null || row.deadlineInMs === undefined
            ? 'none'
            : row.overdue ? `overdue=${Math.floor(Math.abs(row.deadlineInMs) / 1000)}s`
                : `due_in=${Math.floor(row.deadlineInMs / 1000)}s`;
        const retry = row.retryInMs === null || row.retryInMs === undefined
            ? 'none'
            : row.retryInMs <= 0 ? 'ready' : `in=${Math.floor(row.retryInMs / 1000)}s`;
        console.log(`${row.taskId} status=${row.status} target=${row.target} priority=${row.priority} attempts=${row.attempts} age=${age} deadline=${deadline} retry=${retry}`);
        console.log(`  task=${row.task}`);
    }
}

function printEvents(events) {
    if (events.length === 0) {
        console.log('No events found.');
        return;
    }

    for (const event of events) {
        console.log(`${event.at} task=${event.taskId} target=${event.target} event=${event.event}`);
    }
}

(async () => {
    try {
        const parsed = parseArgs(process.argv.slice(2));
        if (parsed.options.help || !parsed.command) {
            printHelp();
            return;
        }

        const { command, positional, options } = parsed;
        const store = new FileTaskStore({ filePath: options.storePath });
        const auditStore = new FileAuditLogStore({ filePath: options.auditPath });

        const records = await store.loadRecords();

        if (command === 'status') {
            const summary = summarizeTaskRecords(records);
            console.log(`total=${summary.total} open=${summary.open} terminal=${summary.terminal} pendingApprovals=${summary.pendingApprovals}`);
            console.log(`openAgeMs.oldest=${summary.openAgeMs.oldest} openAgeMs.average=${summary.openAgeMs.average} openAgeMs.p95=${summary.openAgeMs.p95} oldestOpenTaskId=${summary.oldestOpenTaskId || 'none'}`);
            console.log('By status:');
            for (const [status, count] of Object.entries(summary.byStatus)) {
                console.log(`- ${status}: ${count}`);
            }
            return;
        }

        if (command === 'queue') {
            const queue = listQueue(records, {
                approvalsOnly: options.approvals,
                target: options.target,
                limit: options.limit
            });
            printQueue(queue);
            return;
        }

        if (command === 'replay') {
            const taskId = positional[0];
            if (!taskId) throw new Error('Usage: replay <taskId>');
            const replay = replayTask(records, taskId);
            if (!replay) {
                console.log(`Task not found: ${taskId}`);
                return;
            }
            console.log(`taskId=${replay.taskId} status=${replay.status} target=${replay.target} attempts=${replay.attempts}`);
            printEvents(replay.history.map((item) => ({
                at: item.at,
                taskId: replay.taskId,
                target: replay.target,
                event: item.event
            })));
            return;
        }

        if (command === 'tail') {
            const events = collectLifecycleEvents(records, {
                taskId: options.task,
                target: options.target,
                limit: options.limit
            });
            printEvents(events);
            return;
        }

        if (command === 'audit-verify') {
            const secret = requireSecret(options.secret);
            const entries = auditStore.loadEntries();
            const verification = verifyAuditChain(entries, secret);
            if (!verification.ok) {
                console.log(`Audit chain invalid at index=${verification.failedAt} reason=${verification.reason}`);
                process.exitCode = 2;
                return;
            }
            console.log(`Audit chain verified. entries=${verification.count}`);
            return;
        }

        if (command === 'reroute') {
            const secret = requireSecret(options.secret);
            const taskId = positional[0];
            const newTarget = positional[1];
            if (!taskId || !newTarget) throw new Error('Usage: reroute <taskId> <newTarget>');

            const result = rerouteTaskRecord(records, taskId, newTarget, {
                actor: options.actor,
                reason: options.reason || 'manual_reroute'
            });

            await store.compact(result.records);
            appendAuditEntry(auditStore, secret, 'operator_reroute', options.actor, {
                taskId,
                newTarget,
                reason: options.reason || 'manual_reroute'
            });
            console.log(`Rerouted ${taskId} -> ${newTarget}`);
            return;
        }

        if (command === 'drain') {
            const secret = requireSecret(options.secret);
            const target = positional[0];
            if (!target) throw new Error('Usage: drain <target> [--redirect <newTarget>]');

            const result = drainTarget(records, target, {
                redirectTarget: options.redirect,
                actor: options.actor,
                reason: options.reason || 'manual_drain'
            });

            await store.compact(result.records);
            appendAuditEntry(auditStore, secret, 'operator_drain', options.actor, {
                target,
                redirectTarget: options.redirect || null,
                affectedTasks: result.updated.map((record) => record.taskId),
                reason: options.reason || 'manual_drain'
            });
            console.log(`Drain applied for ${target}. affected=${result.updated.length}`);
            return;
        }

        if (command === 'override') {
            const secret = requireSecret(options.secret);
            const action = positional[0];
            const taskId = positional[1];
            if (!action || !taskId) throw new Error('Usage: override <approve|deny> <taskId>');
            if (action !== 'approve' && action !== 'deny') {
                throw new Error('override action must be approve or deny');
            }

            const approved = action === 'approve';
            const result = overrideApproval(records, taskId, {
                approved,
                actor: options.actor,
                reason: options.reason || (approved ? 'manual_override_approve' : 'manual_override_deny')
            });

            await store.compact(result.records);
            appendAuditEntry(auditStore, secret, 'operator_override', options.actor, {
                taskId,
                approved,
                reason: options.reason || (approved ? 'manual_override_approve' : 'manual_override_deny')
            });
            console.log(`Override ${action} applied for ${taskId}`);
            return;
        }

        if (command === 'recover-dispatch') {
            const secret = requireSecret(options.secret);
            const decision = positional[0];
            const taskId = positional[1];
            if (!decision || !taskId) {
                throw new Error('Usage: recover-dispatch <decision> <taskId>');
            }

            const evidenceReviewed = typeof options.evidence === 'string'
                ? options.evidence.split(',').map((item) => item.trim()).filter(Boolean)
                : [];
            const result = recoverStaleDispatchRecord(records, taskId, decision, {
                actor: options.actor,
                reason: options.reason || 'manual_stale_dispatch_recovery',
                sideEffectStatus: options.sideEffect,
                externalRuntimeCorrelation: options.correlation,
                evidenceReviewed,
                notes: options.notes,
                expectedDispatchFingerprint: options.fingerprint,
                staleDispatchMs: options.staleDispatchMs
            });

            await store.compact(result.records);
            appendAuditEntry(auditStore, secret, 'operator_stale_dispatch_recovery', options.actor, {
                taskId,
                decision: result.decision,
                previousStatus: result.previousStatus,
                status: result.updated.status,
                reason: options.reason || 'manual_stale_dispatch_recovery',
                sideEffectStatus: options.sideEffect,
                externalRuntimeCorrelation: result.updated.recoveryDecision?.externalRuntimeCorrelation || null,
                evidenceReviewed,
                dispatchFingerprint: result.updated.recoveryDecision?.dispatchFingerprint || null
            });
            console.log(`Recovery ${result.decision} applied for ${taskId}; status=${result.updated.status}`);
            return;
        }

        throw new Error(`Unknown command: ${command}`);
    } catch (error) {
        console.error(`swarm-ops failed: ${error.message}`);
        process.exit(1);
    }
})();
