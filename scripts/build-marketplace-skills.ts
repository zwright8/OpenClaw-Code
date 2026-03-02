import fs from 'fs';
import path from 'path';
import type { SkillImplementation, SkillManifestEntry } from '../skills/runtime/types.js';

type BuildOptions = {
    count: number;
    clean: boolean;
    dryRun: boolean;
    maxPerMethod: number;
    maxPerDomain: number;
    maxPerVertical: number;
};

type VerticalDefinition = {
    id: string;
    name: string;
    description: string;
    domains: string[];
};

type ScoreRule = {
    key: string;
    label: string;
    pattern: RegExp;
    points: number;
};

type ScoredEntry = SkillManifestEntry & {
    score: number;
    scoreReasons: string[];
    methodKey: string;
    domainKey: string;
    titleKey: string;
    intentKey: string;
    signatureKey: string;
    verticalId: string;
    verticalName: string;
};

type MarketplaceCatalogEntry = {
    id: number;
    marketplaceSkillName: string;
    title: string;
    domain: string;
    verticalId: string;
    verticalName: string;
    coreMethod: string;
    runtimeArchetype: string;
    score: number;
    scoreReasons: string[];
    dedupeSignature: string;
    sourceSkillPath: string;
    sourceImplementationPath: string;
    marketplacePath: string;
    openaiYamlPath: string;
};

type MarketplaceCatalog = {
    version: 2;
    generatedAt: string;
    sourceManifest: string;
    count: number;
    selectionPolicy: {
        targetCount: number;
        dedupe: string[];
        maxPerMethod: number;
        maxPerDomain: number;
        maxPerVertical: number;
    };
    entries: MarketplaceCatalogEntry[];
};

type BundleCatalogEntry = {
    verticalId: string;
    verticalName: string;
    description: string;
    count: number;
    bundlePath: string;
    readmePath: string;
    demoPath: string;
};

