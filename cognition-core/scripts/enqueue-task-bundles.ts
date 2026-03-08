import fs from 'fs';
import path from 'path';
import {
    enqueueTaskEntries,
    extractTaskEntriesFromBundle
} from '../src/task-bundle-enqueuer.js';

function printHelp() {
    console.log(`Enqueue cognition task bundles into swarm task store

Usage:
  tsx scripts/enqueue-task-bundles.ts [options]

Options:
  --bundle <path>        Task bundle JSON path (repeatable)
  --store <path>         Task store path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --actor <id>           Actor id recorded in history (default: agent:cognition-core)
  --allow-duplicates     Disable open-task fingerprint dedupe
  --dry-run              Compute enqueue plan without writing records
  -h, --help             Show help
`);
}

function parseArgs(argv) {
    const reportsDir = path.resolve(process.cwd(), 'reports');
    const options = {
        bundles: [],
        customBundles: false,
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        actor: 'agent:cognition-core',
        allowDuplicates: false,
        dryRun: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];

        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--allow-duplicates') {
            options.allowDuplicates = true;
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

        if (token === '--bundle') {
            options.bundles.push(path.resolve(process.cwd(), value));
            options.customBundles = true;
            i++;
            continue;
        }
        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--actor') {
            options.actor = value;
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    if (options.bundles.length === 0) {
        options.bundles = [
            path.join(reportsDir, 'remediation-tasks.json'),
            path.join(reportsDir, 'skill-growth-tasks.json'),
            path.join(reportsDir, 'cognition-iteration-tasks.json')
        ];
    }

    return options;
}

function loadEntriesFromBundles(options) {
    const entries = [];
    let missing = 0;

    for (const bundlePath of options.bundles) {
        if (!fs.existsSync(bundlePath)) {
            if (options.customBundles) {
                throw new Error(`Bundle file not found: ${bundlePath}`);
            }
            missing++;
            continue;
        }

        const raw = fs.readFileSync(bundlePath, 'utf8');
        const payload = JSON.parse(raw);
        const bundleEntries = extractTaskEntriesFromBundle(payload, bundlePath);
        entries.push(...bundleEntries);
    }

    if (entries.length === 0) {
        throw new Error(
            missing > 0
                ? `No enqueueable task bundles found. Checked ${options.bundles.length} default bundle path(s).`
                : 'No enqueueable task entries found.'
        );
    }

    return entries;
}

function printSummary(result) {
    console.log(`Queue existing records: ${result.stats.existing}`);
    console.log(`Entries planned: ${result.stats.total}`);
    console.log(`Accepted: ${result.stats.accepted}`);
    console.log(`Skipped duplicate id: ${result.stats.skippedDuplicateId}`);
    console.log(`Skipped duplicate open fingerprint: ${result.stats.skippedDuplicateOpenFingerprint}`);
    if (result.stats.dryRun) {
        console.log('Dry run: no records written.');
    } else {
        console.log(`Saved: ${result.stats.saved}`);
    }

    for (const item of result.accepted) {
        console.log(`- ${item.taskId} target=${item.request.target} priority=${item.request.priority} source=${item.source}`);
    }
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const entries = loadEntriesFromBundles(options);
        const result = await enqueueTaskEntries({
            storePath: options.storePath,
            entries,
            allowDuplicates: options.allowDuplicates,
            dryRun: options.dryRun,
            actor: options.actor
        });

        printSummary(result);
    } catch (error) {
        console.error(`enqueue-task-bundles failed: ${error.message}`);
        process.exit(1);
    }
})();
