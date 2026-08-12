import path from 'path';
import { runQueueMaintenance } from '../src/queue-dispatcher.js';

function printHelp() {
    console.log(`Run queue maintenance for dispatched cognition tasks

Usage:
  tsx scripts/maintain-queue.ts [options]

Options:
  --store <path>        Queue store path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --outbox-dir <path>   Outbox directory for retry envelopes (default: ../swarm-protocol/state/outbox)
  --from-agent <id>     Local orchestrator agent id (default: agent:main)
  -h, --help            Show help
`);
}

function parseArgs(argv) {
    const options = {
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        outboxDir: path.resolve(process.cwd(), '../swarm-protocol/state/outbox'),
        localAgentId: 'agent:main',
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
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

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function printSummary(result) {
    console.log(`Loaded: ${result.loaded}`);
    console.log(`Checked: ${result.checked}`);
    console.log(`Scheduled retries: ${result.scheduledRetries}`);
    console.log(`Retried: ${result.retried}`);
    console.log(`Timed out: ${result.timedOut}`);
    console.log(`Transport failures: ${result.transportFailures}`);
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const result = await runQueueMaintenance({
            storePath: options.storePath,
            outboxDir: options.outboxDir,
            localAgentId: options.localAgentId
        });
        printSummary(result);
    } catch (error) {
        console.error(`maintain-queue failed: ${error.message}`);
        process.exit(1);
    }
})();