type BundleCatalog = {
    version: 1;
    generatedAt: string;
    count: number;
    bundles: BundleCatalogEntry[];
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const MARKETPLACE_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace');
const MARKETPLACE_GENERATED_ROOT = path.join(MARKETPLACE_ROOT, 'generated');
const BUNDLES_ROOT = path.join(MARKETPLACE_ROOT, 'bundles');
const CATALOG_JSON_PATH = path.join(MARKETPLACE_ROOT, 'skills.catalog.json');
const INDEX_MD_PATH = path.join(MARKETPLACE_ROOT, 'INDEX.md');
const BUNDLE_CATALOG_PATH = path.join(BUNDLES_ROOT, 'bundles.catalog.json');
const BUNDLE_INDEX_PATH = path.join(BUNDLES_ROOT, 'INDEX.md');

const MANIFEST_CANDIDATES = [
    'skills.manifest.10000.json',
    'skills.manifest.json'
] as const;

const DEFAULT_COUNT = 500;
const DEFAULT_MAX_PER_METHOD = 12;
const DEFAULT_MAX_PER_DOMAIN = 28;
const DEFAULT_MAX_PER_VERTICAL = 90;

const SCORE_RULES: ScoreRule[] = [
    { key: 'autonomy', label: 'Autonomous workflow leverage', pattern: /autonomous workflow|workflow author/i, points: 8 },
    { key: 'reliability', label: 'Reliability and regression coverage', pattern: /regression sentinel|failure root cause|root cause/i, points: 8 },
    { key: 'risk', label: 'Risk and safety operations', pattern: /risk-aware|risk aware|safety/i, points: 7 },
    { key: 'security', label: 'Security and privacy controls', pattern: /security threat|threat model|privacy-preserving|privacy preserving/i, points: 7 },
    { key: 'compliance', label: 'Compliance and governance posture', pattern: /compliance evidence|approval routing|handoff/i, points: 6 },
    { key: 'knowledge', label: 'Knowledge and retrieval leverage', pattern: /semantic retrieval|knowledge graph/i, points: 6 },
    { key: 'incident', label: 'Incident/disaster readiness', pattern: /incident playbook|disaster recovery/i, points: 6 },
    { key: 'experimentation', label: 'Experimentation and rollout rigor', pattern: /experiment design|a-b rollout|a\/b rollout/i, points: 5 },
    { key: 'metrics', label: 'KPI and economic visibility', pattern: /kpi dashboard|cost-benefit|cost benefit/i, points: 5 },
    { key: 'improvement', label: 'Continuous improvement loop', pattern: /continuous improvement|skill gap|training curriculum/i, points: 4 },
    { key: 'explainability', label: 'Explainability and uncertainty clarity', pattern: /explainability|uncertainty/i, points: 4 },
    { key: 'decision-quality', label: 'Decision quality and focus discipline', pattern: /decision journal|attention management|habit optimization/i, points: 3 }
];

const VERTICALS: VerticalDefinition[] = [
    {
        id: 'engineering-product',
        name: 'Engineering and Product',
        description: 'Software delivery, product execution, design systems, and research operations.',
        domains: [
            'software engineering delivery',
            'product management execution',
            'design and user research',
            'research and development labs',
            'knowledge management systems',
            'remote team collaboration'
        ]
    },
    {
        id: 'business-growth',
        name: 'Business and Growth',
        description: 'Revenue, go-to-market, customer success, and operator productivity.',
        domains: [
            'sales and client success',
            'marketing and storytelling',
            'entrepreneurship operations',
            'customer support operations',
            'personal finance management',
            'supply chain resilience',
            'manufacturing quality assurance'
        ]
    },
    {
        id: 'policy-risk',
        name: 'Policy, Risk, and Security',
        description: 'Legal compliance, cybersecurity, governance, and trust controls.',
        domains: [
            'legal and policy workflows',
            'cybersecurity operations',
            'scientific publishing pipelines',
            'multilingual translation services',
            'journalism and public communication',
            'accessibility services'
        ]
    },
    {
        id: 'health-learning',
        name: 'Health and Learning Systems',
        description: 'Healthcare, education, caregiving, and human capability development.',
        domains: [
            'healthcare operations',
            'education support services',
            'family caregiving systems',
            'eldercare coordination',
            'childcare support systems',
            'mental well-being practices',
            'personal health routines',
            'nutrition and meal planning',
            'fitness and recovery training',
            'lifelong-learning-plans'
        ]
    },
    {
        id: 'public-impact',
        name: 'Public Impact and Resilience',
        description: 'Public service operations, climate resilience, and civic outcomes.',
        domains: [
            'nonprofit program delivery',
            'disaster response networks',
            'climate adaptation initiatives',
            'urban planning and mobility',
            'agriculture and food systems',
            'civic participation platforms',
            'community mediation programs',
            'arts and culture programming'
        ]
    }
];

const FALLBACK_VERTICAL: VerticalDefinition = {
    id: 'general-operations',
    name: 'General Operations',
    description: 'Cross-domain operational skills not mapped to a specific vertical.',
    domains: []
};

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

const DOMAIN_TO_VERTICAL = new Map<string, VerticalDefinition>();
for (const vertical of VERTICALS) {
    for (const domain of vertical.domains) {
        DOMAIN_TO_VERTICAL.set(domain.toLowerCase(), vertical);
    }
}

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
        dryRun: false,
        maxPerMethod: DEFAULT_MAX_PER_METHOD,
        maxPerDomain: DEFAULT_MAX_PER_DOMAIN,
        maxPerVertical: DEFAULT_MAX_PER_VERTICAL
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
        if (token === '--max-per-method') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --max-per-method');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --max-per-method value: ${next}`);
            options.maxPerMethod = parsed;
            index += 1;
            continue;
        }
        if (token === '--max-per-domain') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --max-per-domain');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --max-per-domain value: ${next}`);
            options.maxPerDomain = parsed;
            index += 1;
            continue;
        }
        if (token === '--max-per-vertical') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --max-per-vertical');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --max-per-vertical value: ${next}`);
            options.maxPerVertical = parsed;
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

