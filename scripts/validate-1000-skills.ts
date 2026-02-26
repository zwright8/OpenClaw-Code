import fs from 'fs';
import path from 'path';

type ManifestEntry = {
    id: number;
    name: string;
    title: string;
    domain: string;
    path: string;
    implementationPath: string;
    reason: string;
    stepCount: number;
    runtimeArchetype: string;
    coreMethod: string;
    primaryArtifact: string;
};

type RuntimeCatalogEntry = {
    id: number;
    name: string;
    domain: string;
    implementationPath: string;
    archetype: string;
    coreMethod: string;
    primaryArtifact: string;
};

type RuntimeCatalog = {
    version: number;
    sourceFile: string;
    generatedAt: string;
    count: number;
    entries: RuntimeCatalogEntry[];
};

const REPO_ROOT = process.cwd();
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const MANIFEST_PATH = path.join(SKILL_ROOT, 'skills.manifest.json');
const RUNTIME_CATALOG_PATH = path.join(SKILL_ROOT, 'runtime.catalog.json');

function parseFrontmatter(markdown: string): Record<string, string> {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) return {};
    const frontmatter: Record<string, string> = {};
    for (const line of match[1].split('\n')) {
        const idx = line.indexOf(':');
        if (idx < 0) continue;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        frontmatter[key] = value;
    }
    return frontmatter;
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function validateSkillMarkdown(filePath: string, expectedName: string) {
    const markdown = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(markdown);
    assert(frontmatter.name, `Missing frontmatter name in ${filePath}`);
    assert(frontmatter.description, `Missing frontmatter description in ${filePath}`);
    assert(frontmatter.name === expectedName, `Frontmatter name mismatch in ${filePath}`);

    const steps = markdown.split('\n').filter((line) => /^\d+\.\s+/.test(line));
    assert(steps.length >= 6, `Expected at least 6 implementation steps in ${filePath}`);
    assert(markdown.includes('## Why This Skill Exists'), `Missing reason section in ${filePath}`);
    assert(markdown.includes('## Step-by-Step Implementation Guide'), `Missing implementation guide in ${filePath}`);
}

function validateNumber(value: unknown, label: string, min = 0, max = 1) {
    const numeric = Number(value);
    assert(Number.isFinite(numeric), `${label} must be numeric`);
    assert(numeric >= min && numeric <= max, `${label} must be between ${min} and ${max}`);
}

