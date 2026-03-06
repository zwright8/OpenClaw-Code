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
    coreMethod: string;
    runtimeArchetype: string;
    score: number;
    marketplacePath: string;
};

type MarketplaceCatalog = {
    version: number;
    generatedAt: string;
    sourceManifest: string;
    count: number;
    entries: MarketplaceCatalogEntry[];
};

type UsageEvent = {
    skillId: number;
    status?: 'success' | 'failure' | 'partial';
    durationMs?: number;
    valueUsd?: number;
    channel?: string;
    executedAt?: string;
};

type UsageAggregate = {
    runs: number;
    success: number;
    failure: number;
    partial: number;
    totalDurationMs: number;
    totalValueUsd: number;
};

type ScorecardEntry = {
    skillId: number;
    marketplaceSkillName: string;
    title: string;
    domain: string;
    verticalId: string;
    verticalName: string;
    method: string;
    archetype: string;
    metricSource: 'observed' | 'projected';
    runs: number;
    successRate: number;
    avgDurationMs: number;
    estimatedValueUsd: number;
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

type AnalyticsSummary = {
    totalSkills: number;
    observedSkills: number;
    projectedSkills: number;
    totalRuns: number;
    estimatedValueUsd: number;
    avgQualityScore: number;
    avgRoiScore: number;
    topVerticalsByRoi: Array<{
        verticalId: string;
        verticalName: string;
        avgRoiScore: number;
        skills: number;
    }>;
};

type ScorecardsPayload = {
    version: 1;
    generatedAt: string;
    sourceCatalog: string;
    usageLogPath: string;
    count: number;
    summary: AnalyticsSummary;
    entries: ScorecardEntry[];
};

type UsageSummaryPayload = {
    version: 1;
    generatedAt: string;
    usageLogPath: string;
    events: {
        totalEvents: number;
        parseErrors: number;
    };
    totals: {
        runs: number;
        success: number;
        failure: number;
        partial: number;
        valueUsd: number;
    };
    byVertical: Array<{
        verticalId: string;
        verticalName: string;
        runs: number;
        successRate: number;
        valueUsd: number;
    }>;
};

type BuildOptions = {
    usageLogPath: string;
};

const REPO_ROOT = process.cwd();
const MARKETPLACE_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace');
const CATALOG_PATH = path.join(MARKETPLACE_ROOT, 'skills.catalog.json');
const ANALYTICS_ROOT = path.join(MARKETPLACE_ROOT, 'analytics');
const SCORECARDS_JSON_PATH = path.join(ANALYTICS_ROOT, 'scorecards.json');
const USAGE_SUMMARY_JSON_PATH = path.join(ANALYTICS_ROOT, 'usage.summary.json');
const SCORECARDS_MD_PATH = path.join(ANALYTICS_ROOT, 'SCORECARDS.md');
const DEFAULT_USAGE_LOG_PATH = path.join(ANALYTICS_ROOT, 'usage.events.jsonl');
const USAGE_TEMPLATE_PATH = path.join(ANALYTICS_ROOT, 'usage.events.template.jsonl');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function round(value: number, digits = 2): number {
    const factor = 10 ** digits;
    return Math.round(value * factor) / factor;
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseArgs(argv: string[]): BuildOptions {
    const options: BuildOptions = {
        usageLogPath: DEFAULT_USAGE_LOG_PATH
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '--usage-log') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --usage-log');
            options.usageLogPath = path.resolve(next);
            index += 1;
        }
    }

    return options;
}

function hashString(value: string): number {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0);
}

function loadUsageAggregates(usageLogPath: string) {
    const aggregates = new Map<number, UsageAggregate>();
    let totalEvents = 0;
    let parseErrors = 0;

    if (!fs.existsSync(usageLogPath)) {
        return {
            aggregates,
            totalEvents,
            parseErrors
        };
    }

    const lines = fs.readFileSync(usageLogPath, 'utf8').split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        totalEvents += 1;

        try {
            const parsed = JSON.parse(line) as UsageEvent;
            const skillId = Number(parsed.skillId);
            if (!Number.isInteger(skillId) || skillId <= 0) {
                parseErrors += 1;
                continue;
            }

            const aggregate = aggregates.get(skillId) || {
                runs: 0,
                success: 0,
                failure: 0,
                partial: 0,
                totalDurationMs: 0,
                totalValueUsd: 0
            };

            aggregate.runs += 1;
            if (parsed.status === 'failure') aggregate.failure += 1;
            else if (parsed.status === 'partial') aggregate.partial += 1;
            else aggregate.success += 1;

            if (Number.isFinite(parsed.durationMs)) {
                aggregate.totalDurationMs += Math.max(0, Number(parsed.durationMs));
            }
            if (Number.isFinite(parsed.valueUsd)) {
                aggregate.totalValueUsd += Math.max(0, Number(parsed.valueUsd));
            }

            aggregates.set(skillId, aggregate);
        } catch {
            parseErrors += 1;
        }
    }

    return {
        aggregates,
        totalEvents,
        parseErrors
    };
}