function extractIntentKey(title: string): string {
    const normalized = normalizeText(title)
        .replace(/\bfor\b\s+[a-z0-9\s]+$/i, '')
        .replace(/\bin\b\s+[a-z0-9\s]+$/i, '')
        .replace(/\s+/g, ' ')
        .trim();
    return normalized || normalizeText(title);
}

function resolveVertical(domain: string): VerticalDefinition {
    const normalized = String(domain || '').toLowerCase();
    return DOMAIN_TO_VERTICAL.get(normalized) || FALLBACK_VERTICAL;
}

function scoreEntry(entry: SkillManifestEntry): { score: number; reasons: string[]; } {
    const corpus = `${entry.title} ${entry.coreMethod} ${entry.runtimeArchetype} ${entry.domain}`.toLowerCase();
    let score = 0;
    const reasons: string[] = [];

    for (const rule of SCORE_RULES) {
        if (rule.pattern.test(corpus)) {
            score += rule.points;
            reasons.push(rule.label);
        }
    }

    if (PRIORITY_DOMAINS.has(entry.domain.toLowerCase())) {
        score += 5;
        reasons.push('Priority domain relevance');
    }
    if (entry.runtimeArchetype.toLowerCase().includes('orchestration')) {
        score += 2;
        reasons.push('Orchestration archetype');
    }
    if (entry.runtimeArchetype.toLowerCase().includes('governance')) {
        score += 2;
        reasons.push('Governance archetype');
    }
    if (entry.runtimeArchetype.toLowerCase().includes('optimization')) {
        score += 2;
        reasons.push('Optimization archetype');
    }
    if (entry.stepCount >= 6) {
        score += 2;
        reasons.push('Implementation depth >= 6 steps');
    }

    return {
        score,
        reasons: reasons.slice(0, 6)
    };
}

function countByKey(entries: ScoredEntry[], keySelector: (entry: ScoredEntry) => string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const entry of entries) {
        const key = keySelector(entry);
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    return counts;
}

