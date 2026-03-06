import fs from 'fs';
import path from 'path';
import { runSkillPackage } from '../skills/marketplace/v2/runtime/runner-core.js';
import { loadJson } from '../skills/marketplace/v2/runtime/contracts.js';

type CatalogEntry = {
    id: number;
    packageName: string;
    packagePath: string;
    runnerPath: string;
    inputSchemaPath: string;
    outputSchemaPath: string;
    qualityScore: number;
    roiScore: number;
    trustBadges: string[];
};

type Catalog = {
    version: number;
    generatedAt: string;
    count: number;
    entries: CatalogEntry[];
};

type ValidationReport = {
    version: 1;
    generatedAt: string;
    sourceCatalog: string;
    count: number;
    passed: number;
    failed: number;
    sampled: number;
    errors: Array<{
        skillId: number;
        packageName: string;
        reason: string;
    }>;
    quality: {
        avgQualityScore: number;
        avgRoiScore: number;
        badgeCoverage: Array<{ badge: string; count: number; }>;
    };
};

type Options = {
    sample: number | null;
};

const REPO_ROOT = process.cwd();
const V2_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace', 'v2');
const CATALOG_PATH = path.join(V2_ROOT, 'catalog.json');
const REPORT_JSON_PATH = path.join(V2_ROOT, 'validation.report.json');
const REPORT_MD_PATH = path.join(V2_ROOT, 'validation.report.md');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function parseArgs(argv: string[]): Options {
    const options: Options = {
        sample: null
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '--sample') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --sample');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --sample value: ${next}`);
            options.sample = parsed;
            index += 1;
        }
    }

    return options;
}

function renderMarkdown(report: ValidationReport): string {
    const lines = [
        '# Skill Package v2 Validation Report',
        '',
        `Generated at: ${report.generatedAt}`,
        `Source catalog: \`${report.sourceCatalog}\``,
        `Total packages: ${report.count}`,
        `Validated: ${report.sampled}`,
        `Passed: ${report.passed}`,
        `Failed: ${report.failed}`,
        `Average quality score: ${report.quality.avgQualityScore}`,
        `Average ROI score: ${report.quality.avgRoiScore}`,
        '',
        '## Badge Coverage',
        '| Badge | Count |',
        '| --- | --- |',
        ...report.quality.badgeCoverage.map((row) => `| ${row.badge} | ${row.count} |`),
        ''
    ];

    if (report.errors.length > 0) {
        lines.push('## Failures');
        lines.push('| Skill ID | Package | Reason |');
        lines.push('| --- | --- | --- |');
        for (const error of report.errors.slice(0, 80)) {
            lines.push(`| ${error.skillId} | \`${error.packageName}\` | ${error.reason.replace(/\|/g, '\\|')} |`);
        }
        lines.push('');
    }

    return lines.join('\n');
}

function main() {
    const options = parseArgs(process.argv.slice(2));

    assert(fs.existsSync(CATALOG_PATH), `Missing v2 catalog: ${CATALOG_PATH}`);
    const catalog = loadJson<Catalog>(CATALOG_PATH);
    assert(Array.isArray(catalog.entries) && catalog.entries.length > 0, 'Catalog has no entries');

    const toValidate = options.sample
        ? catalog.entries.slice(0, options.sample)
        : catalog.entries;

    let passed = 0;
    let failed = 0;
    const errors: ValidationReport['errors'] = [];
    const badgeCounts = new Map<string, number>();

    for (const entry of toValidate) {
        for (const badge of entry.trustBadges || []) {
            badgeCounts.set(badge, (badgeCounts.get(badge) || 0) + 1);
        }

        const packageDir = path.join(REPO_ROOT, entry.packagePath);
        const runnerPath = path.join(REPO_ROOT, entry.runnerPath);
        const inputSchemaPath = path.join(REPO_ROOT, entry.inputSchemaPath);
        const outputSchemaPath = path.join(REPO_ROOT, entry.outputSchemaPath);
        const sampleInputPath = path.join(packageDir, 'tests', 'fixtures', 'input.sample.json');
        const skillJsonPath = path.join(packageDir, 'skill.json');
        const skillYamlPath = path.join(packageDir, 'skill.yaml');
        const guardrailsPath = path.join(packageDir, 'guardrails.yaml');
        const observabilityPath = path.join(packageDir, 'observability.yaml');

        const requiredPaths = [
            packageDir,
            runnerPath,
            inputSchemaPath,
            outputSchemaPath,
            sampleInputPath,
            skillJsonPath,
            skillYamlPath,
            guardrailsPath,
            observabilityPath
        ];

        const missing = requiredPaths.filter((filePath) => !fs.existsSync(filePath));
        if (missing.length > 0) {
            failed += 1;
            errors.push({
                skillId: entry.id,
                packageName: entry.packageName,
                reason: `Missing required paths: ${missing.join(', ')}`
            });
            continue;
        }

        const sampleInput = loadJson<unknown>(sampleInputPath);
        const result = runSkillPackage(packageDir, sampleInput);

        if (!result.validation.inputValid || !result.validation.outputValid) {
            failed += 1;
            errors.push({
                skillId: entry.id,
                packageName: entry.packageName,
                reason: result.validation.errors.join('; ') || 'contract validation failed'
            });
            continue;
        }

        passed += 1;
    }

    const avgQualityScore = toValidate.length
        ? toValidate.reduce((sum, entry) => sum + entry.qualityScore, 0) / toValidate.length
        : 0;
    const avgRoiScore = toValidate.length
        ? toValidate.reduce((sum, entry) => sum + entry.roiScore, 0) / toValidate.length
        : 0;

    const report: ValidationReport = {
        version: 1,
        generatedAt: new Date().toISOString(),
        sourceCatalog: 'skills/marketplace/v2/catalog.json',
        count: catalog.count,
        passed,
        failed,
        sampled: toValidate.length,
        errors,
        quality: {
            avgQualityScore: Number(avgQualityScore.toFixed(2)),
            avgRoiScore: Number(avgRoiScore.toFixed(2)),
            badgeCoverage: Array.from(badgeCounts.entries())
                .map(([badge, count]) => ({ badge, count }))
                .sort((a, b) => b.count - a.count)
        }
    };

    fs.writeFileSync(REPORT_JSON_PATH, `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(REPORT_MD_PATH, `${renderMarkdown(report)}\n`);

    console.log(`[validate-marketplace-skill-packages-v2] Validated ${toValidate.length} packages.`);
    console.log(`[validate-marketplace-skill-packages-v2] Passed=${passed}, Failed=${failed}.`);
    console.log(`[validate-marketplace-skill-packages-v2] Report: ${path.relative(REPO_ROOT, REPORT_JSON_PATH)}`);
}

main();
