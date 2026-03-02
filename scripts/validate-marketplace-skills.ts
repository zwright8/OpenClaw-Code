import fs from 'fs';
import path from 'path';
import type { SkillImplementation } from '../skills/runtime/types.js';

type MarketplaceCatalogEntry = {
    id: number;
    marketplaceSkillName: string;
    title: string;
    domain: string;
    marketplacePath: string;
    openaiYamlPath: string;
};

type MarketplaceCatalog = {
    version: number;
    generatedAt: string;
    sourceManifest: string;
    count: number;
    entries: MarketplaceCatalogEntry[];
};

const REPO_ROOT = process.cwd();
const CATALOG_PATH = path.join(REPO_ROOT, 'skills', 'marketplace', 'skills.catalog.json');

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

function main() {
    assert(fs.existsSync(CATALOG_PATH), `Missing catalog: ${CATALOG_PATH}`);
    const catalog = loadJson<MarketplaceCatalog>(CATALOG_PATH);

    assert(catalog.version === 1, `Unsupported catalog version: ${catalog.version}`);
    assert(Array.isArray(catalog.entries) && catalog.entries.length > 0, 'Catalog has no entries');
    assert(catalog.count === catalog.entries.length, `Catalog count mismatch: ${catalog.count} != ${catalog.entries.length}`);

    let validated = 0;
    for (const entry of catalog.entries) {
        const skillPath = path.join(REPO_ROOT, entry.marketplacePath);
        const openaiYamlPath = path.join(REPO_ROOT, entry.openaiYamlPath);
        const skillDir = path.dirname(skillPath);
        const implementationPath = path.join(skillDir, 'references', 'implementation.json');

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

    console.log(`[validate-marketplace-skills] Validated ${validated} marketplace skills.`);
    console.log(`[validate-marketplace-skills] Catalog source: ${catalog.sourceManifest}`);
}

main();
