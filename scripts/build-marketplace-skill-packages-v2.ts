import fs from 'fs';
import path from 'path';

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
    marketplacePath: string;
};

type MarketplaceCatalog = {
    version: number;
    generatedAt: string;
    count: number;
    entries: MarketplaceCatalogEntry[];
};

type Scorecard = {
    skillId: number;
    qualityScore: number;
    reliabilityScore: number;
    roiScore: number;
    recommendedPriceTier: 'starter' | 'growth' | 'pro' | 'enterprise';
    qualitySignals: {
        guardrailCount: number;
        validationSuiteCount: number;
        improvementTier: string;
        autopilotReady: boolean;
    };
};

type ScorecardsPayload = {
    version: number;
    generatedAt: string;
    count: number;
    entries: Scorecard[];
};

type JsonSchema = {
    $schema: string;
    title: string;
    type: 'object';
    additionalProperties: boolean;
    properties: Record<string, unknown>;
    required: string[];
};

type SkillPackageSpec = {
    packageVersion: string;
    schemaVersion: number;
    skill: {
        id: number;
        name: string;
        title: string;
        domain: string;
        verticalId: string;
        verticalName: string;
        method: string;
        archetype: string;
    };
    contracts: {
        inputSchemaPath: string;
        outputSchemaPath: string;
    };
    quality: {
        score: number;
        roiScore: number;
        trustBadges: string[];
    };
    references: {
        implementationPath: string;
        sourceMarketplacePath: string;
    };
};

type BuildOptions = {
    clean: boolean;
    count: number;
};

type V2CatalogEntry = {
    id: number;
    packageName: string;
    title: string;
    verticalId: string;
    domain: string;
    method: string;
    archetype: string;
    qualityScore: number;
    roiScore: number;
    trustBadges: string[];
    packagePath: string;
    runnerPath: string;
    inputSchemaPath: string;
    outputSchemaPath: string;
};

type V2Catalog = {
    version: 1;
    generatedAt: string;
    sourceCatalog: string;
    sourceScorecards: string;
    count: number;
    entries: V2CatalogEntry[];
};

