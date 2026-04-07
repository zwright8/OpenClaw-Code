import fs from 'fs';
import path from 'path';
import {
    assessSkillImplementationHardeningBatch,
    buildSkillDeployabilityIndex,
    createDefaultSkillHardeningProfile,
    hasExternalSkillRegistry,
    loadExternalSkillImplementationIndex,
    loadSkillImplementationFromEntry,
    loadSkillManifest,
    normalizeSkillHardeningProfile
} from '../skills/runtime/index.js';

type HardeningCliOptions = {
    repoRoot: string;
    includeManifest: boolean;
    includeExternal: boolean;
    policy: 'off' | 'report' | 'enforce';
    strict: boolean;
    minScore: number;
    hardeningProfilePath: string | null;
    writeProfilePath: string | null;
    jsonPath: string | null;
    markdownPath: string | null;
    deployIndexPath: string | null;
    fullJsonPath: string | null;
    help: boolean;
};

function printHelp() {
    console.log(`Harden skill implementations and publish deployability index

Usage:
  tsx scripts/harden-skills.ts [options]

Options:
  --repo-root <path>          Repo root containing skills directories (default: .)
  --manifest-only             Evaluate only skills/generated manifest skills (1000)
  --external-only             Evaluate only skills/generated-10000 external skills
  --policy <mode>             Default hardening policy: off|report|enforce (default: enforce)
  --min-score <n>             Minimum hardening score required for deployability (default: 82)
  --no-strict                 Treat non-blocking warnings as non-fatal
  --hardening-profile <path>  Optional hardening profile JSON to apply
  --write-profile <path>      Write normalized hardening profile JSON to path
  --json <path>               Summary JSON output path
  --markdown <path>           Summary markdown output path
  --deploy-index <path>       Deployability index JSON output path
  --full-json <path>          Optional full detailed JSON report output path
  -h, --help                  Show help
`);
}

function parseInteger(raw: string, flag: string, min = 0, max = 100) {
    const value = Number(raw);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
        throw new Error(`${flag} must be an integer between ${min} and ${max}`);
    }
    return value;
}

function parsePolicy(raw: string) {
    const value = String(raw || '').trim().toLowerCase();
    if (value !== 'off' && value !== 'report' && value !== 'enforce') {
        throw new Error('--policy must be one of: off, report, enforce');
    }
    return value as 'off' | 'report' | 'enforce';
}

function parseArgs(argv: string[]): HardeningCliOptions {
    const repoRoot = path.resolve(process.cwd());
    const options: HardeningCliOptions = {
        repoRoot,
        includeManifest: true,
        includeExternal: true,
        policy: 'enforce',
        strict: true,
        minScore: 82,
        hardeningProfilePath: null,
        writeProfilePath: path.join(repoRoot, 'skills', 'state', 'skills.hardening.profile.json'),
        jsonPath: path.join(repoRoot, 'skills', 'state', 'skills.hardening.summary.json'),
        markdownPath: path.join(repoRoot, 'skills', 'state', 'skills.hardening.summary.md'),
        deployIndexPath: path.join(repoRoot, 'skills', 'state', 'skills.deployability.index.json'),
        fullJsonPath: null,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '-h' || token === '--help') {
            options.help = true;
            continue;
        }
        if (token === '--manifest-only') {
            options.includeManifest = true;
            options.includeExternal = false;
            continue;
        }
        if (token === '--external-only') {
            options.includeManifest = false;
            options.includeExternal = true;
            continue;
        }
        if (token === '--no-strict') {
            options.strict = false;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--repo-root') {
            options.repoRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--policy') {
            options.policy = parsePolicy(value);
            i++;
            continue;
        }
        if (token === '--min-score') {
            options.minScore = parseInteger(value, '--min-score', 1, 100);
            i++;
            continue;
        }
        if (token === '--hardening-profile') {
            options.hardeningProfilePath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--write-profile') {
            options.writeProfilePath = path.resolve(process.cwd(), value);
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
        if (token === '--deploy-index') {
            options.deployIndexPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--full-json') {
            options.fullJsonPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    if (!options.includeManifest && !options.includeExternal) {
        throw new Error('At least one catalog must be selected');
    }

    if (!argv.includes('--hardening-profile')) {
        const defaultProfilePath = path.join(options.repoRoot, 'skills', 'state', 'skills.hardening.profile.json');
        options.hardeningProfilePath = fs.existsSync(defaultProfilePath) ? defaultProfilePath : null;
    }
    if (!argv.includes('--write-profile')) {
        options.writeProfilePath = path.join(options.repoRoot, 'skills', 'state', 'skills.hardening.profile.json');
    }
    if (!argv.includes('--json')) {
        options.jsonPath = path.join(options.repoRoot, 'skills', 'state', 'skills.hardening.summary.json');
    }
    if (!argv.includes('--markdown')) {
        options.markdownPath = path.join(options.repoRoot, 'skills', 'state', 'skills.hardening.summary.md');
    }
    if (!argv.includes('--deploy-index')) {
        options.deployIndexPath = path.join(options.repoRoot, 'skills', 'state', 'skills.deployability.index.json');
    }

    return options;
}

function writeJsonFile(filePath: string | null, payload: unknown) {
    if (!filePath || !filePath.trim()) return;
    const resolved = path.resolve(filePath);
    fs.mkdirSync(path.dirname(resolved), { recursive: true });
    fs.writeFileSync(resolved, `${JSON.stringify(payload, null, 2)}\n`);
}

function summarizeFindingsByCheck(reports: ReturnType<typeof assessSkillImplementationHardeningBatch>['reports']) {
    const byCheck = new Map<string, number>();
    for (const report of reports) {
        for (const finding of report.findings) {
            const key = finding.checkId;
            byCheck.set(key, (byCheck.get(key) || 0) + 1);
        }
    }
    return Array.from(byCheck.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([checkId, count]) => ({ checkId, count }));
}

function loadHardeningProfile(options: HardeningCliOptions) {
    const fallback = createDefaultSkillHardeningProfile({
        policy: options.policy,
        minDeployableScore: options.minScore,
        strict: options.strict
    });

    if (!options.hardeningProfilePath) {
        return fallback;
    }

    const resolved = path.resolve(options.hardeningProfilePath);
    if (!fs.existsSync(resolved)) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(resolved, 'utf8'));
        return normalizeSkillHardeningProfile(parsed, {
            policy: options.policy,
            minDeployableScore: options.minScore,
            strict: options.strict
        });
    } catch {
        return fallback;
    }
}