function validateImplementation(filePath: string, expectedEntry: ManifestEntry) {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;

    assert(raw.version === 1, `Invalid implementation version in ${filePath}`);
    assert(raw.skillId === expectedEntry.id, `Implementation id mismatch in ${filePath}`);
    assert(raw.skillName === expectedEntry.name, `Implementation name mismatch in ${filePath}`);
    assert(raw.title === expectedEntry.title, `Implementation title mismatch in ${filePath}`);
    assert(raw.domain === expectedEntry.domain, `Implementation domain mismatch in ${filePath}`);

    assert(Array.isArray(raw.implementationGuide), `Missing implementationGuide array in ${filePath}`);
    assert((raw.implementationGuide as unknown[]).length >= 6, `Implementation guide too short in ${filePath}`);

    const runtimeProfile = raw.runtimeProfile as Record<string, unknown>;
    assert(runtimeProfile && typeof runtimeProfile === 'object', `Missing runtimeProfile in ${filePath}`);
    assert(runtimeProfile.archetype === expectedEntry.runtimeArchetype, `Archetype mismatch in ${filePath}`);
    assert(runtimeProfile.coreMethod === expectedEntry.coreMethod, `Core method mismatch in ${filePath}`);
    assert(runtimeProfile.primaryArtifact === expectedEntry.primaryArtifact, `Primary artifact mismatch in ${filePath}`);

    const requiredSignals = runtimeProfile.requiredSignals as unknown[];
    assert(Array.isArray(requiredSignals), `Missing requiredSignals array in ${filePath}`);
    assert(requiredSignals.length >= 3, `Expected >=3 required signals in ${filePath}`);
    assert(requiredSignals.every((value) => typeof value === 'string' && value.length > 0), `Invalid requiredSignals in ${filePath}`);

    const kpiFocus = runtimeProfile.kpiFocus as unknown[];
    assert(Array.isArray(kpiFocus), `Missing kpiFocus array in ${filePath}`);
    assert(kpiFocus.length >= 2, `Expected >=2 KPI focus entries in ${filePath}`);

    const scoringWeights = runtimeProfile.scoringWeights as Record<string, unknown>;
    assert(scoringWeights && typeof scoringWeights === 'object', `Missing scoringWeights in ${filePath}`);
    validateNumber(scoringWeights.truth, `${filePath}: scoringWeights.truth`);
    validateNumber(scoringWeights.execution, `${filePath}: scoringWeights.execution`);
    validateNumber(scoringWeights.safety, `${filePath}: scoringWeights.safety`);
    validateNumber(scoringWeights.impact, `${filePath}: scoringWeights.impact`);
    const totalWeight = Number(scoringWeights.truth)
        + Number(scoringWeights.execution)
        + Number(scoringWeights.safety)
        + Number(scoringWeights.impact);
    assert(Math.abs(totalWeight - 1) <= 0.0015, `Scoring weights must sum to ~1 in ${filePath}`);

    const postureThresholds = runtimeProfile.postureThresholds as Record<string, unknown>;
    assert(postureThresholds && typeof postureThresholds === 'object', `Missing postureThresholds in ${filePath}`);
    assert(
        Number.isFinite(Number(postureThresholds.readyMin))
        && Number.isFinite(Number(postureThresholds.reviewMin))
        && Number.isFinite(Number(postureThresholds.reviewRisk))
        && Number.isFinite(Number(postureThresholds.criticalRisk)),
        `Invalid posture thresholds in ${filePath}`
    );

    const orchestration = runtimeProfile.orchestration as Record<string, unknown>;
    assert(orchestration && typeof orchestration === 'object', `Missing orchestration section in ${filePath}`);
    assert(typeof orchestration.routingTag === 'string' && orchestration.routingTag.length > 0, `Missing routingTag in ${filePath}`);
    const approvalGates = orchestration.approvalGates as unknown[];
    assert(Array.isArray(approvalGates) && approvalGates.length >= 2, `Expected approvalGates in ${filePath}`);
    const retryPolicy = orchestration.retryPolicy as Record<string, unknown>;
    assert(retryPolicy && typeof retryPolicy === 'object', `Missing retryPolicy in ${filePath}`);
    assert(Number(retryPolicy.maxAttempts) >= 1, `Invalid retry maxAttempts in ${filePath}`);
    assert(Number(retryPolicy.baseDelayMs) >= 100, `Invalid retry baseDelayMs in ${filePath}`);
    assert(retryPolicy.backoff === 'exponential', `Invalid retry backoff in ${filePath}`);

    const validation = runtimeProfile.validation as Record<string, unknown>;
    assert(validation && typeof validation === 'object', `Missing validation section in ${filePath}`);
    assert(Array.isArray(validation.suites), `Missing validation suites in ${filePath}`);

    const rollout = runtimeProfile.rollout as Record<string, unknown>;
    assert(rollout && typeof rollout === 'object', `Missing rollout section in ${filePath}`);
    assert(typeof rollout.featureFlag === 'string' && rollout.featureFlag.length > 0, `Missing featureFlag in ${filePath}`);
    assert(Number(rollout.releaseCycles) >= 1, `Invalid releaseCycles in ${filePath}`);
}