const REPO_ROOT = process.cwd();
const MARKETPLACE_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace');
const V2_ROOT = path.join(MARKETPLACE_ROOT, 'v2');
const V2_PACKAGES_ROOT = path.join(V2_ROOT, 'packages');
const CATALOG_PATH = path.join(MARKETPLACE_ROOT, 'skills.catalog.json');
const SCORECARDS_PATH = path.join(MARKETPLACE_ROOT, 'analytics', 'scorecards.json');
const V2_CATALOG_PATH = path.join(V2_ROOT, 'catalog.json');
const V2_INDEX_PATH = path.join(V2_ROOT, 'INDEX.md');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function slugify(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function parseArgs(argv: string[]): BuildOptions {
    const options: BuildOptions = {
        clean: false,
        count: 500
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '--clean') {
            options.clean = true;
            continue;
        }
        if (token === '--count') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --count');
            const parsed = Number(next);
            assert(Number.isInteger(parsed) && parsed > 0, `Invalid --count value: ${next}`);
            options.count = parsed;
            index += 1;
            continue;
        }
    }

    return options;
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function quoteYaml(value: string): string {
    return `"${String(value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function buildTrustBadges(scorecard: Scorecard): string[] {
    const badges: string[] = [];
    if (scorecard.qualityScore >= 90) badges.push('Verified-Quality');
    if (scorecard.reliabilityScore >= 85) badges.push('Reliability-Proven');
    if (scorecard.roiScore >= 80) badges.push('ROI-Proven');
    if (scorecard.recommendedPriceTier === 'enterprise') badges.push('Enterprise-Ready');
    if (scorecard.qualitySignals.autopilotReady) badges.push('Autopilot-Ready');
    if (scorecard.qualitySignals.guardrailCount >= 4 && scorecard.qualitySignals.validationSuiteCount >= 4) {
        badges.push('Safety-Hardened');
    }
    if (badges.length === 0) badges.push('Baseline-Validated');
    return badges;
}

function buildInputSchema(title: string): JsonSchema {
    return {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        title: `${title}Input`,
        type: 'object',
        additionalProperties: false,
        required: ['task', 'objective', 'constraints', 'context'],
        properties: {
            task: { type: 'string', minLength: 3, maxLength: 300 },
            objective: { type: 'string', minLength: 3, maxLength: 600 },
            constraints: {
                type: 'array',
                items: { type: 'string', minLength: 1, maxLength: 280 }
            },
            context: {
                type: 'object',
                additionalProperties: false,
                required: ['urgency', 'riskTolerance', 'budgetTier'],
                properties: {
                    urgency: { type: 'string', enum: ['low', 'medium', 'high'] },
                    riskTolerance: { type: 'string', enum: ['low', 'medium', 'high'] },
                    budgetTier: { type: 'string', enum: ['small', 'medium', 'large'] }
                }
            }
        }
    };
}

function buildOutputSchema(title: string): JsonSchema {
    return {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        title: `${title}Output`,
        type: 'object',
        additionalProperties: false,
        required: ['status', 'summary', 'plan', 'controls', 'kpis', 'evidence'],
        properties: {
            status: { type: 'string', enum: ['ready', 'needs_review'] },
            summary: { type: 'string', minLength: 5, maxLength: 1400 },
            plan: {
                type: 'array',
                items: { type: 'string', minLength: 1, maxLength: 400 }
            },
            controls: {
                type: 'array',
                items: { type: 'string', minLength: 1, maxLength: 400 }
            },
            kpis: {
                type: 'array',
                items: { type: 'string', minLength: 1, maxLength: 220 }
            },
            evidence: {
                type: 'object',
                additionalProperties: false,
                required: ['sourceSkillId', 'sourceImplementationPath', 'generatedAt'],
                properties: {
                    sourceSkillId: { type: 'number', minimum: 1 },
                    sourceImplementationPath: { type: 'string', minLength: 3 },
                    generatedAt: { type: 'string', minLength: 20 }
                }
            }
        }
    };
}

function renderSkillYaml(spec: SkillPackageSpec): string {
    return [
        `package_version: ${quoteYaml(spec.packageVersion)}`,
        `schema_version: ${spec.schemaVersion}`,
        'skill:',
        `  id: ${spec.skill.id}`,
        `  name: ${quoteYaml(spec.skill.name)}`,
        `  title: ${quoteYaml(spec.skill.title)}`,
        `  domain: ${quoteYaml(spec.skill.domain)}`,
        `  vertical_id: ${quoteYaml(spec.skill.verticalId)}`,
        `  vertical_name: ${quoteYaml(spec.skill.verticalName)}`,
        `  method: ${quoteYaml(spec.skill.method)}`,
        `  archetype: ${quoteYaml(spec.skill.archetype)}`,
        'contracts:',
        `  input_schema_path: ${quoteYaml(spec.contracts.inputSchemaPath)}`,
        `  output_schema_path: ${quoteYaml(spec.contracts.outputSchemaPath)}`,
        'quality:',
        `  score: ${spec.quality.score}`,
        `  roi_score: ${spec.quality.roiScore}`,
        '  trust_badges:',
        ...spec.quality.trustBadges.map((badge) => `    - ${quoteYaml(badge)}`),
        'references:',
        `  implementation_path: ${quoteYaml(spec.references.implementationPath)}`,
        `  source_marketplace_path: ${quoteYaml(spec.references.sourceMarketplacePath)}`,
        ''
    ].join('\n');
}

function renderGuardrailsYaml(implementation: Record<string, unknown>): string {
    const improvement = implementation.improvementProfile as Record<string, unknown> | undefined;
    const guardrails = improvement?.guardrails as Array<Record<string, unknown>> | undefined;

    const lines = ['guardrails:'];
    if (!Array.isArray(guardrails) || guardrails.length === 0) {
        lines.push('  - kind: "quality"');
        lines.push('    rule: "Require contract validation before execution."');
        lines.push('    automation: "contract-validation"');
        lines.push('');
        return lines.join('\n');
    }

    for (const guardrail of guardrails) {
        lines.push(`  - kind: ${quoteYaml(String(guardrail.kind || 'quality'))}`);
        lines.push(`    rule: ${quoteYaml(String(guardrail.rule || 'Apply runtime guardrail.'))}`);
        lines.push(`    automation: ${quoteYaml(String(guardrail.automation || 'manual-review'))}`);
    }
    lines.push('');
    return lines.join('\n');
}

function renderObservabilityYaml(scorecard: Scorecard): string {
    return [
        'observability:',
        `  quality_score: ${scorecard.qualityScore}`,
        `  reliability_score: ${scorecard.reliabilityScore}`,
        `  roi_score: ${scorecard.roiScore}`,
        `  price_tier: ${quoteYaml(scorecard.recommendedPriceTier)}`,
        `  improvement_tier: ${quoteYaml(scorecard.qualitySignals.improvementTier)}`,
        `  autopilot_ready: ${scorecard.qualitySignals.autopilotReady ? 'true' : 'false'}`,
        `  guardrail_count: ${scorecard.qualitySignals.guardrailCount}`,
        `  validation_suite_count: ${scorecard.qualitySignals.validationSuiteCount}`,
        ''
    ].join('\n');
}

function renderRunnerTs(): string {
    return [
        "import { runSkillPackage } " + "from '../../runtime/runner-core.js';",
        "import path from 'path';",
        "import { fileURLToPath } from 'url';",
        '',
        'const __filename = fileURLToPath(import.meta.url);',
        'const __dirname = path.dirname(__filename);',
        '',
        'const input = {',
        "    task: 'Execute skill package runner',",
        "    objective: 'Generate a guardrail-compliant execution plan',",
        "    constraints: ['Respect policy guardrails', 'Produce deterministic summary'],",
        '    context: {',
        "        urgency: 'medium',",
        "        riskTolerance: 'medium',",
        "        budgetTier: 'medium'",
        '    }',
        '};',
        '',
        'const result = runSkillPackage(__dirname, input);',
        'console.log(JSON.stringify(result, null, 2));',
        ''
    ].join('\n');
}

function renderReadme(spec: SkillPackageSpec): string {
    return [
        `# ${spec.skill.title} (Skill Package v2)`,
        '',
        `Skill ID: ${spec.skill.id}`,
        `Package Name: ${spec.skill.name}`,
        `Vertical: ${spec.skill.verticalName}`,
        `Domain: ${spec.skill.domain}`,
        `Method: ${spec.skill.method}`,
        `Archetype: ${spec.skill.archetype}`,
        '',
        '## Trust Badges',
        ...spec.quality.trustBadges.map((badge) => `- ${badge}`),
        '',
        '## Contract Files',
        '- `input.schema.json`',
        '- `output.schema.json`',
        '- `guardrails.yaml`',
        '- `observability.yaml`',
        '',
        '## Run Demo',
        '```bash',
        'tsx runner.ts',
        '```',
        ''
    ].join('\n');
}