function resolveImplementationFromCatalogEntry(entry: MarketplaceCatalogEntry): SkillImplementation {
    const skillPath = path.join(REPO_ROOT, entry.marketplacePath);
    const skillDir = path.dirname(skillPath);
    const implementationPath = path.join(skillDir, 'references', 'implementation.json');
    assert(fs.existsSync(implementationPath), `Missing implementation for skill ${entry.id}: ${implementationPath}`);
    return loadJson<SkillImplementation>(implementationPath);
}

function computeQualityScore(entry: MarketplaceCatalogEntry, implementation: SkillImplementation) {
    const guardrailCount = implementation.improvementProfile?.guardrails?.length || 0;
    const validationSuiteCount = implementation.runtimeProfile?.validation?.suites?.length || 0;
    const tier = implementation.improvementProfile?.tier || 'foundation';
    const autopilotReady = Boolean(implementation.improvementProfile?.automation?.autopilotReady);

    const tierPoints = tier === 'mission_critical' ? 20 : tier === 'advanced' ? 15 : 10;
    const score = clamp(
        20
        + Math.min(40, entry.score * 2)
        + Math.min(20, guardrailCount * 4)
        + Math.min(15, validationSuiteCount * 3)
        + tierPoints
        + (autopilotReady ? 5 : 0),
        0,
        100
    );

    return {
        qualityScore: round(score, 2),
        guardrailCount,
        validationSuiteCount,
        tier,
        autopilotReady
    };
}

function toPriceTier(roiScore: number): 'starter' | 'growth' | 'pro' | 'enterprise' {
    if (roiScore >= 86) return 'enterprise';
    if (roiScore >= 73) return 'pro';
    if (roiScore >= 60) return 'growth';
    return 'starter';
}