function main() {
    assert(fs.existsSync(MANIFEST_PATH), `Missing manifest: ${MANIFEST_PATH}`);
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as ManifestEntry[];
    assert(Array.isArray(manifest), 'Manifest is not an array');
    assert(manifest.length === 1000, `Expected 1000 skills, found ${manifest.length}`);
    assert(fs.existsSync(RUNTIME_CATALOG_PATH), `Missing runtime catalog: ${RUNTIME_CATALOG_PATH}`);

    const runtimeCatalog = JSON.parse(fs.readFileSync(RUNTIME_CATALOG_PATH, 'utf8')) as RuntimeCatalog;
    assert(runtimeCatalog.version === 1, 'Invalid runtime catalog version');
    assert(Array.isArray(runtimeCatalog.entries), 'Runtime catalog entries must be an array');
    assert(runtimeCatalog.entries.length === 1000, `Expected 1000 runtime entries, found ${runtimeCatalog.entries.length}`);
    assert(runtimeCatalog.count === runtimeCatalog.entries.length, 'Runtime catalog count mismatch');

    const runtimeById = new Map<number, RuntimeCatalogEntry>();
    for (const entry of runtimeCatalog.entries) {
        runtimeById.set(entry.id, entry);
    }

    let checked = 0;
    const seenIds = new Set<number>();
    const seenNames = new Set<string>();
    for (const entry of manifest) {
        assert(typeof entry.id === 'number' && entry.id >= 1, `Invalid id in manifest entry ${JSON.stringify(entry)}`);
        assert(typeof entry.name === 'string' && entry.name.length > 0, `Invalid name in manifest entry ${entry.id}`);
        assert(entry.name.length <= 64, `Skill name too long for entry ${entry.id}: ${entry.name}`);
        assert(/^[a-z0-9-]+$/.test(entry.name), `Skill name has invalid characters for entry ${entry.id}: ${entry.name}`);
        assert(!seenIds.has(entry.id), `Duplicate id in manifest: ${entry.id}`);
        assert(!seenNames.has(entry.name), `Duplicate name in manifest: ${entry.name}`);
        seenIds.add(entry.id);
        seenNames.add(entry.name);

        assert(typeof entry.path === 'string' && entry.path.endsWith('/SKILL.md'), `Invalid skill path for entry ${entry.id}`);
        assert(typeof entry.implementationPath === 'string' && entry.implementationPath.endsWith('/implementation.json'), `Invalid implementation path for entry ${entry.id}`);
        assert(typeof entry.runtimeArchetype === 'string' && entry.runtimeArchetype.length > 0, `Missing runtime archetype for entry ${entry.id}`);
        assert(typeof entry.coreMethod === 'string' && entry.coreMethod.length > 0, `Missing core method for entry ${entry.id}`);
        assert(typeof entry.primaryArtifact === 'string' && entry.primaryArtifact.length > 0, `Missing primary artifact for entry ${entry.id}`);

        const absolutePath = path.join(REPO_ROOT, entry.path);
        assert(fs.existsSync(absolutePath), `Missing skill file for entry ${entry.id}: ${entry.path}`);
        validateSkillMarkdown(absolutePath, entry.name);

        const implementationAbsolutePath = path.join(REPO_ROOT, entry.implementationPath);
        assert(fs.existsSync(implementationAbsolutePath), `Missing implementation file for entry ${entry.id}: ${entry.implementationPath}`);
        validateImplementation(implementationAbsolutePath, entry);

        const runtimeEntry = runtimeById.get(entry.id);
        assert(runtimeEntry, `Missing runtime catalog entry for skill ${entry.id}`);
        assert(runtimeEntry?.name === entry.name, `Runtime catalog name mismatch for skill ${entry.id}`);
        assert(runtimeEntry?.domain === entry.domain, `Runtime catalog domain mismatch for skill ${entry.id}`);
        assert(runtimeEntry?.implementationPath === entry.implementationPath, `Runtime implementation path mismatch for skill ${entry.id}`);
        assert(runtimeEntry?.archetype === entry.runtimeArchetype, `Runtime archetype mismatch for skill ${entry.id}`);
        assert(runtimeEntry?.coreMethod === entry.coreMethod, `Runtime core method mismatch for skill ${entry.id}`);
        assert(runtimeEntry?.primaryArtifact === entry.primaryArtifact, `Runtime primary artifact mismatch for skill ${entry.id}`);

        checked += 1;
    }

    console.log(`[validate-1000-skills] Validated ${checked} skills successfully.`);
}

main();
