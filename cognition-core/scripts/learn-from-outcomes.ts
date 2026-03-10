import fs from 'fs';
import path from 'path';
import { FileTaskStore } from '../../swarm-protocol/runtime.js';
import { evaluateLearningLoop } from '../src/learning-loop.js';

const TERMINAL_OUTCOME_STATUSES = new Set([
    'completed',
    'partial',
    'failed',
    'rejected',
    'timed_out',
    'transport_error'
]);

function printHelp() {
    console.log(`Learn from execution outcomes via counterfactual replay

Usage:
  tsx scripts/learn-from-outcomes.ts [options]

Options:
  --input <path>       JSON file containing task outcome records
  --store <path>       Task journal path (default: ../swarm-protocol/state/tasks.journal.jsonl)
  --skills-catalog <p> Optional skill catalog JSON to map growth recommendations
  --state-in <path>    Load previous learning state JSON
  --state-out <path>   Write updated learning state JSON
  --json <path>        Write JSON output
  --markdown <path>    Write Markdown output
  --include-open       Include non-terminal task records in learning input
  -h, --help           Show help
`);
}

function parseArgs(argv) {
    const options = {
        inputPath: null,
        storePath: path.resolve(process.cwd(), '../swarm-protocol/state/tasks.journal.jsonl'),
        skillsCatalogPath: path.resolve(process.cwd(), '../skills/generated/runtime.catalog.json'),
        stateInPath: null,
        stateOutPath: null,
        jsonPath: null,
        markdownPath: null,
        includeOpen: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--include-open') {
            options.includeOpen = true;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--input') {
            options.inputPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--store') {
            options.storePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--skills-catalog') {
            options.skillsCatalogPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--state-in') {
            options.stateInPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--state-out') {
            options.stateOutPath = path.resolve(process.cwd(), value);
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

function safeReadJson(filePath) {
    if (!filePath || !fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
}

function loadSkillCatalog(filePath) {
    if (!filePath || !fs.existsSync(filePath)) return null;
    const parsed = safeReadJson(filePath);
    if (!parsed) return null;
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed.entries)) return parsed.entries;
    return null;
}

function formatMarkdown(result) {
    const lines = [
        '# Learning Loop Report',
        '',
        `Total outcomes: ${result.summary.total}`,
        `Success rate: ${(result.summary.successRate * 100).toFixed(2)}%`,
        `Failure rate: ${(result.summary.failureRate * 100).toFixed(2)}%`,
        `Timeout rate: ${(result.summary.timeoutRate * 100).toFixed(2)}%`,
        `Average attempts: ${result.summary.avgAttempts}`,
        '',
        '## Counterfactual Replay',
        '',
        '| Variant | Delta Success Rate | Projected Success Rate |',
        '| --- | ---: | ---: |'
    ];

    for (const run of result.replay.runs) {
        lines.push(`| ${run.name} | ${(run.deltaSuccessRate * 100).toFixed(2)}pp | ${(run.projectedSuccessRate * 100).toFixed(2)}% |`);
    }

    lines.push('', '## Error Taxonomy', '');
    lines.push(`Drift level: **${result.errorTaxonomy.driftLevel}**`);
    lines.push(`Recurring signatures: ${result.errorTaxonomy.recurringSignatures}`);
    lines.push('', '| Category | Failures | Share |', '| --- | ---: | ---: |');
    for (const category of result.errorTaxonomy.categories || []) {
        lines.push(`| ${category.category} | ${category.count} | ${(category.rate * 100).toFixed(2)}% |`);
    }
    if ((result.errorTaxonomy.categories || []).length === 0) {
        lines.push('| (none) | 0 | 0.00% |');
    }

    lines.push('', '## Skill Growth Plan', '');
    for (const area of result.skillGrowthPlan.focusAreas || []) {
        lines.push(`- [${area.priority}] ${area.label}`);
        lines.push(`  - Why: ${area.rationale}`);
        lines.push(`  - Action: ${area.learningAction}`);
        if ((area.suggestedSkills || []).length > 0) {
            lines.push(`  - Skills: ${area.suggestedSkills.map((item) => item.name).join(', ')}`);
        }
    }
    if ((result.skillGrowthPlan.focusAreas || []).length === 0) {
        lines.push('- No new skill focus areas identified in this run.');
    }

    lines.push('', '## Recommendations', '');
    for (const recommendation of result.recommendations) {
        lines.push(`- [${recommendation.priority}] ${recommendation.title}`);
        lines.push(`  - Rationale: ${recommendation.rationale}`);
        lines.push(`  - Action: ${recommendation.action}`);
    }
    if ((result.recommendations || []).length === 0) {
        lines.push('- No immediate recommendations.');
    }

    lines.push('', '## Persistent State', '');
    lines.push(`Run count: ${result.state.runCount}`);
    lines.push(`State drift level: **${result.state.driftLevel}**`);
    if (result.state.trend.failureRateDelta !== null) {
        lines.push(`Failure rate delta vs previous run: ${(result.state.trend.failureRateDelta * 100).toFixed(2)}pp`);
    }

    return `${lines.join('\n')}\n`;
}

async function loadOutcomes(options) {
    if (options.inputPath) {
        const parsed = JSON.parse(fs.readFileSync(options.inputPath, 'utf8'));
        if (!Array.isArray(parsed)) {
            throw new Error('--input must point to a JSON array');
        }
        if (options.includeOpen) {
            return parsed;
        }
        return parsed.filter((record) => TERMINAL_OUTCOME_STATUSES.has(String(record?.status || '').trim().toLowerCase()));
    }

    const store = new FileTaskStore({ filePath: options.storePath });
    const records = await store.loadRecords();
    if (options.includeOpen) {
        return records;
    }
    return records.filter((record) => TERMINAL_OUTCOME_STATUSES.has(String(record?.status || '').trim().toLowerCase()));
}

(async () => {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const outcomes = await loadOutcomes(options);
        const previousState = safeReadJson(options.stateInPath);
        const skillCatalog = loadSkillCatalog(options.skillsCatalogPath);
        const result = evaluateLearningLoop(outcomes, {
            previousState,
            skillCatalog
        });

        console.log(`Outcomes: ${result.summary.total}`);
        console.log(`Success rate: ${(result.summary.successRate * 100).toFixed(2)}%`);
        console.log(`Failure drift: ${result.errorTaxonomy.driftLevel}`);
        if (result.replay.best) {
            console.log(`Best replay variant: ${result.replay.best.name} (+${(result.replay.best.deltaSuccessRate * 100).toFixed(2)}pp)`);
        }
        console.log(`Recommendations: ${result.recommendations.length}`);
        console.log(`Skill focuses: ${result.skillGrowthPlan.focusAreas.length}`);

        if (options.jsonPath) {
            ensureDir(options.jsonPath);
            fs.writeFileSync(options.jsonPath, `${JSON.stringify(result, null, 2)}\n`);
            console.log(`JSON written to ${options.jsonPath}`);
        }

        if (options.stateOutPath) {
            ensureDir(options.stateOutPath);
            fs.writeFileSync(options.stateOutPath, `${JSON.stringify(result.state, null, 2)}\n`);
            console.log(`State written to ${options.stateOutPath}`);
        }

        if (options.markdownPath) {
            ensureDir(options.markdownPath);
            fs.writeFileSync(options.markdownPath, formatMarkdown(result));
            console.log(`Markdown written to ${options.markdownPath}`);
        }
    } catch (error) {
        console.error(`Learning loop failed: ${error.message}`);
        process.exit(1);
    }
})();