function selectMarketplaceEntries(entries: SkillManifestEntry[], options: BuildOptions): ScoredEntry[] {
    const scored: ScoredEntry[] = entries.map((entry) => {
        const scoreResult = scoreEntry(entry);
        const vertical = resolveVertical(entry.domain);
        const methodKey = normalizeText(entry.coreMethod);
        const domainKey = normalizeText(entry.domain);
        const titleKey = normalizeText(entry.title);
        const intentKey = extractIntentKey(entry.title);
        return {
            ...entry,
            score: scoreResult.score,
            scoreReasons: scoreResult.reasons,
            methodKey,
            domainKey,
            titleKey,
            intentKey,
            signatureKey: `${methodKey}|${domainKey}`,
            verticalId: vertical.id,
            verticalName: vertical.name
        };
    });

    scored.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.id - b.id;
    });

    const selected: ScoredEntry[] = [];
    const seenSignature = new Set<string>();
    const seenIntentByDomain = new Set<string>();
    const seenTitle = new Set<string>();
    const methodCounts = new Map<string, number>();
    const domainCounts = new Map<string, number>();
    const verticalCounts = new Map<string, number>();

    const canSelect = (
        entry: ScoredEntry,
        limits: { maxPerMethod: number; maxPerDomain: number; maxPerVertical: number; enforceIntentDedup: boolean; }
    ) => {
        if (seenSignature.has(entry.signatureKey)) return false;
        if (seenTitle.has(entry.titleKey)) return false;
        if (limits.enforceIntentDedup && seenIntentByDomain.has(`${entry.domainKey}|${entry.intentKey}`)) return false;

        const methodCount = methodCounts.get(entry.methodKey) || 0;
        if (methodCount >= limits.maxPerMethod) return false;

        const domainCount = domainCounts.get(entry.domainKey) || 0;
        if (domainCount >= limits.maxPerDomain) return false;

        const verticalCount = verticalCounts.get(entry.verticalId) || 0;
        if (verticalCount >= limits.maxPerVertical) return false;

        return true;
    };

    const commitSelection = (entry: ScoredEntry) => {
        selected.push(entry);
        seenSignature.add(entry.signatureKey);
        seenTitle.add(entry.titleKey);
        seenIntentByDomain.add(`${entry.domainKey}|${entry.intentKey}`);
        methodCounts.set(entry.methodKey, (methodCounts.get(entry.methodKey) || 0) + 1);
        domainCounts.set(entry.domainKey, (domainCounts.get(entry.domainKey) || 0) + 1);
        verticalCounts.set(entry.verticalId, (verticalCounts.get(entry.verticalId) || 0) + 1);
    };

    const strictLimits = {
        maxPerMethod: options.maxPerMethod,
        maxPerDomain: options.maxPerDomain,
        maxPerVertical: options.maxPerVertical,
        enforceIntentDedup: true
    };

    const relaxedLimits = {
        maxPerMethod: options.maxPerMethod * 2,
        maxPerDomain: options.maxPerDomain * 2,
        maxPerVertical: options.maxPerVertical * 2,
        enforceIntentDedup: false
    };

    for (const entry of scored) {
        if (selected.length >= options.count) break;
        if (!PRIORITY_DOMAINS.has(entry.domain.toLowerCase())) continue;
        if (canSelect(entry, strictLimits)) {
            commitSelection(entry);
        }
    }

    for (const entry of scored) {
        if (selected.length >= options.count) break;
        if (canSelect(entry, strictLimits)) {
            commitSelection(entry);
        }
    }

    for (const entry of scored) {
        if (selected.length >= options.count) break;
        if (canSelect(entry, relaxedLimits)) {
            commitSelection(entry);
        }
    }

    if (selected.length < options.count) {
        console.warn(
            `[build-marketplace-skills] Selected ${selected.length} of ${options.count}. ` +
            'Input catalog may not contain enough dedupe-distinct entries for current limits.'
        );
    }

    return selected.slice(0, options.count);
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
        '| Skill ID | Marketplace Name | Title | Vertical | Domain | Method | Archetype | Score |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
        ...catalog.entries.map((entry) => (
            `| ${entry.id} | \`${entry.marketplaceSkillName}\` | ${entry.title.replace(/\|/g, '\\|')} | ` +
            `${entry.verticalName.replace(/\|/g, '\\|')} | ${entry.domain.replace(/\|/g, '\\|')} | ` +
            `${entry.coreMethod.replace(/\|/g, '\\|')} | ${entry.runtimeArchetype.replace(/\|/g, '\\|')} | ${entry.score} |`
        )),
        ''
    ];
    return lines.join('\n');
}

function renderBundleReadme(
    vertical: VerticalDefinition,
    entries: MarketplaceCatalogEntry[],
    generatedAt: string
): string {
    const top = entries
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

    const lines = [
        `# ${vertical.name} Skill Bundle`,
        '',
        `${vertical.description}`,
        '',
        `Generated at: ${generatedAt}`,
        `Total skills: ${entries.length}`,
        '',
        '## Recommended Use Cases',
        '- Build repeatable autonomous workflows in this vertical.',
        '- Deploy guardrail-first operational playbooks with human override paths.',
        '- Instrument KPI and quality reporting for buyers and operators.',
        '',
        '## Top Skills',
        '| Skill ID | Skill Name | Title | Domain | Method | Score |',
        '| --- | --- | --- | --- | --- | --- |',
        ...top.map((entry) => (
            `| ${entry.id} | \`${entry.marketplaceSkillName}\` | ${entry.title.replace(/\|/g, '\\|')} | ` +
            `${entry.domain.replace(/\|/g, '\\|')} | ${entry.coreMethod.replace(/\|/g, '\\|')} | ${entry.score} |`
        )),
        ''
    ];

    return lines.join('\n');
}

