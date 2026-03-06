import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const REPO_ROOT = process.cwd();
const NEXT_100_PATH = path.join(REPO_ROOT, 'CAPABILITY_NEXT_100.md');
const BLUEPRINT_PATH = path.join(REPO_ROOT, 'CAPABILITY_BLUEPRINT.md');
const INDEX_PATH = path.join(REPO_ROOT, 'swarm-protocol', 'index.ts');
const TEST_DIR = path.join(REPO_ROOT, 'swarm-protocol', 'test');
const OUTPUT_PATH = path.join(REPO_ROOT, 'CAPABILITY_DEPLOYABILITY_AUDIT.md');

function parseCapabilityList(text) {
    const pattern = /^- \[(?<done>.| )\] (?<number>\d+)\. (?<name>.+?) - (?<objective>.+)$/gm;
    const entries = [];
    let match;
    while ((match = pattern.exec(text)) !== null) {
        entries.push({
            number: Number(match.groups.number),
            name: match.groups.name.trim(),
            objective: match.groups.objective.trim(),
            done: match.groups.done === 'x'
        });
    }
    return entries.sort((a, b) => a.number - b.number);
}

function parseBlueprintCoverage(text) {
    const covered = new Set();
    const pattern = /^### (?<number>\d+)\) /gm;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        covered.add(Number(match.groups.number));
    }
    return covered;
}

function parseCapabilityModuleMap(indexText) {
    const exports = [];
    const pattern = /^export \* from '\.\/src\/(?<module>[^']+)\.js';$/gm;
    let match;
    while ((match = pattern.exec(indexText)) !== null) {
        exports.push(match.groups.module.trim());
    }

    const start = exports.indexOf('intervention-portfolio');
    if (start < 0) {
        throw new Error('Could not find capability 32 start module (intervention-portfolio) in swarm-protocol/index.ts');
    }

    const modules = exports.slice(start, start + 100);
    if (modules.length !== 100) {
        throw new Error(`Expected 100 capability modules from 32-131, found ${modules.length}`);
    }

    const map = new Map();
    for (let i = 0; i < modules.length; i += 1) {
        map.set(32 + i, modules[i]);
    }
    return map;
}

function collectTests() {
    const files = fs.readdirSync(TEST_DIR)
        .filter((entry) => entry.endsWith('.test.ts'))
        .map((entry) => path.join(TEST_DIR, entry));

    return files.map((filePath) => ({
        filePath,
        fileName: path.basename(filePath),
        content: fs.readFileSync(filePath, 'utf8')
    }));
}

function findExportKeys(namespace) {
    const keys = Object.keys(namespace);
    const evaluateKey = keys.find((key) => (
        /^[a-z]/.test(key)
        && !key.endsWith('ToTasks')
        && !key.startsWith('__')
        && typeof namespace[key] === 'function'
    ));
    const toTasksKey = keys.find((key) => key.endsWith('ToTasks') && typeof namespace[key] === 'function');
    const managerKey = keys.find((key) => /^[A-Z]/.test(key) && typeof namespace[key] === 'function');
    return {
        evaluateKey,
        toTasksKey,
        managerKey
    };
}

function pass(value) {
    return value ? 'PASS' : 'FAIL';
}

function statusEmoji(value) {
    return value ? 'YES' : 'NO';
}

function buildSummaryRows(results) {
    const total = results.length;
    const deployable = results.filter((entry) => entry.deployable).length;
    const nonDeployable = total - deployable;
    const missingBlueprint = results.filter((entry) => !entry.blueprint).length;
    const missingTests = results.filter((entry) => !entry.testEvidence).length;
    const smokeFailures = results.filter((entry) => !entry.smokePass).length;

    return {
        total,
        deployable,
        nonDeployable,
        missingBlueprint,
        missingTests,
        smokeFailures
    };
}

function markdownEscape(value) {
    return String(value ?? '').replace(/\|/g, '\\|');
}

