import fs from 'fs';
import path from 'path';
import { runSkillPackage } from '../skills/marketplace/v2/runtime/runner-core.js';
import { loadJson } from '../skills/marketplace/v2/runtime/contracts.js';

type CatalogEntry = {
    id: number;
    packageName: string;
    packagePath: string;
};

type Catalog = {
    count: number;
    entries: CatalogEntry[];
};

type Options = {
    skillId: number | null;
    top: number;
};

const REPO_ROOT = process.cwd();
const V2_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace', 'v2');
const CATALOG_PATH = path.join(V2_ROOT, 'catalog.json');
const DEMO_ROOT = path.join(V2_ROOT, 'demo');
const DEMO_JSON_PATH = path.join(DEMO_ROOT, 'demo-output.json');
const DEMO_MD_PATH = path.join(DEMO_ROOT, 'DEMO.md');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function parseArgs(argv: string[]): Options {
    const options: Options = {
        skillId: null,
        top: 3
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '--skill-id') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --skill-id');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --skill-id: ${next}`);
            options.skillId = parsed;
            index += 1;
            continue;
        }
        if (token === '--top') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --top');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --top: ${next}`);
            options.top = parsed;
            index += 1;
            continue;
        }
    }

    return options;
}

function buildInput(index: number) {
    const urgency = index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low';
    const riskTolerance = index % 3 === 0 ? 'low' : index % 3 === 1 ? 'medium' : 'high';
    const budgetTier = index % 3 === 0 ? 'large' : index % 3 === 1 ? 'medium' : 'small';

    return {
        task: 'Run a production-grade skill package execution',
        objective: 'Produce an operational plan with explicit controls, KPI targets, and ready-to-execute actions.',
        constraints: [
            'Use fail-closed contract validation',
            'Include audit-ready evidence for every recommendation',
            'Escalate if risk posture conflicts with urgency'
        ],
        context: {
            urgency,
            riskTolerance,
            budgetTier
        }
    };
}

function renderDemoMarkdown(results: Array<{ id: number; packageName: string; result: ReturnType<typeof runSkillPackage>; }>): string {
    const lines = [
        '# Skill Package v2 Demo',
        '',
        `Generated at: ${new Date().toISOString()}`,
        `Packages executed: ${results.length}`,
        ''
    ];

    for (const row of results) {
        lines.push(`## ${row.packageName} (Skill ${row.id})`);
        lines.push(`Status: ${row.result.output.status}`);
        lines.push(`Input valid: ${row.result.validation.inputValid}`);
        lines.push(`Output valid: ${row.result.validation.outputValid}`);
        lines.push(`Summary: ${row.result.output.summary}`);
        lines.push('Plan:');
        for (const step of row.result.output.plan.slice(0, 5)) {
            lines.push(`- ${step}`);
        }
        lines.push('Controls:');
        for (const control of row.result.output.controls.slice(0, 4)) {
            lines.push(`- ${control}`);
        }
        lines.push('KPIs:');
        for (const kpi of row.result.output.kpis.slice(0, 4)) {
            lines.push(`- ${kpi}`);
        }
        lines.push('');
    }

    return lines.join('\n');
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    assert(fs.existsSync(CATALOG_PATH), `Missing v2 catalog: ${CATALOG_PATH}`);

    const catalog = loadJson<Catalog>(CATALOG_PATH);
    assert(Array.isArray(catalog.entries) && catalog.entries.length > 0, 'No v2 catalog entries found');

    let selected: CatalogEntry[] = [];
    if (options.skillId !== null) {
        const matched = catalog.entries.find((entry) => entry.id === options.skillId);
        assert(matched, `Skill ${options.skillId} not found in v2 catalog`);
        selected = [matched];
    } else {
        selected = catalog.entries.slice(0, options.top);
    }

    const results = selected.map((entry, index) => {
        const packageDir = path.join(REPO_ROOT, entry.packagePath);
        const input = buildInput(index);
        const result = runSkillPackage(packageDir, input);
        return {
            id: entry.id,
            packageName: entry.packageName,
            result
        };
    });

    fs.mkdirSync(DEMO_ROOT, { recursive: true });
    fs.writeFileSync(DEMO_JSON_PATH, `${JSON.stringify({
        generatedAt: new Date().toISOString(),
        count: results.length,
        results
    }, null, 2)}\n`);
    fs.writeFileSync(DEMO_MD_PATH, `${renderDemoMarkdown(results)}\n`);

    console.log(`[demo-marketplace-skill-package-v2] Executed ${results.length} package demos.`);
    console.log(`[demo-marketplace-skill-package-v2] Output: ${path.relative(REPO_ROOT, DEMO_JSON_PATH)}`);
}

main();
