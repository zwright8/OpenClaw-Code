import fs from 'fs';
import path from 'path';

type SkillUpdate = {
    id: number;
    title: string;
    domain: string;
    reason: string;
    steps: string[];
};

type SkillRuntimeProfile = {
    archetype: string;
    coreMethod: string;
    primaryArtifact: string;
    requiredSignals: string[];
    kpiFocus: string[];
    scoringWeights: {
        truth: number;
        execution: number;
        safety: number;
        impact: number;
    };
    postureThresholds: {
        readyMin: number;
        reviewMin: number;
        reviewRisk: number;
        criticalRisk: number;
    };
    orchestration: {
        routingTag: string;
        approvalGates: string[];
        retryPolicy: {
            maxAttempts: number;
            baseDelayMs: number;
            backoff: 'exponential';
        };
        rollbackStrategy: string;
        components: string[];
    };
    validation: {
        suites: string[];
        baselineRequired: boolean;
    };
    rollout: {
        featureFlag: string;
        releaseCycles: number;
        telemetryAlerts: boolean;
    };
    scoringSeed: string;
    ioContract?: {
        inputs: Array<{ name: string; type: string; required: boolean; source: 'upstream' | 'runtime' | 'human'; }>;
        outputs: Array<{ name: string; type: string; guaranteed: boolean; consumer: 'orchestrator' | 'operator' | 'downstream'; }>;
    };
    validationGates?: Array<{ gate: string; check: string; onFail: 'retry' | 'escalate' | 'quarantine'; }>;
    failureHandling?: {
        knownFailures: Array<{ code: string; trigger: string; action: string; }>;
        rollbackStrategy: string;
    };
    handoffContract?: {
        produces: string[];
        consumes: string[];
        downstreamHint: string;
    };
};

type SkillImplementation = {
    version: 1;
    sourceFile: string;
    skillId: number;
    skillName: string;
    title: string;
    domain: string;
    domainSlug: string;
    reason: string;
    implementationGuide: string[];
    runtimeProfile: SkillRuntimeProfile;
    traceability: {
        scopeStep: string;
        contractStep: string;
        coreStep: string;
        orchestrationStep: string;
        validationStep: string;
        rolloutStep: string;
    };
};

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