async function auditCapability(entry, moduleName, blueprintCoverage, tests) {
    const modulePath = path.join(REPO_ROOT, 'swarm-protocol', 'src', `${moduleName}.ts`);
    const moduleExists = fs.existsSync(modulePath);

    if (!moduleExists) {
        return {
            number: entry.number,
            name: entry.name,
            moduleName,
            moduleExists: false,
            blueprint: blueprintCoverage.has(entry.number),
            testEvidence: false,
            exportContract: false,
            smokePass: false,
            taskContract: false,
            managerContract: false,
            deployable: false,
            notes: 'Module file missing'
        };
    }

    const namespace = await import(pathToFileURL(modulePath).href);
    const { evaluateKey, toTasksKey, managerKey } = findExportKeys(namespace);
    const exportContract = Boolean(evaluateKey && toTasksKey && managerKey);

    const testEvidence = tests.some((testEntry) => (
        testEntry.content.includes(`${entry.number}`)
        || testEntry.content.includes(entry.name)
        || (evaluateKey ? testEntry.content.includes(evaluateKey) : false)
        || testEntry.fileName.includes(moduleName)
    ));

    let smokePass = false;
    let taskContract = false;
    let managerContract = false;
    const notes = [];

    try {
        if (evaluateKey) {
            const report = namespace[evaluateKey]({}, { now: () => 9_999_000 + entry.number });
            smokePass = Boolean(report && typeof report === 'object');

            if (!smokePass) {
                notes.push('Evaluator did not return object');
            }

            if (toTasksKey && smokePass) {
                const tasks = namespace[toTasksKey](report, { fromAgentId: 'agent:audit' });
                taskContract = Array.isArray(tasks) && (
                    tasks.length === 0
                    || tasks.every((task) => task && task.kind === 'task_request')
                );
                if (!taskContract) {
                    notes.push('Task conversion contract invalid');
                }
            }

            if (managerKey) {
                const Manager = namespace[managerKey];
                const manager = new Manager({ localAgentId: 'agent:audit-manager', now: () => 9_999_500 + entry.number });
                const classReport = manager.evaluate({});
                const classTasks = manager.buildTasks(classReport);
                managerContract = Boolean(
                    classReport && typeof classReport === 'object'
                    && Array.isArray(classTasks)
                    && typeof manager.listHistory === 'function'
                );
                if (!managerContract) {
                    notes.push('Manager contract invalid');
                }
            }
        }
    } catch (error) {
        notes.push(`Smoke execution failed: ${error.message}`);
    }

    const blueprint = blueprintCoverage.has(entry.number);
    const deployable = moduleExists
        && exportContract
        && smokePass
        && taskContract
        && managerContract
        && blueprint
        && testEvidence;

    return {
        number: entry.number,
        name: entry.name,
        moduleName,
        moduleExists,
        blueprint,
        testEvidence,
        exportContract,
        smokePass,
        taskContract,
        managerContract,
        deployable,
        notes: notes.length > 0 ? notes.join('; ') : 'OK'
    };
}

function renderMarkdown(summary, results) {
    const lines = [];
    const generatedAt = new Date().toISOString();

    lines.push('# Capability Deployability Audit (32-131)');
    lines.push('');
    lines.push(`Generated: ${generatedAt}`);
    lines.push('');
    lines.push('## Criteria');
    lines.push('- Module implementation exists in `swarm-protocol/src` and is exported via `swarm-protocol/index.ts` mapping.');
    lines.push('- Capability exports evaluator + `ToTasks` adapter + manager class.');
    lines.push('- Evaluator, task conversion, and manager wrapper pass a smoke execution check.');
    lines.push('- Capability section exists in `CAPABILITY_BLUEPRINT.md`.');
    lines.push('- Capability has test evidence in `swarm-protocol/test`.');
    lines.push('');
    lines.push('## Summary');
    lines.push(`- Total audited: ${summary.total}`);
    lines.push(`- Deployable: ${summary.deployable}`);
    lines.push(`- Not deployable: ${summary.nonDeployable}`);
    lines.push(`- Missing blueprint sections: ${summary.missingBlueprint}`);
    lines.push(`- Missing test evidence: ${summary.missingTests}`);
    lines.push(`- Smoke-check failures: ${summary.smokeFailures}`);
    lines.push('');
    lines.push('## Matrix');
    lines.push('| # | Capability | Module | Blueprint | Tests | Exports | Smoke | Tasks | Manager | Deployable | Notes |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');

    for (const entry of results) {
        lines.push(`| ${entry.number} | ${markdownEscape(entry.name)} | \`${markdownEscape(entry.moduleName)}\` | ${statusEmoji(entry.blueprint)} | ${statusEmoji(entry.testEvidence)} | ${pass(entry.exportContract)} | ${pass(entry.smokePass)} | ${pass(entry.taskContract)} | ${pass(entry.managerContract)} | ${statusEmoji(entry.deployable)} | ${markdownEscape(entry.notes)} |`);
    }

    lines.push('');
    return `${lines.join('\n')}\n`;
}

async function main() {
    const next100Text = fs.readFileSync(NEXT_100_PATH, 'utf8');
    const blueprintText = fs.readFileSync(BLUEPRINT_PATH, 'utf8');
    const indexText = fs.readFileSync(INDEX_PATH, 'utf8');

    const capabilities = parseCapabilityList(next100Text);
    const blueprintCoverage = parseBlueprintCoverage(blueprintText);
    const moduleMap = parseCapabilityModuleMap(indexText);
    const tests = collectTests();

    const results = [];
    for (const entry of capabilities) {
        const moduleName = moduleMap.get(entry.number);
        if (!moduleName) {
            results.push({
                number: entry.number,
                name: entry.name,
                moduleName: 'unknown',
                moduleExists: false,
                blueprint: blueprintCoverage.has(entry.number),
                testEvidence: false,
                exportContract: false,
                smokePass: false,
                taskContract: false,
                managerContract: false,
                deployable: false,
                notes: 'No module mapping in index export chain'
            });
            continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const audit = await auditCapability(entry, moduleName, blueprintCoverage, tests);
        results.push(audit);
    }

    const summary = buildSummaryRows(results);
    const markdown = renderMarkdown(summary, results);
    fs.writeFileSync(OUTPUT_PATH, markdown);

    const failures = results.filter((entry) => !entry.deployable).length;
    console.log(`[audit-capabilities] Audited ${results.length} capabilities; deployable=${summary.deployable}; failures=${failures}`);
    if (failures > 0) {
        process.exitCode = 1;
    }
}

await main();
