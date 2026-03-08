import path from 'path';
import { autoReviewAwaitingApprovals } from '../src/approval-auto-review.js';

function printHelp() {
    console.log(`Auto-review awaiting approvals in queue

Usage:
  tsx scripts/auto-review-approvals.ts [options]

Options:
  --store <path>            Queue store path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --outbox-dir <path>       Outbox directory (default: ../swarm-protocol/state/outbox)
  --from-agent <id>         Local orchestrator agent id (default: agent:main)
  --reviewer <id>           Reviewer id recorded in approval history (default: agent:auto-review)
  --limit <n>               Max awaiting approvals to evaluate (default: 25)
  --deny-unsupported        Deny unsupported/blocked rules instead of skipping
  --include-non-cognition   Include non-cognition awaiting approvals
  --allow-unmatched         Allow approvals with no matchedRules metadata
  --dry-run                 Show decisions without mutating queue
  -h, --help                Show help
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
        reviewer: 'agent:auto-review',
        limit: 25,
        denyUnsupported: false,
        includeNonCognition: false,
        allowUnmatchedRules: false,
        dryRun: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--deny-unsupported') {
            options.denyUnsupported = true;
            continue;
        }
        if (token === '--include-non-cognition') {
            options.includeNonCognition = true;
            continue;
        }
        if (token === '--allow-unmatched') {
            options.allowUnmatchedRules = true;
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
        if (token === '--reviewer') {
            options.reviewer = value;
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
    console.log(`Pending approvals: ${result.stats.pendingTotal}`);
    console.log(`Selected: ${result.stats.selected}`);
    console.log(`Approved: ${result.stats.approved}`);
    console.log(`Denied: ${result.stats.denied}`);
    console.log(`Skipped: ${result.stats.skipped}`);
    console.log(`Approval failures: ${result.stats.approvalFailed}`);
    console.log(`Dispatched after approval: ${result.stats.dispatchedAfterApproval}`);
    if (result.stats.dryRun) {
        console.log('Dry run: no changes applied.');
    }
    for (const [reason, count] of Object.entries(result.decisionReasons)) {
        console.log(`- reason ${reason}: ${count}`);
    }
    for (const taskId of result.approvedTaskIds) {
        console.log(`- approved ${taskId}`);
    }
    for (const taskId of result.deniedTaskIds) {
        console.log(`- denied ${taskId}`);
    }
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const result = await autoReviewAwaitingApprovals({
            storePath: options.storePath,
            outboxDir: options.outboxDir,
            localAgentId: options.localAgentId,
            reviewer: options.reviewer,
            limit: options.limit,
            denyUnsupported: options.denyUnsupported,
            includeNonCognition: options.includeNonCognition,
            allowUnmatchedRules: options.allowUnmatchedRules,
            dryRun: options.dryRun
        });
        printSummary(result);
    } catch (error) {
        console.error(`auto-review-approvals failed: ${error.message}`);
        process.exit(1);
    }
})();
