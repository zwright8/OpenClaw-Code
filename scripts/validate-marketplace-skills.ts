import fs from 'fs';
import path from 'path';
import type { SkillImplementation } from '../skills/runtime/types.js';

type MarketplaceCatalogEntry = {
    id: number;
    marketplaceSkillName: string;
    title: string;
    domain: string;
    verticalId: string;
    verticalName: string;
    dedupeSignature: string;
    marketplacePath: string;
    openaiYamlPath: string;
};

type MarketplaceCatalog = {
    version: number;
    generatedAt: string;
    sourceManifest: string;
    count: number;
    selectionPolicy?: {
        targetCount: number;
        dedupe: string[];
        maxPerMethod: number;
        maxPerDomain: number;
        maxPerVertical: number;
    };
    entries: MarketplaceCatalogEntry[];
};

type BundleCatalog = {
    version: number;
    generatedAt: string;
    count: number;
    bundles: Array<{
        verticalId: string;
        verticalName: string;
        count: number;
        bundlePath: string;
        readmePath: string;
        demoPath: string;
    }>;
};

const REPO_ROOT = process.cwd();
const MARKETPLACE_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace');
const CATALOG_PATH = path.join(MARKETPLACE_ROOT, 'skills.catalog.json');
const BUNDLE_CATALOG_PATH = path.join(MARKETPLACE_ROOT, 'bundles', 'bundles.catalog.json');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function validateFrontmatter(markdown: string, expectedName: string) {
    const blockMatch = markdown.match(/^---\n([\s\S]+?)\n---\n/);
    assert(blockMatch, 'Missing YAML frontmatter');
    const block = blockMatch[1];
    assert(/(^|\n)name:\s+.+/.test(block), 'Missing frontmatter name');
    assert(/(^|\n)description:\s+.+/.test(block), 'Missing frontmatter description');
    assert(new RegExp(`(^|\\n)name:\\s+${expectedName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\n|$)`).test(block), 'Frontmatter name mismatch');
}

function validateOpenAiYaml(yaml: string) {
    assert(/(^|\n)interface:\s*(\n|$)/.test(yaml), 'Missing interface block');
    assert(/(^|\n)\s+display_name:\s+.+/.test(yaml), 'Missing interface.display_name');
    assert(/(^|\n)\s+short_description:\s+.+/.test(yaml), 'Missing interface.short_description');
    assert(/(^|\n)\s+default_prompt:\s+.+/.test(yaml), 'Missing interface.default_prompt');
}

function validateBundles(catalog: MarketplaceCatalog) {
    assert(fs.existsSync(BUNDLE_CATALOG_PATH), `Missing bundle catalog: ${BUNDLE_CATALOG_PATH}`);
    const bundleCatalog = loadJson<BundleCatalog>(BUNDLE_CATALOG_PATH);

    assert(bundleCatalog.version === 1, `Unsupported bundle catalog version: ${bundleCatalog.version}`);
    assert(Array.isArray(bundleCatalog.bundles), 'Bundle catalog has no bundles array');
    assert(bundleCatalog.count === bundleCatalog.bundles.length, 'Bundle catalog count mismatch');

    const catalogByVertical = new Map<string, MarketplaceCatalogEntry[]>();
    for (const entry of catalog.entries) {
        const list = catalogByVertical.get(entry.verticalId) || [];
        list.push(entry);
        catalogByVertical.set(entry.verticalId, list);
    }

    for (const bundle of bundleCatalog.bundles) {
        const bundleJsonPath = path.join(REPO_ROOT, bundle.bundlePath);
        const readmePath = path.join(REPO_ROOT, bundle.readmePath);
        const demoPath = path.join(REPO_ROOT, bundle.demoPath);

        assert(fs.existsSync(bundleJsonPath), `Missing bundle JSON: ${bundle.bundlePath}`);
        assert(fs.existsSync(readmePath), `Missing bundle README: ${bundle.readmePath}`);
        assert(fs.existsSync(demoPath), `Missing bundle demos: ${bundle.demoPath}`);

        const expectedCount = (catalogByVertical.get(bundle.verticalId) || []).length;
        assert(expectedCount === bundle.count, `Bundle count mismatch for ${bundle.verticalId}: ${bundle.count} != ${expectedCount}`);
    }
}