function renderMarkdown(summaryPayload: {
    generatedAt: string;
    minDeployableScore: number;
    strict: boolean;
    policy: string;
    profileRuleCount: number;
    summary: ReturnType<typeof assessSkillImplementationHardeningBatch>['summary'];
    findingsByCheck: Array<{ checkId: string; count: number; }>;
    topNonDeployable: Array<{
        source: string;
        skillId: number;
        skillName: string;
        hardeningScore: number;
        blockingFindings: number;
        reasons: string[];
    }>;
}) {
    const lines: string[] = [
        '# Skills Hardening Summary',
        '',
        `- generatedAt: ${summaryPayload.generatedAt}`,
        `- minDeployableScore: ${summaryPayload.minDeployableScore}`,
        `- strict: ${summaryPayload.strict}`,
        `- defaultPolicy: ${summaryPayload.policy}`,
        `- profileRuleCount: ${summaryPayload.profileRuleCount}`,
        `- evaluated: ${summaryPayload.summary.evaluated}`,
        `- deployable: ${summaryPayload.summary.deployable}`,
        `- nonDeployable: ${summaryPayload.summary.nonDeployable}`,
        `- averageScore: ${summaryPayload.summary.averageScore}`,
        `- minScore: ${summaryPayload.summary.minScore}`,
        `- maxScore: ${summaryPayload.summary.maxScore}`,
        `- blockingFindings: ${summaryPayload.summary.blockingFindings}`,
        '',
        '## Source Counts',
        '',
        `- manifest: ${summaryPayload.summary.sourceCounts.manifest}`,
        `- external: ${summaryPayload.summary.sourceCounts.external}`,
        `- runtime: ${summaryPayload.summary.sourceCounts.runtime}`,
        '',
        '## Policy Usage',
        '',
        `- enforce: ${summaryPayload.summary.policyUsage.enforce}`,
        `- report: ${summaryPayload.summary.policyUsage.report}`,
        `- off: ${summaryPayload.summary.policyUsage.off}`,
        `- strictCount: ${summaryPayload.summary.strictCount}`,
        '',
        '## Finding Volume By Check',
        ''
    ];

    if (summaryPayload.findingsByCheck.length === 0) {
        lines.push('- none');
    } else {
        for (const item of summaryPayload.findingsByCheck.slice(0, 12)) {
            lines.push(`- ${item.checkId}: ${item.count}`);
        }
    }

    lines.push('', '## Top Non-Deployable Skills', '');
    if (summaryPayload.topNonDeployable.length === 0) {
        lines.push('- none');
    } else {
        for (const report of summaryPayload.topNonDeployable) {
            const reason = report.reasons[0] || 'No reason available.';
            lines.push(`- ${report.source}:${report.skillId} ${report.skillName} score=${report.hardeningScore} blockers=${report.blockingFindings} reason=${reason}`);
        }
    }

    return lines.join('\n');
}

