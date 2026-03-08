import fs from 'fs';
import path from 'path';

type SkillImprovementTier = 'foundation' | 'advanced' | 'mission_critical';

type SkillImprovementProfile = {
    version: 1;
    tier: SkillImprovementTier;
    humanUseCases: string[];
    runbook: {
        preflight: string[];
        execution: string[];
        recovery: string[];
        handoff: string[];
    };
    guardrails: Array<{
        kind: string;
        rule: string;
        automation: string;
    }>;
    observability: {
        slo: string;
        errorBudget: string;
        alertTriggers: string[];
    };
    automation: {
        autopilotReady: boolean;
        parallelism: number;
        maxCycleMinutes: number;
        approvals: string[];
    };
    outcomes: {
        primaryMetric: string;
        secondaryMetrics: string[];
        reviewCadence: 'daily' | 'weekly';
    };
};

type SkillImprovementCatalog = {
    version: 1;
    sourceImplementations: string;
    generatedAt: string;
    count: number;
    entries: Array<{
        skillId: number;
        skillName: string;
        improvementProfile: SkillImprovementProfile;
    }>;
};

type ExternalImplementationBundle = {
    version: number;
    sourceFile: string;
    generatedAt: string;
    count: number;
    entries: Array<{ skillId: number; skillName: string; }>;
};

const REPO_ROOT = process.cwd();
const IMPLEMENTATIONS_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'implementations.json');
const IMPROVEMENTS_PATH = path.join(REPO_ROOT, 'skills', 'generated-10000', 'improvements.catalog.json');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function parseJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    assert(fs.existsSync(IMPLEMENTATIONS_PATH), `Missing implementations file: ${IMPLEMENTATIONS_PATH}`);
    assert(fs.existsSync(IMPROVEMENTS_PATH), `Missing improvements file: ${IMPROVEMENTS_PATH}`);

    const bundle = parseJson<ExternalImplementationBundle>(IMPLEMENTATIONS_PATH);
    const catalog = parseJson<SkillImprovementCatalog>(IMPROVEMENTS_PATH);

    assert(Array.isArray(bundle.entries), 'Invalid implementations bundle format');
    assert(Array.isArray(catalog.entries), 'Invalid improvements catalog format');
    assert(bundle.entries.length === 10000, `Expected 10000 implementations, found ${bundle.entries.length}`);
    assert(catalog.entries.length === 10000, `Expected 10000 improvement entries, found ${catalog.entries.length}`);
    assert(catalog.count === catalog.entries.length, 'Catalog count mismatch');

    const implIds = new Set(bundle.entries.map((entry) => entry.skillId));
    const seen = new Set<number>();
    const tierCounts: Record<SkillImprovementTier, number> = {
        foundation: 0,
        advanced: 0,
        mission_critical: 0
    };

    for (const entry of catalog.entries) {
        assert(Number.isInteger(entry.skillId) && entry.skillId > 0, 'Invalid skillId in improvements catalog');
        assert(!seen.has(entry.skillId), `Duplicate improvement entry for skill ${entry.skillId}`);
        seen.add(entry.skillId);
        assert(implIds.has(entry.skillId), `Improvement entry has unknown skillId ${entry.skillId}`);

        const profile = entry.improvementProfile;
        assert(profile && typeof profile === 'object', `Missing improvementProfile for skill ${entry.skillId}`);
        assert(profile.version === 1, `Invalid improvementProfile.version for skill ${entry.skillId}`);
        assert(profile.tier === 'foundation' || profile.tier === 'advanced' || profile.tier === 'mission_critical', `Invalid tier for skill ${entry.skillId}`);
        tierCounts[profile.tier] += 1;

        assert(Array.isArray(profile.humanUseCases) && profile.humanUseCases.length >= 2, `Invalid humanUseCases for skill ${entry.skillId}`);
        assert(Array.isArray(profile.runbook.preflight) && profile.runbook.preflight.length >= 2, `Invalid runbook.preflight for skill ${entry.skillId}`);
        assert(Array.isArray(profile.runbook.execution) && profile.runbook.execution.length >= 2, `Invalid runbook.execution for skill ${entry.skillId}`);
        assert(Array.isArray(profile.runbook.recovery) && profile.runbook.recovery.length >= 2, `Invalid runbook.recovery for skill ${entry.skillId}`);
        assert(Array.isArray(profile.runbook.handoff) && profile.runbook.handoff.length >= 2, `Invalid runbook.handoff for skill ${entry.skillId}`);
        assert(Array.isArray(profile.guardrails) && profile.guardrails.length >= 3, `Invalid guardrails for skill ${entry.skillId}`);
        assert(typeof profile.observability.slo === 'string' && profile.observability.slo.length > 0, `Missing SLO for skill ${entry.skillId}`);
        assert(Array.isArray(profile.observability.alertTriggers) && profile.observability.alertTriggers.length >= 2, `Invalid alertTriggers for skill ${entry.skillId}`);
        assert(typeof profile.automation.autopilotReady === 'boolean', `Invalid automation.autopilotReady for skill ${entry.skillId}`);
        assert(Number.isInteger(profile.automation.parallelism) && profile.automation.parallelism >= 1, `Invalid automation.parallelism for skill ${entry.skillId}`);
        assert(Number.isInteger(profile.automation.maxCycleMinutes) && profile.automation.maxCycleMinutes >= 5, `Invalid automation.maxCycleMinutes for skill ${entry.skillId}`);
        assert(Array.isArray(profile.automation.approvals) && profile.automation.approvals.length >= 1, `Invalid automation.approvals for skill ${entry.skillId}`);
        assert(typeof profile.outcomes.primaryMetric === 'string' && profile.outcomes.primaryMetric.length > 0, `Invalid outcomes.primaryMetric for skill ${entry.skillId}`);
        assert(profile.outcomes.reviewCadence === 'daily' || profile.outcomes.reviewCadence === 'weekly', `Invalid outcomes.reviewCadence for skill ${entry.skillId}`);
    }

    console.log('[validate-10000-skill-improvements] Validation passed.');
    console.log(`[validate-10000-skill-improvements] Tier counts: foundation=${tierCounts.foundation}, advanced=${tierCounts.advanced}, mission_critical=${tierCounts.mission_critical}`);
}

main();