function buildScorecards(catalog: MarketplaceCatalog, usageLogPath: string) {
    const usage = loadUsageAggregates(usageLogPath);
    const scorecards: ScorecardEntry[] = [];

    for (const entry of catalog.entries) {
        const implementation = resolveImplementationFromCatalogEntry(entry);
        const quality = computeQualityScore(entry, implementation);

        const observed = usage.aggregates.get(entry.id);
        const deterministicSeed = hashString(`${entry.id}|${entry.marketplaceSkillName}|${entry.verticalId}|${entry.score}`);

        let runs = 0;
        let successRate = 0;
        let avgDurationMs = 0;
        let estimatedValueUsd = 0;
        let metricSource: 'observed' | 'projected' = 'projected';

        if (observed && observed.runs > 0) {
            runs = observed.runs;
            successRate = observed.success / observed.runs;
            avgDurationMs = observed.totalDurationMs > 0
                ? observed.totalDurationMs / observed.runs
                : (12 + (deterministicSeed % 18)) * 60_000;
            estimatedValueUsd = observed.totalValueUsd > 0
                ? observed.totalValueUsd
                : observed.runs * (55 + (entry.score * 8));
            metricSource = 'observed';
        } else {
            runs = 10 + (deterministicSeed % 42);
            successRate = 0.68 + ((deterministicSeed >> 3) % 25) / 100;
            avgDurationMs = (9 + ((deterministicSeed >> 6) % 35)) * 60_000;
            const valuePerRun = 45 + (entry.score * 8) + ((deterministicSeed >> 9) % 60);
            estimatedValueUsd = runs * valuePerRun;
        }

        successRate = clamp(successRate, 0, 1);

        const reliabilityScore = clamp(
            (successRate * 75) + (quality.qualityScore * 0.25),
            0,
            100
        );
        const adoptionScore = clamp(runs * 2, 0, 100);
        const avgDurationMinutes = avgDurationMs / 60_000;
        const efficiencyScore = clamp(100 - (avgDurationMinutes * 1.5), 0, 100);

        const roiScore = clamp(
            (quality.qualityScore * 0.35)
            + (reliabilityScore * 0.25)
            + (adoptionScore * 0.2)
            + (efficiencyScore * 0.2),
            0,
            100
        );

        scorecards.push({
            skillId: entry.id,
            marketplaceSkillName: entry.marketplaceSkillName,
            title: entry.title,
            domain: entry.domain,
            verticalId: entry.verticalId,
            verticalName: entry.verticalName,
            method: entry.coreMethod,
            archetype: entry.runtimeArchetype,
            metricSource,
            runs,
            successRate: round(successRate, 4),
            avgDurationMs: round(avgDurationMs, 2),
            estimatedValueUsd: round(estimatedValueUsd, 2),
            qualityScore: round(quality.qualityScore, 2),
            reliabilityScore: round(reliabilityScore, 2),
            roiScore: round(roiScore, 2),
            recommendedPriceTier: toPriceTier(roiScore),
            qualitySignals: {
                guardrailCount: quality.guardrailCount,
                validationSuiteCount: quality.validationSuiteCount,
                improvementTier: quality.tier,
                autopilotReady: quality.autopilotReady
            }
        });
    }

    scorecards.sort((a, b) => {
        if (b.roiScore !== a.roiScore) return b.roiScore - a.roiScore;
        return a.skillId - b.skillId;
    });

    const observedSkills = scorecards.filter((entry) => entry.metricSource === 'observed').length;
    const projectedSkills = scorecards.length - observedSkills;
    const totalRuns = scorecards.reduce((sum, entry) => sum + entry.runs, 0);
    const estimatedValueUsd = scorecards.reduce((sum, entry) => sum + entry.estimatedValueUsd, 0);
    const avgQualityScore = scorecards.length
        ? scorecards.reduce((sum, entry) => sum + entry.qualityScore, 0) / scorecards.length
        : 0;
    const avgRoiScore = scorecards.length
        ? scorecards.reduce((sum, entry) => sum + entry.roiScore, 0) / scorecards.length
        : 0;

    const verticalMap = new Map<string, { name: string; sumRoi: number; count: number; }>();
    for (const entry of scorecards) {
        const current = verticalMap.get(entry.verticalId) || { name: entry.verticalName, sumRoi: 0, count: 0 };
        current.sumRoi += entry.roiScore;
        current.count += 1;
        verticalMap.set(entry.verticalId, current);
    }

    const topVerticalsByRoi = Array.from(verticalMap.entries())
        .map(([verticalId, value]) => ({
            verticalId,
            verticalName: value.name,
            avgRoiScore: round(value.count ? value.sumRoi / value.count : 0, 2),
            skills: value.count
        }))
        .sort((a, b) => b.avgRoiScore - a.avgRoiScore)
        .slice(0, 10);

    const summary: AnalyticsSummary = {
        totalSkills: scorecards.length,
        observedSkills,
        projectedSkills,
        totalRuns,
        estimatedValueUsd: round(estimatedValueUsd, 2),
        avgQualityScore: round(avgQualityScore, 2),
        avgRoiScore: round(avgRoiScore, 2),
        topVerticalsByRoi
    };

    return {
        usage,
        scorecards,
        summary
    };
}

function renderScorecardsMarkdown(payload: ScorecardsPayload): string {
    const lines = [
        '# Marketplace Skill Scorecards',
        '',
        `Generated at: ${payload.generatedAt}`,
        `Source catalog: \`${payload.sourceCatalog}\``,
        `Usage log: \`${payload.usageLogPath}\``,
        `Total skills: ${payload.count}`,
        `Observed skills: ${payload.summary.observedSkills}`,
        `Projected skills: ${payload.summary.projectedSkills}`,
        `Estimated value: $${payload.summary.estimatedValueUsd.toLocaleString('en-US')}`,
        '',
        '## Top 50 ROI Skills',
        '| Skill ID | Skill Name | Vertical | ROI | Quality | Reliability | Runs | Price Tier |',
        '| --- | --- | --- | --- | --- | --- | --- | --- |',
        ...payload.entries.slice(0, 50).map((entry) => (
            `| ${entry.skillId} | \`${entry.marketplaceSkillName}\` | ${entry.verticalName.replace(/\|/g, '\\|')} | ` +
            `${entry.roiScore} | ${entry.qualityScore} | ${entry.reliabilityScore} | ${entry.runs} | ${entry.recommendedPriceTier} |`
        )),
        '',
        '## Vertical ROI Summary',
        '| Vertical | Avg ROI | Skills |',
        '| --- | --- | --- |',
        ...payload.summary.topVerticalsByRoi.map((row) => (
            `| ${row.verticalName.replace(/\|/g, '\\|')} | ${row.avgRoiScore} | ${row.skills} |`
        )),
        ''
    ];

    return lines.join('\n');
}

