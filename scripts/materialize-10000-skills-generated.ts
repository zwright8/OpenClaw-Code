import fs from 'fs';
import path from 'path';
import type {
    SkillImplementation,
    SkillImprovementCatalog,
    SkillManifestEntry,
    SkillRuntimeCatalog
} from '../skills/runtime/types.js';
import { renderGeneratedSkillMarkdown } from './skill-markdown-contract.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const EXTERNAL_IMPLEMENTATIONS_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'implementations.json');
const EXTERNAL_IMPROVEMENTS_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'improvements.catalog.json');
const BASE_MANIFEST_PATH = path.join(GENERATED_ROOT, 'skills.manifest.json');
const MATERIALIZED_MANIFEST_PATH = path.join(GENERATED_ROOT, 'skills.manifest.10000.json');
const MATERIALIZED_RUNTIME_CATALOG_PATH = path.join(GENERATED_ROOT, 'runtime.catalog.10000.json');
const MATERIALIZED_INDEX_PATH = path.join(GENERATED_ROOT, 'INDEX-10000.md');

type ExternalImplementationBundle = {
    version: number;
    sourceFile: string;
    generatedAt: string;
    count: number;
    entries: SkillImplementation[];
};

function slugify(value: string): string {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function clean(value: string): string {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function loadImprovementById(filePath: string): Map<number, SkillImprovementCatalog['entries'][number]['improvementProfile']> {
    if (!fs.existsSync(filePath)) {
        return new Map();
    }
    const catalog = loadJson<SkillImprovementCatalog>(filePath);
    if (!catalog || typeof catalog !== 'object' || !Array.isArray(catalog.entries)) {
        return new Map();
    }
    const index = new Map<number, SkillImprovementCatalog['entries'][number]['improvementProfile']>();
    for (const entry of catalog.entries) {
        const skillId = Number(entry?.skillId);
        if (!Number.isInteger(skillId) || skillId <= 0) continue;
        if (!entry?.improvementProfile || typeof entry.improvementProfile !== 'object') continue;
        if (index.has(skillId)) continue;
        index.set(skillId, entry.improvementProfile);
    }
    return index;
}

function buildSkillMarkdown(implementation: SkillImplementation): string {
    const description = clean(
        `Build and operate the "${implementation.title}" capability for ${implementation.domain}. ` +
        'Use when this exact capability is required by autonomous or human-guided missions.'
    );
    const runbook = implementation.improvementProfile?.runbook;
    const runtime = implementation.runtimeProfile;
    const guardrails = (implementation.improvementProfile?.guardrails || [])
        .map((item) => `[${item.kind}] ${clean(item.rule)} -> \`${clean(item.automation)}\``);

    return renderGeneratedSkillMarkdown({
        skillName: implementation.skillName,
        description,
        title: implementation.title,
        reason: implementation.reason,
        whenToUse: `Use this skill when the request explicitly needs "${implementation.title}" outcomes in the ${implementation.domain} domain.`,
        implementationGuide: Array.isArray(implementation.implementationGuide)
            ? implementation.implementationGuide
            : [],
        requiredDeliverables: [
            'Capability contract: input schema, deterministic scoring, output schema, and failure modes.',
            `Runtime profile: ${runtime.archetype} using ${runtime.coreMethod} to produce ${runtime.primaryArtifact}.`,
            `Orchestration integration: ${runtime.orchestration.routingTag} routing, approval gates, retries, and rollback controls.`,
            `Validation evidence: ${runtime.validation.suites.join(', ')} suites and rollout telemetry.`
        ],
        runbook: {
            preflight: runbook?.preflight || [
                `Confirm the ${implementation.title} request scope, source evidence, and measurable success criteria before execution.`,
                `Verify feature flag ${runtime.rollout.featureFlag}, approval gates, and rollback owner before autonomous use.`
            ],
            execution: runbook?.execution || [
                `Execute ${runtime.coreMethod} with deterministic scoring and reproducible trace capture.`,
                `Produce ${runtime.primaryArtifact} plus scorecard, assumptions, and unresolved-risk notes.`
            ],
            recovery: runbook?.recovery || [
                'Fail closed when required signals, evidence, or approval gates are missing.',
                'Rollback to the last stable baseline when posture is critical or validation fails.'
            ],
            handoff: runbook?.handoff || [
                `Publish ${runtime.primaryArtifact}, validation evidence, and telemetry links to downstream owners.`,
                'Queue follow-up tasks for unresolved risks, threshold tuning, or approval review.'
            ]
        },
        guardrails: guardrails.length > 0
            ? guardrails
            : [
                '[quality] Require deterministic scoring and validation evidence before promotion.',
                '[reliability] Preserve retries, rollback controls, and failure-mode evidence for every run.',
                '[safety] Route critical posture or missing approval gates to human review before autonomous action.'
            ]
    });
}

function buildDirName(implementation: SkillImplementation): string {
    const idPart = String(implementation.skillId).padStart(4, '0');
    const titlePart = slugify(implementation.title).slice(0, 80);
    return `${idPart}-${titlePart}`.replace(/-+$/g, '');
}

function buildManifestEntry(implementation: SkillImplementation, dirName: string): SkillManifestEntry {
    return {
        id: implementation.skillId,
        name: implementation.skillName,
        title: implementation.title,
        domain: implementation.domain,
        path: `skills/generated/${dirName}/SKILL.md`,
        implementationPath: `skills/generated/${dirName}/implementation.json`,
        reason: implementation.reason,
        stepCount: Array.isArray(implementation.implementationGuide)
            ? implementation.implementationGuide.length
            : 0,
        runtimeArchetype: implementation.runtimeProfile.archetype,
        coreMethod: implementation.runtimeProfile.coreMethod,
        primaryArtifact: implementation.runtimeProfile.primaryArtifact
    };
}

function writeMaterializedSkill(implementation: SkillImplementation) {
    const dirName = buildDirName(implementation);
    const skillDir = path.join(GENERATED_ROOT, dirName);
    fs.mkdirSync(skillDir, { recursive: true });

    const skillPath = path.join(skillDir, 'SKILL.md');
    const implementationPath = path.join(skillDir, 'implementation.json');
    fs.writeFileSync(skillPath, buildSkillMarkdown(implementation));
    fs.writeFileSync(implementationPath, `${JSON.stringify(implementation, null, 2)}\n`);

    return dirName;
}

function renderIndex(entries: SkillManifestEntry[], sourceFile: string): string {
    const lines = [
        '# Generated Skills Index (10000 Skills)',
        '',
        `Generated from \`${sourceFile}\` and materialized in \`skills/generated\`.`,
        '',
        '| Skill ID | Skill Name | Domain | Archetype | Method | Path |',
        '| --- | --- | --- | --- | --- | --- |',
        ...entries.map((entry) => (
            `| ${entry.id} | \`${entry.name}\` | ${entry.domain.replace(/\|/g, '\\|')} | ` +
            `${entry.runtimeArchetype.replace(/\|/g, '\\|')} | ${entry.coreMethod.replace(/\|/g, '\\|')} | ${entry.path} |`
        )),
        ''
    ];
    return lines.join('\n');
}

function main() {
    assert(fs.existsSync(EXTERNAL_IMPLEMENTATIONS_PATH), `Missing implementations: ${EXTERNAL_IMPLEMENTATIONS_PATH}`);
    assert(fs.existsSync(BASE_MANIFEST_PATH), `Missing base manifest: ${BASE_MANIFEST_PATH}`);

    const bundle = loadJson<ExternalImplementationBundle>(EXTERNAL_IMPLEMENTATIONS_PATH);
    assert(Array.isArray(bundle.entries), 'External implementations bundle is invalid.');
    assert(bundle.entries.length === 10000, `Expected 10000 implementations, found ${bundle.entries.length}`);

    const baseManifest = loadJson<SkillManifestEntry[]>(BASE_MANIFEST_PATH);
    assert(Array.isArray(baseManifest), 'Base manifest is invalid.');
    assert(baseManifest.length === 1000, `Expected 1000 base skills, found ${baseManifest.length}`);

    const improvementById = loadImprovementById(EXTERNAL_IMPROVEMENTS_PATH);
    const manifestById = new Map<number, SkillManifestEntry>();
    for (const entry of baseManifest) {
        manifestById.set(entry.id, entry);
    }

    let materializedCount = 0;
    for (const original of bundle.entries) {
        const skillId = Number(original?.skillId);
        if (!Number.isInteger(skillId) || skillId <= 1000) continue;

        const implementation: SkillImplementation = {
            ...original,
            improvementProfile: improvementById.get(skillId) || original.improvementProfile
        };
        const dirName = writeMaterializedSkill(implementation);
        const entry = buildManifestEntry(implementation, dirName);
        manifestById.set(skillId, entry);
        materializedCount++;
    }

    const mergedManifest = Array.from(manifestById.values()).sort((a, b) => a.id - b.id);
    assert(mergedManifest.length === 10000, `Expected merged manifest length 10000, found ${mergedManifest.length}`);

    const runtimeCatalog: SkillRuntimeCatalog = {
        version: 1,
        sourceFile: bundle.sourceFile,
        generatedAt: new Date().toISOString(),
        count: mergedManifest.length,
        entries: mergedManifest.map((entry) => ({
            id: entry.id,
            name: entry.name,
            domain: entry.domain,
            implementationPath: entry.implementationPath,
            archetype: entry.runtimeArchetype,
            coreMethod: entry.coreMethod,
            primaryArtifact: entry.primaryArtifact
        }))
    };

    fs.writeFileSync(MATERIALIZED_MANIFEST_PATH, `${JSON.stringify(mergedManifest, null, 2)}\n`);
    fs.writeFileSync(MATERIALIZED_RUNTIME_CATALOG_PATH, `${JSON.stringify(runtimeCatalog, null, 2)}\n`);
    fs.writeFileSync(MATERIALIZED_INDEX_PATH, `${renderIndex(mergedManifest, bundle.sourceFile)}\n`);

    console.log(`[materialize-10000-skills-generated] Materialized ${materializedCount} skills (1001-10000) into skills/generated.`);
    console.log(`[materialize-10000-skills-generated] Manifest: ${MATERIALIZED_MANIFEST_PATH}`);
    console.log(`[materialize-10000-skills-generated] Runtime catalog: ${MATERIALIZED_RUNTIME_CATALOG_PATH}`);
    console.log(`[materialize-10000-skills-generated] Index: ${MATERIALIZED_INDEX_PATH}`);
}

main();