const REPO_ROOT = process.cwd();
const SOURCE_CANDIDATES = ['SKILL_UPDATES_1000.md', 'SKILLS_UPDATES_1000.md'] as const;
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const MANIFEST_PATH = path.join(SKILL_ROOT, 'skills.manifest.json');
const INDEX_PATH = path.join(SKILL_ROOT, 'INDEX.md');
const RUNTIME_CATALOG_PATH = path.join(SKILL_ROOT, 'runtime.catalog.json');

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function cleanSentence(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

function splitPhraseList(value: string): string[] {
    return value
        .replace(/\band\/or\b/gi, ' and ')
        .split(/,\s*|\s+and\s+/gi)
        .map((entry) => cleanSentence(entry).replace(/^and\s+/i, '').replace(/\.$/, ''))
        .filter(Boolean);
}

function parseUpdates(markdown: string): SkillUpdate[] {
    const lines = markdown.split('\n');
    const updates: SkillUpdate[] = [];
    let current: SkillUpdate | null = null;

    const pushCurrent = () => {
        if (!current) return;
        if (current.steps.length === 0) {
            throw new Error(`Update ${current.id} has no implementation steps`);
        }
        updates.push(current);
        current = null;
    };

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        const updateMatch = line.match(/^## Update (\d+): (.+)$/);
        if (updateMatch) {
            pushCurrent();
            current = {
                id: Number(updateMatch[1]),
                title: cleanSentence(updateMatch[2]),
                domain: '',
                reason: '',
                steps: []
            };
            continue;
        }

        if (!current) continue;

        if (line.startsWith('- Domain: ')) {
            current.domain = cleanSentence(line.slice('- Domain: '.length));
            continue;
        }

        if (line.startsWith('- Why this new skill is needed: ')) {
            current.reason = cleanSentence(line.slice('- Why this new skill is needed: '.length));
            continue;
        }

        if (line.match(/^\d+\.\s+/)) {
            const stepText = line.replace(/^\d+\.\s+/, '');
            current.steps.push(cleanSentence(stepText));
        }
    }

    pushCurrent();
    updates.sort((a, b) => a.id - b.id);
    return updates;
}

function resolveSourcePath(repoRoot: string): string {
    const existing = SOURCE_CANDIDATES
        .map((relativePath) => path.join(repoRoot, relativePath))
        .filter((absolutePath) => fs.existsSync(absolutePath));

    if (existing.length === 0) {
        throw new Error(`Could not find source backlog. Tried: ${SOURCE_CANDIDATES.join(', ')}`);
    }

    if (existing.length > 1) {
        const [first, second] = existing;
        const firstBody = fs.readFileSync(first, 'utf8');
        const secondBody = fs.readFileSync(second, 'utf8');
        if (firstBody !== secondBody) {
            throw new Error(
                `Found multiple backlog files with different contents:\n- ${first}\n- ${second}\n` +
                'Keep one canonical source or make them identical.'
            );
        }
    }

    const preferred = path.join(repoRoot, SOURCE_CANDIDATES[0]);
    return fs.existsSync(preferred) ? preferred : existing[0];
}

function buildSkillName(id: number, title: string, usedNames: Set<string>): string {
    const idPrefix = `u${String(id).padStart(4, '0')}`;
    const titleSlug = slugify(title);
    const maxTail = Math.max(1, 64 - idPrefix.length - 1);
    let candidate = `${idPrefix}-${titleSlug.slice(0, maxTail)}`.replace(/-+$/g, '');
    if (!candidate) candidate = idPrefix;

    let dedupe = 1;
    while (usedNames.has(candidate)) {
        const suffix = `-${dedupe}`;
        const allowed = Math.max(1, 64 - suffix.length);
        candidate = `${candidate.slice(0, allowed)}${suffix}`.replace(/-+$/g, '');
        dedupe += 1;
    }
    usedNames.add(candidate);
    return candidate;
}

function extractCoreMethodAndArtifact(step: string, title: string): { coreMethod: string; primaryArtifact: string; } {
    const match = step.match(/using (.+?), and produce (.+?) with deterministic scoring\.?$/i);
    if (match) {
        return {
            coreMethod: cleanSentence(match[1]),
            primaryArtifact: cleanSentence(match[2])
        };
    }

    return {
        coreMethod: 'deterministic capability execution',
        primaryArtifact: `${title} execution output`
    };
}

function extractKpiFocus(step: string): string[] {
    const match = step.match(/tied to (.+?)\./i);
    if (!match) {
        return ['false certainty', 'unverified assumptions', 'decision drift'];
    }

    const parsed = splitPhraseList(match[1]);
    if (parsed.length >= 3) return parsed.slice(0, 6);
    return [...parsed, 'decision drift'].slice(0, 6);
}

function extractRequiredSignals(step: string): string[] {
    const match = step.match(/for (.+?), then add schema validation/i);
    const parsed = match ? splitPhraseList(match[1]) : [];
    const normalized = parsed.map((entry) => entry.toLowerCase());
    const withFallback = Array.from(new Set([
        ...normalized,
        'claims',
        'evidence',
        'confidence traces'
    ]));
    return withFallback.slice(0, 8);
}

function extractOrchestrationComponents(step: string): string[] {
    const match = step.match(/orchestration:\s*(.+)$/i);
    if (!match) {
        return ['task routing', 'approval gates', 'retry strategy', 'rollback controls'];
    }

    return splitPhraseList(match[1]).map((entry) => entry.replace(/\.$/, '')).slice(0, 8);
}

function extractValidationSuites(step: string): string[] {
    const suites: string[] = [];
    if (/unit/i.test(step)) suites.push('unit');
    if (/integration/i.test(step)) suites.push('integration');
    if (/simulation/i.test(step)) suites.push('simulation');
    if (/regression/i.test(step)) suites.push('regression-baseline');
    if (suites.length === 0) suites.push('unit', 'integration', 'simulation');
    return suites;
}

function extractReleaseCycles(step: string): number {
    const wordMap: Record<string, number> = {
        one: 1,
        two: 2,
        three: 3,
        four: 4,
        five: 5
    };
    const match = step.match(/(one|two|three|four|five|\d+)\s+release cycles?/i);
    if (!match) return 2;
    const token = match[1].toLowerCase();
    const numeric = Number(token);
    if (Number.isFinite(numeric)) return Math.max(1, Math.min(6, Math.floor(numeric)));
    return wordMap[token] ?? 2;
}

function hashNumber(value: string): number {
    let hash = 2_166_136_261;
    for (const ch of value) {
        hash ^= ch.charCodeAt(0);
        hash = Math.imul(hash, 16_777_619);
    }
    return hash >>> 0;
}

function deriveScoringWeights(seed: string): SkillRuntimeProfile['scoringWeights'] {
    let state = hashNumber(seed);
    const next = () => {
        state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
        return (state & 0xffff) / 0xffff;
    };

    const raw = [0.45 + next(), 0.45 + next(), 0.45 + next(), 0.45 + next()];
    const total = raw.reduce((sum, value) => sum + value, 0);
    const scaled = raw.map((value) => Number((value / total).toFixed(4)));
    const drift = Number((1 - scaled.reduce((sum, value) => sum + value, 0)).toFixed(4));
    scaled[scaled.length - 1] = Number((scaled[scaled.length - 1] + drift).toFixed(4));

    return {
        truth: scaled[0],
        execution: scaled[1],
        safety: scaled[2],
        impact: scaled[3]
    };
}

function derivePostureThresholds(seed: string): SkillRuntimeProfile['postureThresholds'] {
    const base = hashNumber(seed);
    const readyMin = 70 + (base % 11);
    let reviewMin = 52 + ((base >> 4) % 11);
    let reviewRisk = 46 + ((base >> 9) % 16);
    const criticalRisk = 74 + ((base >> 14) % 16);

    reviewMin = Math.min(reviewMin, readyMin - 5);
    reviewRisk = Math.min(reviewRisk, criticalRisk - 5);

    return {
        readyMin,
        reviewMin,
        reviewRisk,
        criticalRisk
    };
}

function deriveArchetype(update: SkillUpdate, coreMethod: string, artifact: string): string {
    const corpus = `${update.title} ${coreMethod} ${artifact}`.toLowerCase();
    if (/normaliz|clean|mapping/.test(corpus)) return 'normalization-engine';
    if (/priorit|rank|budget|allocat|scheduler|planner|router|decomposer/.test(corpus)) return 'planning-router';
    if (/provenance|lineage|ledger|attestation/.test(corpus)) return 'provenance-tracker';
    if (/detect|sentinel|monitor|guard|shield|threat/.test(corpus)) return 'detection-guard';
    if (/simulat|counterfactual|sandbox|war-gamer/.test(corpus)) return 'simulation-lab';
    if (/compile|compiler|mapper|adapter|contract/.test(corpus)) return 'contract-compiler';
    if (/negotiation|mediat|resolver|consensus/.test(corpus)) return 'collaboration-mediator';
    if (/narrative|communicat|publisher|synthesizer|translator/.test(corpus)) return 'communication-engine';
    if (/audit|verifier|diagnostic|taxonomy|health/.test(corpus)) return 'diagnostic-engine';
    if (/optimizer|calibration|autopatcher|consolidator/.test(corpus)) return 'optimization-engine';
    return 'general-capability';
}

function deriveApprovalGates(domain: string, archetype: string): string[] {
    const gates = ['policy-constraint-check', 'human-approval-router'];
    if (/privacy|security|zero-trust|cryptographic/i.test(domain)) {
        gates.push('security-review');
    }
    if (/health|safety|child|mental/i.test(domain)) {
        gates.push('safety-review');
    }
    if (/economic|finance|funding|budget|philanthropic/i.test(domain)) {
        gates.push('budget-review');
    }
    if (archetype === 'simulation-lab') {
        gates.push('scenario-review');
    }
    return Array.from(new Set(gates));
}

function buildRuntimeProfile(update: SkillUpdate, skillName: string): SkillRuntimeProfile {
    const scopeStep = update.steps[0] ?? '';
    const contractStep = update.steps[1] ?? '';
    const coreStep = update.steps[2] ?? '';
    const orchestrationStep = update.steps[3] ?? '';
    const validationStep = update.steps[4] ?? '';
    const rolloutStep = update.steps[5] ?? '';

    const { coreMethod, primaryArtifact } = extractCoreMethodAndArtifact(coreStep, update.title);
    const archetype = deriveArchetype(update, coreMethod, primaryArtifact);
    const scoringSeed = `${skillName}:${update.id}:${archetype}`;
    const requiredSignals = extractRequiredSignals(contractStep);
    const outputArtifact = slugify(primaryArtifact).replace(/-/g, '_').slice(0, 40) || 'artifact';

    return {
        archetype,
        coreMethod,
        primaryArtifact,
        requiredSignals,
        kpiFocus: extractKpiFocus(scopeStep),
        scoringWeights: deriveScoringWeights(scoringSeed),
        postureThresholds: derivePostureThresholds(scoringSeed),
        orchestration: {
            routingTag: `${slugify(update.domain)}:${archetype}`,
            approvalGates: deriveApprovalGates(update.domain, archetype),
            retryPolicy: {
                maxAttempts: 3 + (update.id % 2),
                baseDelayMs: 600 + (update.id % 5) * 150,
                backoff: 'exponential'
            },
            rollbackStrategy: 'rollback-to-last-stable-baseline',
            components: extractOrchestrationComponents(orchestrationStep)
        },
        validation: {
            suites: extractValidationSuites(validationStep),
            baselineRequired: /regression/i.test(validationStep)
        },
        rollout: {
            featureFlag: `skill_${String(update.id).padStart(4, '0')}_${slugify(update.title).slice(0, 32)}`,
            releaseCycles: extractReleaseCycles(rolloutStep),
            telemetryAlerts: /telemetry|alert/i.test(rolloutStep)
        },
        scoringSeed,
        ioContract: {
            inputs: requiredSignals.map((signal) => ({
                name: signal,
                type: 'signal',
                required: true,
                source: 'upstream' as const
            })),
            outputs: [
                {
                    name: `${outputArtifact}_report`,
                    type: 'structured-report',
                    guaranteed: true,
                    consumer: 'orchestrator' as const
                },
                {
                    name: `${outputArtifact}_scorecard`,
                    type: 'scorecard',
                    guaranteed: true,
                    consumer: 'operator' as const
                }
            ]
        },
        validationGates: [
            {
                gate: 'schema-contract-check',
                check: 'All required input signals present and schema-valid',
                onFail: 'quarantine'
            },
            {
                gate: 'determinism-check',
                check: 'Repeated run on same inputs yields stable scoring and artifacts',
                onFail: 'escalate'
            },
            {
                gate: 'policy-approval-check',
                check: 'Approval gates satisfied before publish-level outputs',
                onFail: 'retry'
            }
        ],
        failureHandling: {
            knownFailures: [
                {
                    code: 'E_INPUT_SCHEMA',
                    trigger: 'Missing or malformed required signals',
                    action: 'Reject payload, emit validation error, request corrected payload'
                },
                {
                    code: 'E_NON_DETERMINISM',
                    trigger: 'Determinism delta exceeds allowed threshold',
                    action: 'Freeze output, escalate to human approval router'
                },
                {
                    code: 'E_DEPENDENCY_TIMEOUT',
                    trigger: 'Downstream or external dependency timeout',
                    action: 'Apply retry policy then rollback to last stable baseline'
                }
            ],
            rollbackStrategy: 'rollback-to-last-stable-baseline'
        },
        handoffContract: {
            produces: [`${update.title} normalized artifacts`, 'execution scorecard', 'risk posture'],
            consumes: requiredSignals,
            downstreamHint: `Route next to ${slugify(update.domain)}:${archetype} consumers with approval-gate context`
        }
    };
}

function buildImplementation(update: SkillUpdate, skillName: string, sourceFile: string): SkillImplementation {
    const runtimeProfile = buildRuntimeProfile(update, skillName);
    return {
        version: 1,
        sourceFile,
        skillId: update.id,
        skillName,
        title: update.title,
        domain: update.domain,
        domainSlug: slugify(update.domain).slice(0, 64) || 'general',
        reason: update.reason,
        implementationGuide: update.steps,
        runtimeProfile,
        traceability: {
            scopeStep: update.steps[0] ?? '',
            contractStep: update.steps[1] ?? '',
            coreStep: update.steps[2] ?? '',
            orchestrationStep: update.steps[3] ?? '',
            validationStep: update.steps[4] ?? '',
            rolloutStep: update.steps[5] ?? ''
        }
    };
}

function buildSkillMarkdown(update: SkillUpdate, skillName: string, runtimeProfile: SkillRuntimeProfile): string {
    const description = cleanSentence(
        `Build and operate the "${update.title}" capability for ${update.domain}. ` +
        `Trigger when this exact capability is needed in mission execution.`
    );

    const stepList = update.steps
        .map((step, index) => `${index + 1}. ${step}`)
        .join('\n');

    const inputLines = (runtimeProfile.ioContract?.inputs ?? [])
        .map((item) => `- \`${item.name}\` (${item.type}, source=${item.source}, required=${item.required})`)
        .join('\n');
    const outputLines = (runtimeProfile.ioContract?.outputs ?? [])
        .map((item) => `- \`${item.name}\` (${item.type}, consumer=${item.consumer}, guaranteed=${item.guaranteed})`)
        .join('\n');
    const gateLines = (runtimeProfile.validationGates ?? [])
        .map((gate, index) => `${index + 1}. **${gate.gate}** — ${gate.check} (on fail: ${gate.onFail})`)
        .join('\n');
    const failureLines = (runtimeProfile.failureHandling?.knownFailures ?? [])
        .map((failure) => `- \`${failure.code}\`: ${failure.trigger} → ${failure.action}`)
        .join('\n');

    return `---
name: ${skillName}
description: ${description}
---

# ${update.title}

## Why This Skill Exists
${update.reason}

## When To Use
Use this skill when the request explicitly needs "${update.title}" outcomes in the ${update.domain} domain.

## Step-by-Step Implementation Guide
${stepList}

## Deterministic Workflow Notes
- Core method: ${runtimeProfile.coreMethod}
- Archetype: ${runtimeProfile.archetype}
- Routing tag: ${runtimeProfile.orchestration.routingTag}

## Input Contract
${inputLines}

## Output Contract
${outputLines}

## Validation Gates
${gateLines}

## Failure Handling
${failureLines}
- Rollback strategy: ${runtimeProfile.failureHandling?.rollbackStrategy ?? runtimeProfile.orchestration.rollbackStrategy}

## Handoff Contract
- Produces: ${(runtimeProfile.handoffContract?.produces ?? []).join('; ')}
- Consumes: ${(runtimeProfile.handoffContract?.consumes ?? []).join('; ')}
- Downstream routing hint: ${runtimeProfile.handoffContract?.downstreamHint ?? runtimeProfile.orchestration.routingTag}

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
`;
}

function shardForId(id: number): string {
    return String(id).padStart(5, '0').slice(0, 2);
}

function skillDirPath(outputDir: string, id: number, dirName: string): string {
    return path.join(outputDir, 'shards', shardForId(id), dirName);
}

function manifestPathForSkill(id: number, dirName: string): string {
    return `skills/generated/shards/${shardForId(id)}/${dirName}/`;
}

function ensureCleanOutputDir(outputDir: string) {
    fs.mkdirSync(outputDir, { recursive: true });
    const shardsPath = path.join(outputDir, 'shards');
    if (fs.existsSync(shardsPath)) {
        fs.rmSync(shardsPath, { recursive: true, force: true });
    }
}

function escapeMarkdownCell(value: string): string {
    return value.replace(/\|/g, '\\|');
}

function main() {
    const sourcePath = resolveSourcePath(REPO_ROOT);
    const sourceFile = path.basename(sourcePath);
    const sourceMarkdown = fs.readFileSync(sourcePath, 'utf8');
    const updates = parseUpdates(sourceMarkdown);
    if (updates.length !== 1000) {
        throw new Error(`Expected 1000 updates in ${sourcePath}, found ${updates.length}`);
    }

    ensureCleanOutputDir(SKILL_ROOT);
    const usedNames = new Set<string>();
    const manifest: ManifestEntry[] = [];

    for (const update of updates) {
        if (!update.domain || !update.reason || update.steps.length < 6) {
            throw new Error(`Update ${update.id} is missing required fields (domain/reason/steps)`);
        }

        const skillName = buildSkillName(update.id, update.title, usedNames);
        const dirName = `${String(update.id).padStart(4, '0')}-${slugify(update.title).slice(0, 80)}`;
        const skillDir = skillDirPath(SKILL_ROOT, update.id, dirName);
        fs.mkdirSync(skillDir, { recursive: true });
        const skillPath = path.join(skillDir, 'SKILL.md');
        const implementationPath = path.join(skillDir, 'implementation.json');

        const implementation = buildImplementation(update, skillName, sourceFile);
        fs.writeFileSync(skillPath, buildSkillMarkdown(update, skillName, implementation.runtimeProfile));
        fs.writeFileSync(implementationPath, `${JSON.stringify(implementation, null, 2)}\n`);

        const basePath = manifestPathForSkill(update.id, dirName);
        manifest.push({
            id: update.id,
            name: skillName,
            title: update.title,
            domain: update.domain,
            path: `${basePath}SKILL.md`,
            implementationPath: `${basePath}implementation.json`,
            reason: update.reason,
            stepCount: update.steps.length,
            runtimeArchetype: implementation.runtimeProfile.archetype,
            coreMethod: implementation.runtimeProfile.coreMethod,
            primaryArtifact: implementation.runtimeProfile.primaryArtifact
        });
    }

    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

    const runtimeCatalog = {
        version: 1,
        sourceFile,
        generatedAt: new Date().toISOString(),
        count: manifest.length,
        entries: manifest.map((entry) => ({
            id: entry.id,
            name: entry.name,
            domain: entry.domain,
            implementationPath: entry.implementationPath,
            archetype: entry.runtimeArchetype,
            coreMethod: entry.coreMethod,
            primaryArtifact: entry.primaryArtifact
        }))
    };
    fs.writeFileSync(RUNTIME_CATALOG_PATH, `${JSON.stringify(runtimeCatalog, null, 2)}\n`);

    const indexLines = [
        '# Generated Skills Index (1000 Skills)',
        '',
        `This index is generated from \`${sourceFile}\`.`,
        '',
        '| Update | Skill Name | Domain | Archetype | Method | Path |',
        '| --- | --- | --- | --- | --- | --- |',
        ...manifest.map((entry) => (
            `| ${entry.id} | \`${entry.name}\` | ${escapeMarkdownCell(entry.domain)} | ` +
            `${escapeMarkdownCell(entry.runtimeArchetype)} | ${escapeMarkdownCell(entry.coreMethod)} | ${entry.path} |`
        )),
        ''
    ];
    fs.writeFileSync(INDEX_PATH, indexLines.join('\n'));

    console.log(
        `[build-1000-skills] Generated ${manifest.length} skills in ${SKILL_ROOT} from ${sourceFile}`
    );
}

main();
