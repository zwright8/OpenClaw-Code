import path from 'path';
import { dispatchCreatedQueueTasks } from '../src/queue-dispatcher.js';

function printHelp() {
    console.log(`Dispatch created cognition tasks from queue store

Usage:
  tsx scripts/dispatch-created-tasks.ts [options]

Options:
  --store <path>        Queue store path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --outbox-dir <path>   Outbox directory for dispatch envelopes (default: ../swarm-protocol/state/outbox)
  --from-agent <id>     Local orchestrator agent id (default: agent:main)
  --target <id>         Dispatch only tasks for this target
  --limit <n>           Max created tasks to dispatch (default: 50)
  --all-created         Include non-cognition created tasks
  --dry-run             Show selected tasks without dispatching
  -h, --help            Show help
`);
}

function parsePositiveInt(raw, flag) {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${flag} must be a positive integer`);
    }
    return value;
}

function parseArgs(argv) {
    const options = {
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        outboxDir: path.resolve(process.cwd(), '../swarm-protocol/state/outbox'),
        localAgentId: 'agent:main',
        target: null,
        limit: 50,
        includeAllCreated: false,
        dryRun: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--all-created') {
            options.includeAllCreated = true;
            continue;
        }
        if (token === '--dry-run') {
            options.dryRun = true;
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
        if (token === '--outbox-dir') {
            options.outboxDir = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--from-agent') {
            options.localAgentId = value;
            i++;
            continue;
        }
        if (token === '--target') {
            options.target = value;
            i++;
            continue;
        }
        if (token === '--limit') {
            options.limit = parsePositiveInt(value, '--limit');
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function printSummary(result) {
    console.log(`Loaded: ${result.stats.loaded}`);
    console.log(`Selected: ${result.stats.selected}`);
    console.log(`Dispatched: ${result.stats.dispatched}`);
    console.log(`Awaiting approval: ${result.stats.awaitingApproval}`);
    console.log(`Failed: ${result.stats.failed}`);
    console.log(`Skipped invalid: ${result.stats.skippedInvalid}`);
    console.log(`Skipped non-cognition: ${result.stats.skippedNonCognition}`);
    if (result.stats.dryRun) {
        console.log('Dry run: no dispatch performed.');
    }

    for (const taskId of result.dispatchedTaskIds) {
        console.log(`- dispatched ${taskId}`);
    }
    for (const taskId of result.awaitingApprovalTaskIds) {
        console.log(`- awaiting_approval ${taskId}`);
    }
    for (const item of result.failed) {
        console.log(`- failed ${item.taskId}: ${item.reason}`);
    }
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const result = await dispatchCreatedQueueTasks({
            storePath: options.storePath,
            outboxDir: options.outboxDir,
            localAgentId: options.localAgentId,
            target: options.target,
            limit: options.limit,
            includeAllCreated: options.includeAllCreated,
            dryRun: options.dryRun
        });
        printSummary(result);
    } catch (error) {
        console.error(`dispatch-created-tasks failed: ${error.message}`);
        process.exit(1);
    }
})();