function renderBundleDemoPrompts(vertical: VerticalDefinition, entries: MarketplaceCatalogEntry[]): string {
    const top = entries
        .slice()
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

    const lines = [
        `# ${vertical.name} Demo Prompts`,
        '',
        'Use these prompts to demonstrate pack utility and execution quality.',
        ''
    ];

    for (const entry of top) {
        lines.push(`## Demo: ${entry.title}`);
        lines.push(`Prompt: Use ${entry.marketplaceSkillName} to deliver a production-ready ${entry.coreMethod} plan for ${entry.domain}. Include success metrics, risk controls, rollout phases, and handoff tasks.`);
        lines.push('');
    }

    return lines.join('\n');
}

function writeVerticalBundles(catalog: MarketplaceCatalog, dryRun: boolean) {
    const generatedAt = catalog.generatedAt;
    const verticalLookup = new Map<string, VerticalDefinition>(VERTICALS.map((vertical) => [vertical.id, vertical]));
    verticalLookup.set(FALLBACK_VERTICAL.id, FALLBACK_VERTICAL);

    const groups = new Map<string, MarketplaceCatalogEntry[]>();
    for (const entry of catalog.entries) {
        const key = entry.verticalId || FALLBACK_VERTICAL.id;
        const list = groups.get(key) || [];
        list.push(entry);
        groups.set(key, list);
    }

    const bundles: BundleCatalogEntry[] = [];

    if (!dryRun) {
        fs.mkdirSync(BUNDLES_ROOT, { recursive: true });
    }

    const orderedKeys = Array.from(groups.keys()).sort();
    for (const key of orderedKeys) {
        const entries = groups.get(key) || [];
        const vertical = verticalLookup.get(key) || FALLBACK_VERTICAL;

        const bundleRelDir = `skills/marketplace/bundles/${vertical.id}`;
        const bundleDir = path.join(REPO_ROOT, bundleRelDir);
        const bundleJsonPath = path.join(bundleDir, 'bundle.json');
        const readmePath = path.join(bundleDir, 'README.md');
        const demoPath = path.join(bundleDir, 'demo-prompts.md');

        const bundlePayload = {
            version: 1,
            generatedAt,
            verticalId: vertical.id,
            verticalName: vertical.name,
            description: vertical.description,
            count: entries.length,
            entries: entries
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((entry) => ({
                    id: entry.id,
                    marketplaceSkillName: entry.marketplaceSkillName,
                    title: entry.title,
                    domain: entry.domain,
                    coreMethod: entry.coreMethod,
                    score: entry.score,
                    marketplacePath: entry.marketplacePath,
                    openaiYamlPath: entry.openaiYamlPath
                }))
        };

        if (!dryRun) {
            fs.mkdirSync(bundleDir, { recursive: true });
            fs.writeFileSync(bundleJsonPath, `${JSON.stringify(bundlePayload, null, 2)}\n`);
            fs.writeFileSync(readmePath, `${renderBundleReadme(vertical, entries, generatedAt)}\n`);
            fs.writeFileSync(demoPath, `${renderBundleDemoPrompts(vertical, entries)}\n`);
        }

        bundles.push({
            verticalId: vertical.id,
            verticalName: vertical.name,
            description: vertical.description,
            count: entries.length,
            bundlePath: `${bundleRelDir}/bundle.json`,
            readmePath: `${bundleRelDir}/README.md`,
            demoPath: `${bundleRelDir}/demo-prompts.md`
        });
    }

    const bundleCatalog: BundleCatalog = {
        version: 1,
        generatedAt,
        count: bundles.length,
        bundles: bundles.sort((a, b) => a.verticalId.localeCompare(b.verticalId))
    };

    const bundleIndexLines = [
        '# Marketplace Bundles',
        '',
        `Generated at: ${generatedAt}`,
        `Total bundles: ${bundleCatalog.count}`,
        '',
        '| Bundle | Skills | Description |',
        '| --- | --- | --- |',
        ...bundleCatalog.bundles.map((bundle) => (
            `| ${bundle.verticalName} (\`${bundle.verticalId}\`) | ${bundle.count} | ${bundle.description.replace(/\|/g, '\\|')} |`
        )),
        ''
    ];

    if (!dryRun) {
        fs.writeFileSync(BUNDLE_CATALOG_PATH, `${JSON.stringify(bundleCatalog, null, 2)}\n`);
        fs.writeFileSync(BUNDLE_INDEX_PATH, `${bundleIndexLines.join('\n')}\n`);
    }

    return bundleCatalog;
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    const manifestPath = resolveManifestPath();
    const manifest = loadJson<SkillManifestEntry[]>(manifestPath);
    assert(Array.isArray(manifest) && manifest.length > 0, `Invalid manifest: ${manifestPath}`);

    const selected = selectMarketplaceEntries(manifest, options);
    assert(selected.length > 0, 'No marketplace skills selected.');

    if (options.clean && !options.dryRun) {
        if (fs.existsSync(MARKETPLACE_GENERATED_ROOT)) {
            fs.rmSync(MARKETPLACE_GENERATED_ROOT, { recursive: true, force: true });
        }
        if (fs.existsSync(BUNDLES_ROOT)) {
            fs.rmSync(BUNDLES_ROOT, { recursive: true, force: true });
        }
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
            verticalId: entry.verticalId,
            verticalName: entry.verticalName,
            coreMethod: entry.coreMethod,
            runtimeArchetype: entry.runtimeArchetype,
            score: entry.score,
            scoreReasons: entry.scoreReasons,
            dedupeSignature: entry.signatureKey,
            sourceSkillPath: entry.path,
            sourceImplementationPath: entry.implementationPath,
            marketplacePath: `skills/marketplace/generated/${folderName}/SKILL.md`,
            openaiYamlPath: `skills/marketplace/generated/${folderName}/agents/openai.yaml`
        });
    }

    const catalog: MarketplaceCatalog = {
        version: 2,
        generatedAt: new Date().toISOString(),
        sourceManifest: path.relative(REPO_ROOT, manifestPath),
        count: catalogEntries.length,
        selectionPolicy: {
            targetCount: options.count,
            dedupe: [
                'unique coreMethod+domain signature',
                'unique normalized title',
                'strict intent dedupe within domain (first pass)'
            ],
            maxPerMethod: options.maxPerMethod,
            maxPerDomain: options.maxPerDomain,
            maxPerVertical: options.maxPerVertical
        },
        entries: catalogEntries
    };

    const selectedScoredEntries = selected.slice(0, catalogEntries.length);
    const methodCoverage = countByKey(selectedScoredEntries, (entry) => entry.methodKey);
    const domainCoverage = countByKey(selectedScoredEntries, (entry) => entry.domainKey);
    const verticalCoverage = countByKey(selectedScoredEntries, (entry) => entry.verticalId);

    if (!options.dryRun) {
        fs.mkdirSync(MARKETPLACE_ROOT, { recursive: true });
        fs.writeFileSync(CATALOG_JSON_PATH, `${JSON.stringify(catalog, null, 2)}\n`);
        fs.writeFileSync(INDEX_MD_PATH, `${renderIndexMarkdown(catalog)}\n`);
    }

    const bundleCatalog = writeVerticalBundles(catalog, options.dryRun);

    console.log(`[build-marketplace-skills] Selected ${catalogEntries.length} skills from ${path.basename(manifestPath)}.`);
    console.log(`[build-marketplace-skills] Output root: ${path.relative(REPO_ROOT, MARKETPLACE_ROOT)}`);
    console.log(`[build-marketplace-skills] Method coverage: ${methodCoverage.size} methods.`);
    console.log(`[build-marketplace-skills] Domain coverage: ${domainCoverage.size} domains.`);
    console.log(`[build-marketplace-skills] Vertical bundle count: ${bundleCatalog.count}.`);
    console.log(`[build-marketplace-skills] Top 12 picks: ${catalogEntries.slice(0, 12).map((entry) => entry.id).join(', ')}`);
}

main();
