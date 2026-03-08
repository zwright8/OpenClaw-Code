import fs from 'fs';
import path from 'path';

type ToolIdeasManifestEntry = {
    id: number;
    name: string;
    title: string;
    provider: string;
    operation: string;
    shard: string;
    tier: 'foundation' | 'advanced' | 'mission_critical';
    apiKeyLikelyRequired: boolean;
    path: string;
    implementationPath: string;
    adapterPath: string;
};

type ToolIdeasManifest = {
    version: number;
    generatedAt: string;
    sourceManifest: string;
    count: number;
    entries: ToolIdeasManifestEntry[];
};

const REPO_ROOT = process.cwd();
const MANIFEST_PATH = path.join(REPO_ROOT, 'skills', 'generated', 'shards', 'tool-ideas.manifest.json');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function parseFrontmatter(markdown: string): Record<string, string> {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) return {};
    const result: Record<string, string> = {};
    for (const line of match[1].split('\n')) {
        const index = line.indexOf(':');
        if (index < 0) continue;
        result[line.slice(0, index).trim()] = line.slice(index + 1).trim();
    }
    return result;
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function validateSkillMarkdown(filePath: string, expectedName: string) {
    const markdown = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(markdown);
    assert(frontmatter.name === expectedName, `Frontmatter name mismatch in ${filePath}`);
    assert(typeof frontmatter.description === 'string' && frontmatter.description.length > 0, `Missing description in ${filePath}`);
    assert(markdown.includes('## Auth & Access Profile'), `Missing auth section in ${filePath}`);
    assert(markdown.includes('## Credential Reuse Policy'), `Missing credential reuse section in ${filePath}`);
    assert(markdown.includes('## Step-by-Step Implementation Guide'), `Missing implementation guide in ${filePath}`);
}

function validateImplementation(filePath: string, entry: ToolIdeasManifestEntry) {
    const raw = loadJson<Record<string, unknown>>(filePath);
    assert(raw.skillId === entry.id, `Implementation skillId mismatch in ${filePath}`);
    assert(raw.skillName === entry.name, `Implementation skillName mismatch in ${filePath}`);
    assert(raw.title === entry.title, `Implementation title mismatch in ${filePath}`);
    assert(typeof raw.reason === 'string' && raw.reason.length > 0, `Missing reason in ${filePath}`);

    const implementationGuide = raw.implementationGuide as unknown[];
    assert(Array.isArray(implementationGuide) && implementationGuide.length >= 6, `Invalid implementation guide in ${filePath}`);

    const runtimeProfile = raw.runtimeProfile as Record<string, unknown>;
    assert(runtimeProfile && typeof runtimeProfile === 'object', `Missing runtimeProfile in ${filePath}`);
    assert(typeof runtimeProfile.archetype === 'string' && runtimeProfile.archetype.length > 0, `Missing archetype in ${filePath}`);
    assert(Array.isArray(runtimeProfile.kpiFocus) && runtimeProfile.kpiFocus.length >= 3, `Missing KPI focus in ${filePath}`);

    const improvementProfile = raw.improvementProfile as Record<string, unknown>;
    assert(improvementProfile && typeof improvementProfile === 'object', `Missing improvementProfile in ${filePath}`);
    assert(improvementProfile.tier === entry.tier, `Improvement tier mismatch in ${filePath}`);

    const integrationProfile = raw.integrationProfile as Record<string, unknown>;
    assert(integrationProfile && typeof integrationProfile === 'object', `Missing integrationProfile in ${filePath}`);
    assert(integrationProfile.provider === entry.provider, `Provider mismatch in ${filePath}`);
    assert(integrationProfile.operationSlug === entry.operation, `Operation mismatch in ${filePath}`);
    assert(integrationProfile.apiKeyLikelyRequired === entry.apiKeyLikelyRequired, `API key hint mismatch in ${filePath}`);
    const authModes = integrationProfile.authModes as unknown[];
    assert(Array.isArray(authModes) && authModes.length >= 1, `Missing authModes in ${filePath}`);
}

function main() {
    assert(fs.existsSync(MANIFEST_PATH), `Missing manifest: ${MANIFEST_PATH}`);
    const manifest = loadJson<ToolIdeasManifest>(MANIFEST_PATH);
    assert(manifest.version === 1, 'Invalid tool ideas manifest version');
    assert(Array.isArray(manifest.entries), 'Tool ideas manifest entries must be an array');
    assert(manifest.entries.length === 1000, `Expected 1000 tool shard skills, found ${manifest.entries.length}`);
    assert(manifest.count === manifest.entries.length, 'Tool ideas manifest count mismatch');

    const seenIds = new Set<number>();
    const seenNames = new Set<string>();

    for (const entry of manifest.entries) {
        assert(!seenIds.has(entry.id), `Duplicate skill id in manifest: ${entry.id}`);
        assert(!seenNames.has(entry.name), `Duplicate skill name in manifest: ${entry.name}`);
        seenIds.add(entry.id);
        seenNames.add(entry.name);

        const skillPath = path.join(REPO_ROOT, entry.path);
        const implementationPath = path.join(REPO_ROOT, entry.implementationPath);
        const adapterPath = path.join(REPO_ROOT, entry.adapterPath);
        const skillDir = path.dirname(skillPath);
        const fixturePath = path.join(skillDir, 'fixtures', 'minimal-valid.json');
        const regressionPath = path.join(skillDir, 'tests', 'regression-case.md');
        const hardeningPath = path.join(skillDir, 'hardening-summary.json');

        assert(fs.existsSync(skillPath), `Missing skill markdown for ${entry.id}: ${entry.path}`);
        assert(fs.existsSync(implementationPath), `Missing implementation for ${entry.id}: ${entry.implementationPath}`);
        assert(fs.existsSync(adapterPath), `Missing adapter for ${entry.id}: ${entry.adapterPath}`);
        assert(fs.existsSync(fixturePath), `Missing fixture for ${entry.id}: ${fixturePath}`);
        assert(fs.existsSync(regressionPath), `Missing regression case for ${entry.id}: ${regressionPath}`);
        assert(fs.existsSync(hardeningPath), `Missing hardening summary for ${entry.id}: ${hardeningPath}`);

        validateSkillMarkdown(skillPath, entry.name);
        validateImplementation(implementationPath, entry);

        const hardening = loadJson<Record<string, unknown>>(hardeningPath);
        assert(hardening.hardened === true, `Hardening summary not marked hardened for ${entry.id}`);
    }

    console.log('[validate-tool-shard-skills] Validated 1000 hardened tool shard skills successfully.');
}

main();