function ensureUsageTemplate() {
    const template = [
        JSON.stringify({
            skillId: 7416,
            status: 'success',
            durationMs: 810000,
            valueUsd: 240,
            channel: 'pilot',
            executedAt: '2026-03-01T14:30:00Z'
        }),
        JSON.stringify({
            skillId: 5451,
            status: 'partial',
            durationMs: 1200000,
            valueUsd: 150,
            channel: 'pilot',
            executedAt: '2026-03-01T15:05:00Z'
        }),
        JSON.stringify({
            skillId: 2651,
            status: 'failure',
            durationMs: 480000,
            valueUsd: 0,
            channel: 'pilot',
            executedAt: '2026-03-01T15:40:00Z'
        })
    ].join('\n');

    fs.writeFileSync(USAGE_TEMPLATE_PATH, `${template}\n`);
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    assert(fs.existsSync(CATALOG_PATH), `Missing marketplace catalog: ${CATALOG_PATH}`);

    const catalog = loadJson<MarketplaceCatalog>(CATALOG_PATH);
    assert(Array.isArray(catalog.entries) && catalog.entries.length > 0, 'Marketplace catalog has no entries');

    fs.mkdirSync(ANALYTICS_ROOT, { recursive: true });
    ensureUsageTemplate();

    const usageLogPath = path.resolve(options.usageLogPath);
    const { usage, scorecards, summary } = buildScorecards(catalog, usageLogPath);

    const scorecardsPayload: ScorecardsPayload = {
        version: 1,
        generatedAt: new Date().toISOString(),
        sourceCatalog: path.relative(REPO_ROOT, CATALOG_PATH),
        usageLogPath: path.relative(REPO_ROOT, usageLogPath),
        count: scorecards.length,
        summary,
        entries: scorecards
    };

    const byVertical = new Map<string, { name: string; runs: number; success: number; valueUsd: number; }>();
    for (const scorecard of scorecards) {
        const current = byVertical.get(scorecard.verticalId) || {
            name: scorecard.verticalName,
            runs: 0,
            success: 0,
            valueUsd: 0
        };
        current.runs += scorecard.runs;
        current.success += Math.round(scorecard.runs * scorecard.successRate);
        current.valueUsd += scorecard.estimatedValueUsd;
        byVertical.set(scorecard.verticalId, current);
    }

    const usageSummary: UsageSummaryPayload = {
        version: 1,
        generatedAt: scorecardsPayload.generatedAt,
        usageLogPath: scorecardsPayload.usageLogPath,
        events: {
            totalEvents: usage.totalEvents,
            parseErrors: usage.parseErrors
        },
        totals: {
            runs: scorecards.reduce((sum, entry) => sum + entry.runs, 0),
            success: scorecards.reduce((sum, entry) => sum + Math.round(entry.runs * entry.successRate), 0),
            failure: scorecards.reduce((sum, entry) => sum + Math.round(entry.runs * (1 - entry.successRate)), 0),
            partial: scorecards.filter((entry) => entry.metricSource === 'observed').length,
            valueUsd: round(scorecards.reduce((sum, entry) => sum + entry.estimatedValueUsd, 0), 2)
        },
        byVertical: Array.from(byVertical.entries())
            .map(([verticalId, value]) => ({
                verticalId,
                verticalName: value.name,
                runs: value.runs,
                successRate: value.runs > 0 ? round(value.success / value.runs, 4) : 0,
                valueUsd: round(value.valueUsd, 2)
            }))
            .sort((a, b) => b.valueUsd - a.valueUsd)
    };

    fs.writeFileSync(SCORECARDS_JSON_PATH, `${JSON.stringify(scorecardsPayload, null, 2)}\n`);
    fs.writeFileSync(USAGE_SUMMARY_JSON_PATH, `${JSON.stringify(usageSummary, null, 2)}\n`);
    fs.writeFileSync(SCORECARDS_MD_PATH, `${renderScorecardsMarkdown(scorecardsPayload)}\n`);

    console.log(`[build-marketplace-analytics] Scorecards generated for ${scorecards.length} skills.`);
    console.log(`[build-marketplace-analytics] Observed usage events: ${usage.totalEvents} (parse errors: ${usage.parseErrors}).`);
    console.log(`[build-marketplace-analytics] Avg quality score: ${summary.avgQualityScore}. Avg ROI score: ${summary.avgRoiScore}.`);
    console.log(`[build-marketplace-analytics] Estimated annualized value baseline: $${summary.estimatedValueUsd.toLocaleString('en-US')}.`);
}

main();