function main() {
    assert(fs.existsSync(CATALOG_PATH), `Missing catalog: ${CATALOG_PATH}`);
    const catalog = loadJson<MarketplaceCatalog>(CATALOG_PATH);

    assert(catalog.version >= 1, `Unsupported catalog version: ${catalog.version}`);
    assert(Array.isArray(catalog.entries) && catalog.entries.length > 0, 'Catalog has no entries');
    assert(catalog.count === catalog.entries.length, `Catalog count mismatch: ${catalog.count} != ${catalog.entries.length}`);

    const seenSkillIds = new Set<number>();
    const seenNames = new Set<string>();
    const seenDedupeSignature = new Set<string>();

    let validated = 0;
    for (const entry of catalog.entries) {
        const skillPath = path.join(REPO_ROOT, entry.marketplacePath);
        const openaiYamlPath = path.join(REPO_ROOT, entry.openaiYamlPath);
        const skillDir = path.dirname(skillPath);
        const implementationPath = path.join(skillDir, 'references', 'implementation.json');

        assert(!seenSkillIds.has(entry.id), `Duplicate skill id in catalog: ${entry.id}`);
        seenSkillIds.add(entry.id);
        assert(!seenNames.has(entry.marketplaceSkillName), `Duplicate marketplace skill name: ${entry.marketplaceSkillName}`);
        seenNames.add(entry.marketplaceSkillName);

        assert(typeof entry.verticalId === 'string' && entry.verticalId.length > 0, `Missing verticalId for skill ${entry.id}`);
        assert(typeof entry.verticalName === 'string' && entry.verticalName.length > 0, `Missing verticalName for skill ${entry.id}`);

        const dedupeSignature = String(entry.dedupeSignature || '').trim();
        assert(dedupeSignature.length > 0, `Missing dedupe signature for skill ${entry.id}`);
        assert(!seenDedupeSignature.has(dedupeSignature), `Duplicate dedupe signature: ${dedupeSignature}`);
        seenDedupeSignature.add(dedupeSignature);

        assert(fs.existsSync(skillPath), `Missing SKILL.md: ${entry.marketplacePath}`);
        assert(fs.existsSync(openaiYamlPath), `Missing openai.yaml: ${entry.openaiYamlPath}`);
        assert(fs.existsSync(implementationPath), `Missing references/implementation.json for skill ${entry.id}`);

        const markdown = fs.readFileSync(skillPath, 'utf8');
        const yaml = fs.readFileSync(openaiYamlPath, 'utf8');
        const implementation = loadJson<SkillImplementation>(implementationPath);

        validateFrontmatter(markdown, entry.marketplaceSkillName);
        validateOpenAiYaml(yaml);
        assert(implementation.skillId === entry.id, `Implementation skillId mismatch for ${entry.id}`);
        validated += 1;
    }

    validateBundles(catalog);

    console.log(`[validate-marketplace-skills] Validated ${validated} marketplace skills.`);
    console.log(`[validate-marketplace-skills] Catalog source: ${catalog.sourceManifest}`);
    if (catalog.selectionPolicy) {
        console.log(
            '[validate-marketplace-skills] Selection policy: ' +
            `target=${catalog.selectionPolicy.targetCount}, ` +
            `maxPerMethod=${catalog.selectionPolicy.maxPerMethod}, ` +
            `maxPerDomain=${catalog.selectionPolicy.maxPerDomain}, ` +
            `maxPerVertical=${catalog.selectionPolicy.maxPerVertical}`
        );
    }
}

main();
