import fs from 'fs';
import path from 'path';
import type { SkillImplementation, SkillManifestEntry, SkillRuntimeCatalog } from '../skills/runtime/types.js';

const SOURCE_FILE = 'SKILLS_UPDATES_10000.md';
const OUTPUT_ROOT = path.join(process.cwd(), 'skills', 'generated-10000');
const IMPLEMENTATIONS_FILE = path.join(OUTPUT_ROOT, 'implementations.json');
const MANIFEST_FILE = path.join(OUTPUT_ROOT, 'skills.manifest.json');
const RUNTIME_CATALOG_FILE = path.join(OUTPUT_ROOT, 'runtime.catalog.json');

const TitlePattern = /^\d+\. \[SK-(\d{5})\] (.+?) \(([^)]+)\)\s*$/;
const ReasonPattern = /^\s*Reason:\s*(.+)\s*$/i;

function slugify(value: string): string {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

function safeTitleCase(value: string): string {
    const text = String(value || '').trim();
    if (!text) return 'Untitled Skill';
    return text
        .split(/\s+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
}

type SkillDraft = {
    id: number;
    code: string;
    operation: string;
    domain: string;
    lens: string;
    title: string;
    reason: string;
};

function parseSkillDrafts(markdownPath: string): SkillDraft[] {
    const content = fs.readFileSync(markdownPath, 'utf8');
    const lines = content.split('\n');
    const drafts: SkillDraft[] = [];
    let lastDraft: SkillDraft | null = null;

    for (const line of lines) {
        const titleMatch = line.match(TitlePattern);
        if (titleMatch) {
            const id = Number(titleMatch[1]);
            const code = `SK-${String(id).padStart(5, '0')}`;
            const fullTitle = titleMatch[2].trim();
            const lens = safeTitleCase(titleMatch[3].trim());
            const forIndex = fullTitle.toLowerCase().lastIndexOf(' for ');
            const operation = forIndex >= 0 ? fullTitle.slice(0, forIndex).trim() : fullTitle;
            const domain = forIndex >= 0 ? fullTitle.slice(forIndex + 5).trim() : 'general systems';

            lastDraft = {
                id,
                code,
                operation,
                domain,
                lens,
                title: `${safeTitleCase(operation)} for ${domain}`,
                reason: ''
            };
            drafts.push(lastDraft);
            continue;
        }

        const reasonMatch = line.match(ReasonPattern);
        if (reasonMatch && lastDraft) {
            lastDraft.reason = reasonMatch[1].trim();
        }
    }

    drafts.sort((a, b) => a.id - b.id);
    return drafts;
}

function lensSignals(lens: string): string[] {
    const normalized = lens.toLowerCase();
    if (normalized.includes('truth')) {
        return ['claims', 'evidence', 'confidence traces'];
    }
    if (normalized.includes('humanity')) {
        return ['stakeholders', 'harm signals', 'benefit pathways'];
    }
    if (normalized.includes('beauty')) {
        return ['aesthetic constraints', 'craft references', 'experience traces'];
    }
    if (normalized.includes('product')) {
        return ['queue load', 'cycle time', 'throughput metrics'];
    }
    return ['quality standards', 'skill rubrics', 'performance metrics'];
}

function lensKpis(lens: string, domain: string): string[] {
    const normalized = lens.toLowerCase();
    if (normalized.includes('truth')) {
        return ['accuracy lift', 'contradiction reduction', `evidence coverage in ${domain}`];
    }
    if (normalized.includes('humanity')) {
        return ['harm reduction', 'equity improvement', `human benefit in ${domain}`];
    }
    if (normalized.includes('beauty')) {
        return ['aesthetic coherence', 'craft quality', `delight in ${domain}`];
    }
    if (normalized.includes('product')) {
        return ['cycle time reduction', 'throughput gain', `automation leverage in ${domain}`];
    }
    return ['quality score', 'consistency index', `mastery progress in ${domain}`];
}

function lensWeights(lens: string) {
    const normalized = lens.toLowerCase();
    if (normalized.includes('truth')) {
        return { truth: 0.45, execution: 0.2, safety: 0.2, impact: 0.15 };
    }
    if (normalized.includes('humanity')) {
        return { truth: 0.25, execution: 0.15, safety: 0.4, impact: 0.2 };
    }
    if (normalized.includes('beauty')) {
        return { truth: 0.2, execution: 0.2, safety: 0.2, impact: 0.4 };
    }
    if (normalized.includes('product')) {
        return { truth: 0.2, execution: 0.45, safety: 0.15, impact: 0.2 };
    }
    return { truth: 0.3, execution: 0.35, safety: 0.2, impact: 0.15 };
}

function lensApprovalGates(lens: string): string[] {
    const normalized = lens.toLowerCase();
    if (normalized.includes('humanity')) {
        return ['policy-constraint-check', 'human-impact-review'];
    }
    if (normalized.includes('truth')) {
        return ['policy-constraint-check', 'evidence-review'];
    }
    if (normalized.includes('beauty')) {
        return ['policy-constraint-check', 'quality-review'];
    }
    return ['policy-constraint-check', 'human-approval-router'];
}

function inferArchetype(operation: string): string {
    const op = operation.toLowerCase();
    if (op.includes('triage')) return 'triage-engine';
    if (op.includes('mapping')) return 'mapping-engine';
    if (op.includes('model')) return 'modeling-engine';
    if (op.includes('decomposition')) return 'decomposition-engine';
    if (op.includes('planner')) return 'planning-engine';
    if (op.includes('schedule')) return 'scheduling-engine';
    if (op.includes('router')) return 'routing-engine';
    if (op.includes('monitor')) return 'monitoring-engine';
    if (op.includes('mining')) return 'diagnostic-engine';
    if (op.includes('retrieval')) return 'retrieval-engine';
    if (op.includes('evaluation')) return 'evaluation-engine';
    if (op.includes('negotiation')) return 'negotiation-engine';
    if (op.includes('coaching')) return 'coaching-engine';
    if (op.includes('narrative')) return 'narrative-engine';
    if (op.includes('communication')) return 'communication-engine';
    if (op.includes('experiment')) return 'experimentation-engine';
    if (op.includes('governance')) return 'governance-engine';
    if (op.includes('incident')) return 'incident-response-engine';
    if (op.includes('recovery')) return 'resilience-engine';
    if (op.includes('privacy')) return 'privacy-engine';
    if (op.includes('security')) return 'security-engine';
    if (op.includes('compliance')) return 'compliance-engine';
    if (op.includes('forecast')) return 'forecasting-engine';
    if (op.includes('scoring')) return 'scoring-engine';
    if (op.includes('feedback')) return 'feedback-engine';
    if (op.includes('dashboard')) return 'reporting-engine';
    if (op.includes('diagnosis')) return 'diagnostic-engine';
    if (op.includes('curriculum')) return 'curriculum-engine';
    if (op.includes('reflection')) return 'reflection-engine';
    if (op.includes('improvement')) return 'improvement-engine';
    if (op.includes('workflow')) return 'orchestration-engine';
    if (op.includes('habit')) return 'habit-optimization-engine';
    if (op.includes('attention')) return 'attention-engine';
    if (op.includes('ideation')) return 'ideation-engine';
    if (op.includes('beauty')) return 'aesthetic-engine';
    if (op.includes('curiosity')) return 'curiosity-engine';
    if (op.includes('hypothesis')) return 'hypothesis-engine';
    if (op.includes('ethical')) return 'ethics-engine';
    if (op.includes('service')) return 'public-service-engine';
    if (op.includes('mentoring')) return 'mentoring-engine';
    if (op.includes('negotiation')) return 'negotiation-engine';
    if (op.includes('writing')) return 'writing-engine';
    if (op.includes('journal')) return 'journal-engine';
    return 'generalist-engine';
}

function buildImplementationGuide(title: string, domain: string, lens: string, operation: string): string[] {
    return [
        `Define measurable outcomes for ${title}, including baseline and target metrics for ${domain}.`,
        `Specify structured inputs/outputs for ${operation.toLowerCase()} and validate schema contract edge cases.`,
        `Implement the core ${operation.toLowerCase()} logic with deterministic scoring and reproducible execution traces.`,
        `Integrate orchestration policy, routing, approval gates, retries, and rollback for autonomous execution.`,
        `Run unit, integration, simulation, and regression suites for ${title} under ${lens.toLowerCase()} conditions.`,
        `Roll out behind a feature flag, monitor telemetry, and refine thresholds using observed operational outcomes.`
    ];
}

function buildImplementation(draft: SkillDraft): SkillImplementation {
    const domainSlug = slugify(draft.domain);
    const opSlug = slugify(draft.operation);
    const lensSlug = slugify(draft.lens);
    const archetype = inferArchetype(draft.operation);
    const weights = lensWeights(draft.lens);
    const guide = buildImplementationGuide(draft.title, draft.domain, draft.lens, draft.operation);
    const featureFlag = `skill_${String(draft.id).padStart(5, '0')}_${opSlug}`.slice(0, 42);

    return {
        version: 1,
        sourceFile: SOURCE_FILE,
        skillId: draft.id,
        skillName: `u${String(draft.id).padStart(5, '0')}-${slugify(draft.title)}`,
        title: draft.title,
        domain: draft.domain,
        domainSlug,
        reason: draft.reason || `Build ${draft.title} to improve outcomes in ${draft.domain} through ${draft.lens.toLowerCase()} practice.`,
        implementationGuide: guide,
        runtimeProfile: {
            archetype,
            coreMethod: draft.operation.toLowerCase(),
            primaryArtifact: `${opSlug}-artifact-${domainSlug}`.slice(0, 64),
            requiredSignals: lensSignals(draft.lens),
            kpiFocus: lensKpis(draft.lens, draft.domain),
            scoringWeights: weights,
            postureThresholds: {
                readyMin: 74,
                reviewMin: 54,
                reviewRisk: 62,
                criticalRisk: 81
            },
            orchestration: {
                routingTag: `${domainSlug}:${archetype}`.slice(0, 72),
                approvalGates: lensApprovalGates(draft.lens),
                retryPolicy: {
                    maxAttempts: 4,
                    baseDelayMs: 750,
                    backoff: 'exponential'
                },
                rollbackStrategy: 'rollback-to-last-stable-baseline',
                components: [
                    'task routing',
                    'approval gates',
                    'retry strategy',
                    'rollback controls'
                ]
            },
            validation: {
                suites: ['unit', 'integration', 'simulation', 'regression-baseline'],
                baselineRequired: true
            },
            rollout: {
                featureFlag,
                releaseCycles: 2,
                telemetryAlerts: true
            },
            scoringSeed: `${draft.code}:${lensSlug}:${archetype}`
        },
        traceability: {
            scopeStep: guide[0],
            contractStep: guide[1],
            coreStep: guide[2],
            orchestrationStep: guide[3],
            validationStep: guide[4],
            rolloutStep: guide[5]
        }
    };
}

function buildManifestEntry(implementation: SkillImplementation): SkillManifestEntry {
    const id = implementation.skillId;
    return {
        id,
        name: implementation.skillName,
        title: implementation.title,
        domain: implementation.domain,
        path: `${SOURCE_FILE}#SK-${String(id).padStart(5, '0')}`,
        implementationPath: `skills/generated-10000/implementations.json#${id}`,
        reason: implementation.reason,
        stepCount: implementation.implementationGuide.length,
        runtimeArchetype: implementation.runtimeProfile.archetype,
        coreMethod: implementation.runtimeProfile.coreMethod,
        primaryArtifact: implementation.runtimeProfile.primaryArtifact
    };
}

function buildRuntimeCatalogEntry(implementation: SkillImplementation) {
    return {
        id: implementation.skillId,
        name: implementation.skillName,
        domain: implementation.domain,
        implementationPath: `skills/generated-10000/implementations.json#${implementation.skillId}`,
        archetype: implementation.runtimeProfile.archetype,
        coreMethod: implementation.runtimeProfile.coreMethod,
        primaryArtifact: implementation.runtimeProfile.primaryArtifact
    };
}

function main() {
    const sourcePath = path.join(process.cwd(), SOURCE_FILE);
    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Missing source file: ${sourcePath}`);
    }

    const drafts = parseSkillDrafts(sourcePath);
    if (drafts.length !== 10000) {
        throw new Error(`Expected 10000 skills in ${SOURCE_FILE}, found ${drafts.length}`);
    }

    const implementations = drafts.map((draft) => buildImplementation(draft));
    const manifest: SkillManifestEntry[] = implementations.map((impl) => buildManifestEntry(impl));
    const runtimeCatalog: SkillRuntimeCatalog = {
        version: 1,
        sourceFile: SOURCE_FILE,
        generatedAt: new Date().toISOString(),
        count: implementations.length,
        entries: implementations.map((impl) => buildRuntimeCatalogEntry(impl))
    };

    fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

    fs.writeFileSync(IMPLEMENTATIONS_FILE, `${JSON.stringify({
        version: 1,
        sourceFile: SOURCE_FILE,
        generatedAt: runtimeCatalog.generatedAt,
        count: implementations.length,
        entries: implementations
    }, null, 2)}\n`);

    fs.writeFileSync(MANIFEST_FILE, `${JSON.stringify(manifest, null, 2)}\n`);
    fs.writeFileSync(RUNTIME_CATALOG_FILE, `${JSON.stringify(runtimeCatalog, null, 2)}\n`);

    console.log(`Generated 10000 skill implementations at ${OUTPUT_ROOT}`);
    console.log(`- implementations: ${IMPLEMENTATIONS_FILE}`);
    console.log(`- manifest: ${MANIFEST_FILE}`);
    console.log(`- runtime catalog: ${RUNTIME_CATALOG_FILE}`);
}

main();
