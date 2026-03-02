import fs from 'fs';
import path from 'path';
import type { SkillImplementation, SkillManifestEntry } from '../skills/runtime/types.js';

type BuildOptions = {
    count: number;
    clean: boolean;
    dryRun: boolean;
};

type ScoredEntry = SkillManifestEntry & {
    score: number;
    methodKey: string;
    domainKey: string;
    titleKey: string;
};

type MarketplaceCatalogEntry = {
    id: number;
    marketplaceSkillName: string;
    title: string;
    domain: string;
    coreMethod: string;
    runtimeArchetype: string;
    score: number;
    sourceSkillPath: string;
    sourceImplementationPath: string;
    marketplacePath: string;
    openaiYamlPath: string;
};

type MarketplaceCatalog = {
    version: 1;
    generatedAt: string;
    sourceManifest: string;
    count: number;
    entries: MarketplaceCatalogEntry[];
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const MARKETPLACE_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace');
const MARKETPLACE_GENERATED_ROOT = path.join(MARKETPLACE_ROOT, 'generated');
const CATALOG_JSON_PATH = path.join(MARKETPLACE_ROOT, 'skills.catalog.json');
const INDEX_MD_PATH = path.join(MARKETPLACE_ROOT, 'INDEX.md');

const MANIFEST_CANDIDATES = [
    'skills.manifest.10000.json',
    'skills.manifest.json'
] as const;

const DEFAULT_COUNT = 160;
const MAX_PER_METHOD = 3;
const MAX_PER_DOMAIN = 14;

const PRIORITY_DOMAINS = new Set([
    'software engineering delivery',
    'product management execution',
    'design and user research',
    'cybersecurity operations',
    'knowledge management systems',
    'remote team collaboration',
    'customer support operations',
    'legal and policy workflows',
    'healthcare operations',
    'education support services',
    'research and development labs',
    'disaster response networks',
    'climate adaptation initiatives',
    'urban planning and mobility',
    'supply chain resilience',
    'manufacturing quality assurance',
    'personal finance management',
    'entrepreneurship operations',
    'marketing and storytelling',
    'sales and client success',
    'scientific publishing pipelines',
    'nonprofit program delivery',
    'agriculture and food systems'
]);

const SCORING_RULES: Array<{ pattern: RegExp; points: number; }> = [
    { pattern: /autonomous workflow|workflow author/i, points: 7 },
    { pattern: /regression sentinel|regression/i, points: 7 },
    { pattern: /failure root cause|root cause/i, points: 7 },
    { pattern: /risk-aware|risk aware/i, points: 6 },
    { pattern: /security threat|threat model/i, points: 6 },
    { pattern: /privacy-preserving|privacy preserving/i, points: 6 },
    { pattern: /compliance evidence|compliance/i, points: 6 },
    { pattern: /semantic retrieval|knowledge graph/i, points: 6 },
    { pattern: /incident playbook|disaster recovery/i, points: 6 },
    { pattern: /approval routing|handoff/i, points: 5 },
    { pattern: /experiment design|a-b rollout/i, points: 5 },
    { pattern: /kpi dashboard|cost-benefit|cost benefit/i, points: 5 },
    { pattern: /continuous improvement|skill gap|training curriculum/i, points: 4 },
    { pattern: /explainability|uncertainty/i, points: 4 },
    { pattern: /decision journal|attention management|habit optimization/i, points: 3 }
];

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function normalizeText(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

function slugify(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function truncate(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
}

function capitalize(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function parseArgs(argv: string[]): BuildOptions {
    const options: BuildOptions = {
        count: DEFAULT_COUNT,
        clean: false,
        dryRun: false
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '--count') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --count');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --count value: ${next}`);
            options.count = parsed;
            index += 1;
            continue;
        }
        if (token === '--clean') {
            options.clean = true;
            continue;
        }
        if (token === '--dry-run') {
            options.dryRun = true;
            continue;
        }
    }

    return options;
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function resolveManifestPath(): string {
    for (const candidate of MANIFEST_CANDIDATES) {
        const filePath = path.join(GENERATED_ROOT, candidate);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    throw new Error(`No manifest found in ${GENERATED_ROOT}`);
}

function scoreEntry(entry: SkillManifestEntry): number {
    const corpus = `${entry.title} ${entry.coreMethod} ${entry.runtimeArchetype} ${entry.domain}`.toLowerCase();
    let score = 0;

    for (const rule of SCORING_RULES) {
        if (rule.pattern.test(corpus)) {
            score += rule.points;
        }
    }

    if (PRIORITY_DOMAINS.has(entry.domain.toLowerCase())) score += 5;
    if (entry.runtimeArchetype.toLowerCase().includes('orchestration')) score += 2;
    if (entry.runtimeArchetype.toLowerCase().includes('governance')) score += 2;
    if (entry.runtimeArchetype.toLowerCase().includes('optimization')) score += 2;
    if (entry.stepCount >= 6) score += 2;

    return score;
}

function selectMarketplaceEntries(entries: SkillManifestEntry[], count: number): ScoredEntry[] {
    const scored: ScoredEntry[] = entries.map((entry) => ({
        ...entry,
        score: scoreEntry(entry),
        methodKey: normalizeText(entry.coreMethod),
        domainKey: normalizeText(entry.domain),
        titleKey: normalizeText(entry.title)
    }));

    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.id - b.id;
    });

    const selected: ScoredEntry[] = [];
    const methodCounts = new Map<string, number>();
    const domainCounts = new Map<string, number>();
    const titleSeen = new Set<string>();

    const trySelect = (entry: ScoredEntry) => {
        const methodCount = methodCounts.get(entry.methodKey) || 0;
        const domainCount = domainCounts.get(entry.domainKey) || 0;
        if (methodCount >= MAX_PER_METHOD) return false;
        if (domainCount >= MAX_PER_DOMAIN) return false;
        if (titleSeen.has(entry.titleKey)) return false;
        selected.push(entry);
        methodCounts.set(entry.methodKey, methodCount + 1);
        domainCounts.set(entry.domainKey, domainCount + 1);
        titleSeen.add(entry.titleKey);
        return true;
    };

    for (const entry of scored) {
        if (selected.length >= count) break;
        if (!PRIORITY_DOMAINS.has(entry.domain.toLowerCase())) continue;
        trySelect(entry);
    }

    for (const entry of scored) {
        if (selected.length >= count) break;
        trySelect(entry);
    }

    return selected;
}

function buildMarketplaceSkillName(
    implementation: SkillImplementation,
    usedNames: Set<string>
): string {
    const idPart = String(implementation.skillId).padStart(4, '0');
    const methodSlug = slugify(implementation.runtimeProfile?.coreMethod || implementation.title || 'skill');
    const base = `openclaw-${idPart}-${methodSlug}`;
    const trimmed = base.slice(0, 64).replace(/-+$/g, '');
    let candidate = trimmed || `openclaw-${idPart}`;
    let suffix = 1;
    while (usedNames.has(candidate)) {
        const suffixValue = `-${suffix}`;
        const allowed = Math.max(1, 64 - suffixValue.length);
        candidate = `${candidate.slice(0, allowed)}${suffixValue}`.replace(/-+$/g, '');
        suffix += 1;
    }
    usedNames.add(candidate);
    return candidate;
}

function buildMarketplaceFolderName(entry: SkillManifestEntry): string {
    const idPart = String(entry.id).padStart(4, '0');
    const slug = slugify(entry.title).slice(0, 80);
    return `${idPart}-${slug}`.replace(/-+$/g, '');
}

function yamlQuote(value: string): string {
    return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function renderOpenAiYaml(implementation: SkillImplementation): string {
    const displayName = truncate(implementation.title, 60);
    const shortDescription = truncate(
        `${capitalize(implementation.runtimeProfile.coreMethod)} for ${implementation.domain} with guardrails and measurable outcomes.`,
        120
    );
    const defaultPrompt = truncate(
        `Use ${implementation.title} to scope the task, execute the workflow, enforce guardrails, and return a concrete outcome artifact with next actions.`,
        220
    );

    return [
        'interface:',
        `  display_name: ${yamlQuote(displayName)}`,
        `  short_description: ${yamlQuote(shortDescription)}`,
        `  default_prompt: ${yamlQuote(defaultPrompt)}`,
        ''
    ].join('\n');
}

function renderBulletList(items: string[]): string {
    if (!Array.isArray(items) || items.length === 0) {
        return '- None specified.';
    }
    return items.map((item) => `- ${String(item || '').trim()}`).join('\n');
}

function renderNumberedSteps(items: string[]): string {
    if (!Array.isArray(items) || items.length === 0) {
        return '1. Define the target outcome and measurable constraints.';
    }
    return items.map((item, index) => `${index + 1}. ${String(item || '').trim()}`).join('\n');
}

function renderSkillMarkdown(
    implementation: SkillImplementation,
    marketplaceSkillName: string
): string {
    const title = implementation.title;
    const domain = implementation.domain;
    const method = implementation.runtimeProfile.coreMethod;
    const primaryArtifact = implementation.runtimeProfile.primaryArtifact;
    const reason = String(implementation.reason || '').trim();
    const description = truncate(
        `${title}. Use when work requires ${method} for ${domain} with guardrails, traceable execution, and measurable outcomes.`,
        260
    );

    const runbook = implementation.improvementProfile?.runbook;
    const preflight = runbook?.preflight || [];
    const execution = runbook?.execution || [];
    const recovery = runbook?.recovery || [];
    const handoff = runbook?.handoff || [];
    const guardrails = implementation.improvementProfile?.guardrails || [];
    const outcomes = implementation.improvementProfile?.outcomes;
    const kpis = implementation.runtimeProfile.kpiFocus || [];

    const guardrailLines = guardrails.length === 0
        ? '- [quality] Require validations before promoting outputs.'
        : guardrails.map((guardrail) => (
            `- [${guardrail.kind}] ${guardrail.rule} Automation: \`${guardrail.automation}\``
        )).join('\n');

    return `---
name: ${marketplaceSkillName}
description: ${description}
---

# ${title}

## Mission
${reason || `Execute ${method} reliably in ${domain}.`}

## Activation Cues
- Task requires ${method} in ${domain}.
- Task needs explicit risk controls, approval gates, and traceable outcomes.
- Task output must include artifact handoff for humans and agents.

## Execution Plan
${renderNumberedSteps(implementation.implementationGuide || [])}

## Runbook
Preflight:
${renderBulletList(preflight)}

Execution:
${renderBulletList(execution)}

Recovery:
${renderBulletList(recovery)}

Handoff:
${renderBulletList(handoff)}

## Guardrails
${guardrailLines}

## Success Metrics
- Primary metric: ${outcomes?.primaryMetric || kpis[0] || 'Outcome quality index'}
- Secondary metrics: ${(outcomes?.secondaryMetrics || kpis.slice(1)).join(', ') || 'Cycle time, error rate'}
- Review cadence: ${outcomes?.reviewCadence || 'weekly'}

## Output Contract
- Return a concise execution summary with key decisions.
- Return risk and mitigation notes with unresolved blockers.
- Return artifact target: \`${primaryArtifact}\`.
- Return recommended follow-up tasks for next wave execution.
`;
}

function renderIndexMarkdown(catalog: MarketplaceCatalog): string {
    const lines = [
        '# Marketplace Skills Catalog',
        '',
        `Generated at: ${catalog.generatedAt}`,
        `Source manifest: \`${catalog.sourceManifest}\``,
        `Total skills: ${catalog.count}`,
        '',
        '| Skill ID | Marketplace Name | Title | Domain | Method | Archetype | Score |',
        '| --- | --- | --- | --- | --- | --- | --- |',
        ...catalog.entries.map((entry) => (
            `| ${entry.id} | \`${entry.marketplaceSkillName}\` | ${entry.title.replace(/\|/g, '\\|')} | ` +
            `${entry.domain.replace(/\|/g, '\\|')} | ${entry.coreMethod.replace(/\|/g, '\\|')} | ` +
            `${entry.runtimeArchetype.replace(/\|/g, '\\|')} | ${entry.score} |`
        )),
        ''
    ];
    return lines.join('\n');
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    const manifestPath = resolveManifestPath();
    const manifest = loadJson<SkillManifestEntry[]>(manifestPath);
    assert(Array.isArray(manifest) && manifest.length > 0, `Invalid manifest: ${manifestPath}`);

    const selected = selectMarketplaceEntries(manifest, options.count);
    assert(selected.length > 0, 'No marketplace skills selected.');

    if (options.clean && !options.dryRun && fs.existsSync(MARKETPLACE_GENERATED_ROOT)) {
        fs.rmSync(MARKETPLACE_GENERATED_ROOT, { recursive: true, force: true });
    }

    if (!options.dryRun) {
        fs.mkdirSync(MARKETPLACE_GENERATED_ROOT, { recursive: true });
    }

    const usedNames = new Set<string>();
    const catalogEntries: MarketplaceCatalogEntry[] = [];

    for (const entry of selected) {
        const implementationPath = path.join(REPO_ROOT, entry.implementationPath);
        if (!fs.existsSync(implementationPath)) {
            console.warn(`[build-marketplace-skills] Skipping ${entry.id}; missing implementation ${entry.implementationPath}`);
            continue;
        }

        const implementation = loadJson<SkillImplementation>(implementationPath);
        const marketplaceSkillName = buildMarketplaceSkillName(implementation, usedNames);
        const folderName = buildMarketplaceFolderName(entry);
        const skillDir = path.join(MARKETPLACE_GENERATED_ROOT, folderName);
        const agentsDir = path.join(skillDir, 'agents');
        const referencesDir = path.join(skillDir, 'references');

        const skillPath = path.join(skillDir, 'SKILL.md');
        const openaiYamlPath = path.join(agentsDir, 'openai.yaml');
        const refImplementationPath = path.join(referencesDir, 'implementation.json');

        if (!options.dryRun) {
            fs.mkdirSync(agentsDir, { recursive: true });
            fs.mkdirSync(referencesDir, { recursive: true });

            fs.writeFileSync(skillPath, renderSkillMarkdown(implementation, marketplaceSkillName));
            fs.writeFileSync(openaiYamlPath, renderOpenAiYaml(implementation));
            fs.writeFileSync(refImplementationPath, `${JSON.stringify(implementation, null, 2)}\n`);
        }

        catalogEntries.push({
            id: entry.id,
            marketplaceSkillName,
            title: entry.title,
            domain: entry.domain,
            coreMethod: entry.coreMethod,
            runtimeArchetype: entry.runtimeArchetype,
            score: entry.score,
            sourceSkillPath: entry.path,
            sourceImplementationPath: entry.implementationPath,
            marketplacePath: `skills/marketplace/generated/${folderName}/SKILL.md`,
            openaiYamlPath: `skills/marketplace/generated/${folderName}/agents/openai.yaml`
        });
    }

    const catalog: MarketplaceCatalog = {
        version: 1,
        generatedAt: new Date().toISOString(),
        sourceManifest: path.relative(REPO_ROOT, manifestPath),
        count: catalogEntries.length,
        entries: catalogEntries
    };

    if (!options.dryRun) {
        fs.mkdirSync(MARKETPLACE_ROOT, { recursive: true });
        fs.writeFileSync(CATALOG_JSON_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
        fs.writeFileSync(INDEX_MD_PATH, `${renderIndexMarkdown(catalog)}\n`);
    }

    console.log(`[build-marketplace-skills] Selected ${catalogEntries.length} skills from ${path.basename(manifestPath)}.`);
    console.log(`[build-marketplace-skills] Output root: ${path.relative(REPO_ROOT, MARKETPLACE_ROOT)}`);
    console.log(`[build-marketplace-skills] Top 10 picks: ${catalogEntries.slice(0, 10).map((entry) => entry.id).join(', ')}`);
}

main();