function renderIndex(catalog: V2Catalog): string {
    const lines = [
        '# Skill Package v2 Catalog',
        '',
        `Generated at: ${catalog.generatedAt}`,
        `Source catalog: \`${catalog.sourceCatalog}\``,
        `Source scorecards: \`${catalog.sourceScorecards}\``,
        `Total packages: ${catalog.count}`,
        '',
        '| Skill ID | Package Name | Vertical | Domain | Method | Quality | ROI | Badges |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
        ...catalog.entries.map((entry) => (
            `| ${entry.id} | \`${entry.packageName}\` | ${entry.verticalId} | ${entry.domain.replace(/\|/g, '\\|')} | ` +
            `${entry.method.replace(/\|/g, '\\|')} | ${entry.qualityScore} | ${entry.roiScore} | ${entry.trustBadges.join(', ')} |`
        )),
        ''
    ];
    return lines.join('\n');
}

function main() {
    const options = parseArgs(process.argv.slice(2));

    assert(fs.existsSync(CATALOG_PATH), `Missing catalog: ${CATALOG_PATH}`);
    assert(fs.existsSync(SCORECARDS_PATH), `Missing scorecards: ${SCORECARDS_PATH}`);

    const catalog = loadJson<MarketplaceCatalog>(CATALOG_PATH);
    const scorecards = loadJson<ScorecardsPayload>(SCORECARDS_PATH);
    const scorecardById = new Map<number, Scorecard>(scorecards.entries.map((entry) => [entry.skillId, entry]));

    if (options.clean && fs.existsSync(V2_PACKAGES_ROOT)) {
        fs.rmSync(V2_PACKAGES_ROOT, { recursive: true, force: true });
    }
    fs.mkdirSync(V2_PACKAGES_ROOT, { recursive: true });

    const selected = catalog.entries.slice(0, options.count);
    const entries: V2CatalogEntry[] = [];

    for (const source of selected) {
        const scorecard = scorecardById.get(source.id);
        if (!scorecard) {
            console.warn(`[build-marketplace-skill-packages-v2] Missing scorecard for skill ${source.id}, skipping.`);
            continue;
        }

        const packageFolder = `${String(source.id).padStart(4, '0')}-${slugify(source.title).slice(0, 72)}`;
        const packageDir = path.join(V2_PACKAGES_ROOT, packageFolder);
        const refsDir = path.join(packageDir, 'references');
        const testsDir = path.join(packageDir, 'tests', 'fixtures');
        fs.mkdirSync(refsDir, { recursive: true });
        fs.mkdirSync(testsDir, { recursive: true });

        const sourceSkillPath = path.join(REPO_ROOT, source.marketplacePath);
        const sourceSkillDir = path.dirname(sourceSkillPath);
        const sourceImplementationPath = path.join(sourceSkillDir, 'references', 'implementation.json');
        assert(fs.existsSync(sourceImplementationPath), `Missing source implementation: ${sourceImplementationPath}`);

        const implementation = loadJson<Record<string, unknown>>(sourceImplementationPath);

        const trustBadges = buildTrustBadges(scorecard);
        const packageName = `openclaw-v2-${String(source.id).padStart(4, '0')}-${slugify(source.coreMethod).slice(0, 40)}`;

        const spec: SkillPackageSpec = {
            packageVersion: '2.0.0',
            schemaVersion: 1,
            skill: {
                id: source.id,
                name: packageName,
                title: source.title,
                domain: source.domain,
                verticalId: source.verticalId,
                verticalName: source.verticalName,
                method: source.coreMethod,
                archetype: source.runtimeArchetype
            },
            contracts: {
                inputSchemaPath: 'input.schema.json',
                outputSchemaPath: 'output.schema.json'
            },
            quality: {
                score: scorecard.qualityScore,
                roiScore: scorecard.roiScore,
                trustBadges
            },
            references: {
                implementationPath: 'references/implementation.json',
                sourceMarketplacePath: source.marketplacePath
            }
        };

        const inputSchema = buildInputSchema(source.title);
        const outputSchema = buildOutputSchema(source.title);

        fs.writeFileSync(path.join(packageDir, 'skill.json'), `${JSON.stringify(spec, null, 2)}\n`);
        fs.writeFileSync(path.join(packageDir, 'skill.yaml'), renderSkillYaml(spec));
        fs.writeFileSync(path.join(packageDir, 'input.schema.json'), `${JSON.stringify(inputSchema, null, 2)}\n`);
        fs.writeFileSync(path.join(packageDir, 'output.schema.json'), `${JSON.stringify(outputSchema, null, 2)}\n`);
        fs.writeFileSync(path.join(packageDir, 'guardrails.yaml'), renderGuardrailsYaml(implementation));
        fs.writeFileSync(path.join(packageDir, 'observability.yaml'), renderObservabilityYaml(scorecard));
        fs.writeFileSync(path.join(packageDir, 'runner.ts'), renderRunnerTs());
        fs.writeFileSync(path.join(packageDir, 'README.md'), renderReadme(spec));
        fs.writeFileSync(path.join(refsDir, 'implementation.json'), `${JSON.stringify(implementation, null, 2)}\n`);
        fs.writeFileSync(path.join(testsDir, 'input.sample.json'), `${JSON.stringify({
            task: `Execute ${source.coreMethod}`,
            objective: `Deliver ${source.title} outcome with guardrails`,
            constraints: ['Preserve safety checks', 'Provide measurable KPIs'],
            context: {
                urgency: 'medium',
                riskTolerance: 'medium',
                budgetTier: 'medium'
            }
        }, null, 2)}\n`);

        entries.push({
            id: source.id,
            packageName,
            title: source.title,
            verticalId: source.verticalId,
            domain: source.domain,
            method: source.coreMethod,
            archetype: source.runtimeArchetype,
            qualityScore: scorecard.qualityScore,
            roiScore: scorecard.roiScore,
            trustBadges,
            packagePath: `skills/marketplace/v2/packages/${packageFolder}`,
            runnerPath: `skills/marketplace/v2/packages/${packageFolder}/runner.ts`,
            inputSchemaPath: `skills/marketplace/v2/packages/${packageFolder}/input.schema.json`,
            outputSchemaPath: `skills/marketplace/v2/packages/${packageFolder}/output.schema.json`
        });
    }

    const v2Catalog: V2Catalog = {
        version: 1,
        generatedAt: new Date().toISOString(),
        sourceCatalog: 'skills/marketplace/skills.catalog.json',
        sourceScorecards: 'skills/marketplace/analytics/scorecards.json',
        count: entries.length,
        entries
    };

    fs.mkdirSync(V2_ROOT, { recursive: true });
    fs.writeFileSync(V2_CATALOG_PATH, `${JSON.stringify(v2Catalog, null, 2)}\n`);
    fs.writeFileSync(V2_INDEX_PATH, `${renderIndex(v2Catalog)}\n`);

    console.log(`[build-marketplace-skill-packages-v2] Built ${entries.length} v2 packages.`);
    console.log(`[build-marketplace-skill-packages-v2] Catalog: ${path.relative(REPO_ROOT, V2_CATALOG_PATH)}`);
    console.log(`[build-marketplace-skill-packages-v2] Top package: ${entries[0]?.packageName || 'n/a'}`);
}

main();