function printSummary(summaryPayload: {
    summary: ReturnType<typeof assessSkillImplementationHardeningBatch>['summary'];
    minDeployableScore: number;
    strict: boolean;
    policy: string;
    profileRuleCount: number;
    deployIndexPath: string | null;
    profilePath: string | null;
}) {
    console.log(`Evaluated: ${summaryPayload.summary.evaluated}`);
    console.log(`Deployable: ${summaryPayload.summary.deployable}`);
    console.log(`Non-deployable: ${summaryPayload.summary.nonDeployable}`);
    console.log(`Min deployable score: ${summaryPayload.minDeployableScore}`);
    console.log(`Strict policy: ${summaryPayload.strict}`);
    console.log(`Default policy mode: ${summaryPayload.policy}`);
    console.log(`Profile rules: ${summaryPayload.profileRuleCount}`);
    console.log(`Policy usage (enforce/report/off): ${summaryPayload.summary.policyUsage.enforce}/${summaryPayload.summary.policyUsage.report}/${summaryPayload.summary.policyUsage.off}`);
    console.log(`Average score: ${summaryPayload.summary.averageScore}`);
    if (summaryPayload.deployIndexPath) {
        console.log(`Deployability index: ${summaryPayload.deployIndexPath}`);
    }
    if (summaryPayload.profilePath) {
        console.log(`Hardening profile: ${summaryPayload.profilePath}`);
    }
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        printHelp();
        return;
    }

    const hardeningProfile = loadHardeningProfile(options);

    const entries: Array<{
        source: 'manifest' | 'external';
        implementation: ReturnType<typeof loadSkillImplementationFromEntry>;
    }> = [];

    if (options.includeManifest) {
        const manifestEntries = loadSkillManifest(options.repoRoot);
        for (const manifestEntry of manifestEntries) {
            entries.push({
                source: 'manifest',
                implementation: loadSkillImplementationFromEntry(manifestEntry, options.repoRoot)
            });
        }
    }

    if (options.includeExternal) {
        if (!hasExternalSkillRegistry(options.repoRoot)) {
            throw new Error('External skill registry not found at skills/generated-10000/implementations.json');
        }
        const externalIndex = loadExternalSkillImplementationIndex(options.repoRoot);
        const externalEntries = Array.from(externalIndex.values())
            .slice()
            .sort((a, b) => a.skillId - b.skillId);
        for (const implementation of externalEntries) {
            entries.push({
                source: 'external',
                implementation
            });
        }
    }

    const batchReport = assessSkillImplementationHardeningBatch(entries, {
        policy: options.policy,
        strict: options.strict,
        minDeployableScore: options.minScore,
        profile: hardeningProfile
    });
    const deployabilityIndex = buildSkillDeployabilityIndex(batchReport);
    const findingsByCheck = summarizeFindingsByCheck(batchReport.reports);
    const topNonDeployable = batchReport.reports
        .filter((report) => !report.deployable)
        .slice(0, 50)
        .map((report) => ({
            source: report.source,
            skillId: report.skillId,
            skillName: report.skillName,
            hardeningScore: report.hardeningScore,
            blockingFindings: report.blockingFindings,
            reasons: report.reasons
        }));

    const summaryPayload = {
        generatedAt: new Date().toISOString(),
        minDeployableScore: batchReport.minDeployableScore,
        strict: batchReport.strict,
        policy: batchReport.profile.defaultPolicy.policy,
        profileRuleCount: batchReport.profile.rules.length,
        summary: batchReport.summary,
        findingsByCheck,
        topNonDeployable
    };

    writeJsonFile(options.writeProfilePath, batchReport.profile);
    writeJsonFile(options.jsonPath, summaryPayload);
    writeJsonFile(options.deployIndexPath, deployabilityIndex);
    if (options.fullJsonPath) {
        writeJsonFile(options.fullJsonPath, batchReport);
    }
    if (options.markdownPath) {
        const markdown = renderMarkdown(summaryPayload);
        fs.mkdirSync(path.dirname(options.markdownPath), { recursive: true });
        fs.writeFileSync(options.markdownPath, `${markdown}\n`);
    }

    printSummary({
        summary: batchReport.summary,
        minDeployableScore: batchReport.minDeployableScore,
        strict: batchReport.strict,
        policy: batchReport.profile.defaultPolicy.policy,
        profileRuleCount: batchReport.profile.rules.length,
        deployIndexPath: options.deployIndexPath,
        profilePath: options.writeProfilePath
    });
}

main();
