import fs from 'fs';
import path from 'path';
import { FileTaskStore, buildApprovalQueue, formatApprovalQueueMarkdown } from '../index.js';

function printHelp() {
    console.log(`Export pending task approvals

Usage:
  tsx scripts/export-approval-queue.ts [options]

Options:
  --store <path>      Task store journal path (default: ./state/tasks.journal.jsonl)
  --json <path>       Write queue JSON output
  --markdown <path>   Write queue markdown output
  -h, --help          Show help
`);
}

function parseArgs(argv) {
    const options = {
        storePath: path.resolve(process.cwd(), 'state/tasks.journal.jsonl'),
        jsonPath: null,
        markdownPath: null,
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
        if (token === '--json') {
            options.jsonPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--markdown') {
            options.markdownPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function ensureDir(filePath) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const store = new FileTaskStore({ filePath: options.storePath });
        const records = await store.loadRecords();
        const queue = buildApprovalQueue(records);

        console.log(`Pending approvals: ${queue.total}`);
        for (const item of queue.items) {
            console.log(`- ${item.taskId} priority=${item.priority} reviewerGroup=${item.reviewerGroup || '-'} task=${item.task}`);
        }

        if (options.jsonPath) {
            ensureDir(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(queue, null, 2)}\n`);
            console.log(`Approval queue JSON written to ${options.jsonPath}`);
        }

        if (options.markdownPath) {
            ensureDir(options.markdownPath);
            fs.writeFileSync(options.markdownPath, `${formatApprovalQueueMarkdown(queue)}\n`);
            console.log(`Approval queue Markdown written to ${options.markdownPath}`);
        }
    } catch (error) {
        console.error(`Approval queue export failed: ${error.message}`);
        process.exit(1);
    }
})();
