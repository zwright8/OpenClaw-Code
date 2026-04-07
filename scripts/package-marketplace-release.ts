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
    score: number;
    marketplacePath: string;
};

type MarketplaceCatalog = {
    version: number;
    generatedAt: string;
    count: number;
    entries: MarketplaceCatalogEntry[];
};

type BundleCatalog = {
    version: number;
    generatedAt: string;
    count: number;
    bundles: Array<{
        verticalId: string;
        verticalName: string;
        description: string;
        count: number;
        bundlePath: string;
        readmePath: string;
        demoPath: string;
    }>;
};

type ScorecardsPayload = {
    version: number;
    generatedAt: string;
    count: number;
    summary: {
        avgQualityScore: number;
        avgRoiScore: number;
        estimatedValueUsd: number;
    };
    entries: Array<{
        skillId: number;
        marketplaceSkillName: string;
        roiScore: number;
        qualityScore: number;
        reliabilityScore: number;
        recommendedPriceTier: string;
    }>;
};

type PackageOptions = {
    version: string;
};

const REPO_ROOT = process.cwd();
const MARKETPLACE_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace');
const RELEASES_ROOT = path.join(MARKETPLACE_ROOT, 'releases');
const CATALOG_PATH = path.join(MARKETPLACE_ROOT, 'skills.catalog.json');
const BUNDLE_CATALOG_PATH = path.join(MARKETPLACE_ROOT, 'bundles', 'bundles.catalog.json');
const ANALYTICS_SCORECARDS_PATH = path.join(MARKETPLACE_ROOT, 'analytics', 'scorecards.json');
const ANALYTICS_USAGE_PATH = path.join(MARKETPLACE_ROOT, 'analytics', 'usage.summary.json');
const ANALYTICS_MD_PATH = path.join(MARKETPLACE_ROOT, 'analytics', 'SCORECARDS.md');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function slugify(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function parseArgs(argv: string[]): PackageOptions {
    const now = new Date();
    const defaultVersion = `v${now.getUTCFullYear()}.${String(now.getUTCMonth() + 1).padStart(2, '0')}.${String(now.getUTCDate()).padStart(2, '0')}`;
    const options: PackageOptions = {
        version: defaultVersion
    };

    for (let index = 0; index < argv.length; index += 1) {
        const token = argv[index];
        if (token === '--version') {
            const next = argv[index + 1];
            assert(next, 'Missing value for --version');
            options.version = next;
            index += 1;
        }
    }

    assert(/^v?[0-9][a-zA-Z0-9._-]*$/.test(options.version), `Invalid version: ${options.version}`);
    return options;
}

function renderReleaseReadme(version: string, catalog: MarketplaceCatalog, scorecards: ScorecardsPayload): string {
    return [
        `# OpenClaw Marketplace Skill Pack ${version}`,
        '',
        `Generated at: ${new Date().toISOString()}`,
        `Skills packaged: ${catalog.count}`,
        `Avg quality score: ${scorecards.summary.avgQualityScore}`,
        `Avg ROI score: ${scorecards.summary.avgRoiScore}`,
        `Estimated value baseline: $${scorecards.summary.estimatedValueUsd.toLocaleString('en-US')}`,
        '',
        '## Package Contents',
        '- `manifests/` full catalog, bundle catalog, and analytics payloads.',
        '- `packs/` verticalized skill packs with SKILL.md, openai.yaml, and implementation references.',
        '- `demos/` bundle-specific demo prompts.',
        '- `CHANNEL_MAP.md` current distribution-channel mapping and constraints.',
        '',
        '## Suggested Commercial Structure',
        '- Starter: single vertical pack for pilot teams.',
        '- Growth: multi-vertical pack with analytics scorecards.',
        '- Enterprise: full bundle plus custom governance/policy profile.',
        ''
    ].join('\n');
}

function renderChannelMap(version: string): string {
    return [
        '# Channel Map',
        '',
        `Release: ${version}`,
        `Generated: ${new Date().toISOString()}`,
        '',
        '## Current Channels (March 2, 2026)',
        '- GitHub Releases: Package source of truth, changelog, and install docs.',
        '- Direct enterprise delivery: Signed bundle manifests + private repo access.',
        '- GPT Store alignment: Position as packaged instruction frameworks and operational templates where applicable.',
        '',
        '## Pending/Watchlist',
        '- Codex-native skill marketplace listing workflow: monitor official OpenAI documentation for launch details.',
        '',
        '## Go-To-Market Mapping',
        '- If channel supports direct skill artifacts: publish per-vertical packs from `packs/`.',
        '- If channel supports prompt/template listings only: map each pack to curated prompt bundles and link implementation docs.',
        '- For enterprise procurement: use analytics scorecards to justify pricing tiers and renewal terms.',
        ''
    ].join('\n');
}

function copyFileSafe(sourcePath: string, targetPath: string) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
}

function copyDirSafe(sourceDir: string, targetDir: string) {
    fs.mkdirSync(path.dirname(targetDir), { recursive: true });
    fs.cpSync(sourceDir, targetDir, { recursive: true });
}

function main() {
    const options = parseArgs(process.argv.slice(2));

    assert(fs.existsSync(CATALOG_PATH), `Missing marketplace catalog: ${CATALOG_PATH}`);
    assert(fs.existsSync(BUNDLE_CATALOG_PATH), `Missing bundle catalog: ${BUNDLE_CATALOG_PATH}`);
    assert(fs.existsSync(ANALYTICS_SCORECARDS_PATH), `Missing analytics scorecards: ${ANALYTICS_SCORECARDS_PATH}`);

    const catalog = loadJson<MarketplaceCatalog>(CATALOG_PATH);
    const bundleCatalog = loadJson<BundleCatalog>(BUNDLE_CATALOG_PATH);
    const scorecards = loadJson<ScorecardsPayload>(ANALYTICS_SCORECARDS_PATH);

    const versionDirName = options.version.startsWith('v') ? options.version : `v${options.version}`;
    const releaseDir = path.join(RELEASES_ROOT, versionDirName);
    const manifestsDir = path.join(releaseDir, 'manifests');
    const packsDir = path.join(releaseDir, 'packs');
    const demosDir = path.join(releaseDir, 'demos');

    if (fs.existsSync(releaseDir)) {
        fs.rmSync(releaseDir, { recursive: true, force: true });
    }

    fs.mkdirSync(manifestsDir, { recursive: true });
    fs.mkdirSync(packsDir, { recursive: true });
    fs.mkdirSync(demosDir, { recursive: true });

    copyFileSafe(CATALOG_PATH, path.join(manifestsDir, 'skills.catalog.json'));
    copyFileSafe(BUNDLE_CATALOG_PATH, path.join(manifestsDir, 'bundles.catalog.json'));
    copyFileSafe(ANALYTICS_SCORECARDS_PATH, path.join(manifestsDir, 'scorecards.json'));

    if (fs.existsSync(ANALYTICS_USAGE_PATH)) {
        copyFileSafe(ANALYTICS_USAGE_PATH, path.join(manifestsDir, 'usage.summary.json'));
    }
    if (fs.existsSync(ANALYTICS_MD_PATH)) {
        copyFileSafe(ANALYTICS_MD_PATH, path.join(manifestsDir, 'SCORECARDS.md'));
    }

    const entriesById = new Map<number, MarketplaceCatalogEntry>();
    for (const entry of catalog.entries) {
        entriesById.set(entry.id, entry);
    }

    const packManifests: Array<{
        verticalId: string;
        verticalName: string;
        count: number;
        manifestPath: string;
        demoPath: string;
    }> = [];

    for (const bundle of bundleCatalog.bundles) {
        const bundleJsonPath = path.join(REPO_ROOT, bundle.bundlePath);
        const bundleReadmePath = path.join(REPO_ROOT, bundle.readmePath);
        const bundleDemoPath = path.join(REPO_ROOT, bundle.demoPath);
        assert(fs.existsSync(bundleJsonPath), `Missing bundle file: ${bundle.bundlePath}`);

        const bundlePayload = loadJson<{
            entries: Array<{ id: number; marketplacePath: string; }>;
        }>(bundleJsonPath);

        const verticalPackDir = path.join(packsDir, slugify(bundle.verticalId));
        const verticalSkillsDir = path.join(verticalPackDir, 'skills');
        const verticalManifestPath = path.join(verticalPackDir, 'pack.manifest.json');

        fs.mkdirSync(verticalSkillsDir, { recursive: true });

        const skillRefs: Array<{
            id: number;
            marketplaceSkillName: string;
            title: string;
            domain: string;
            coreMethod: string;
            score: number;
            path: string;
        }> = [];

        for (const entryRef of bundlePayload.entries || []) {
            const catalogEntry = entriesById.get(Number(entryRef.id));
            if (!catalogEntry) continue;

            const sourceSkillPath = path.join(REPO_ROOT, catalogEntry.marketplacePath);
            const sourceSkillDir = path.dirname(sourceSkillPath);
            const skillFolderName = path.basename(sourceSkillDir);
            const targetSkillDir = path.join(verticalSkillsDir, skillFolderName);
            copyDirSafe(sourceSkillDir, targetSkillDir);

            skillRefs.push({
                id: catalogEntry.id,
                marketplaceSkillName: catalogEntry.marketplaceSkillName,
                title: catalogEntry.title,
                domain: catalogEntry.domain,
                coreMethod: catalogEntry.coreMethod,
                score: catalogEntry.score,
                path: `packs/${slugify(bundle.verticalId)}/skills/${skillFolderName}/SKILL.md`
            });
        }

        const manifest = {
            version: 1,
            releaseVersion: versionDirName,
            verticalId: bundle.verticalId,
            verticalName: bundle.verticalName,
            description: bundle.description,
            count: skillRefs.length,
            generatedAt: new Date().toISOString(),
            skills: skillRefs
        };

        fs.writeFileSync(verticalManifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

        if (fs.existsSync(bundleReadmePath)) {
            copyFileSafe(bundleReadmePath, path.join(verticalPackDir, 'README.md'));
        }
        if (fs.existsSync(bundleDemoPath)) {
            copyFileSafe(bundleDemoPath, path.join(demosDir, `${slugify(bundle.verticalId)}-demo-prompts.md`));
        }

        packManifests.push({
            verticalId: bundle.verticalId,
            verticalName: bundle.verticalName,
            count: skillRefs.length,
            manifestPath: `packs/${slugify(bundle.verticalId)}/pack.manifest.json`,
            demoPath: `demos/${slugify(bundle.verticalId)}-demo-prompts.md`
        });
    }

    const releaseManifest = {
        version: 1,
        releaseVersion: versionDirName,
        generatedAt: new Date().toISOString(),
        sourceCatalogCount: catalog.count,
        bundleCount: bundleCatalog.count,
        packs: packManifests,
        analytics: {
            avgQualityScore: scorecards.summary.avgQualityScore,
            avgRoiScore: scorecards.summary.avgRoiScore,
            estimatedValueUsd: scorecards.summary.estimatedValueUsd
        }
    };

    fs.writeFileSync(path.join(releaseDir, 'release.manifest.json'), `${JSON.stringify(releaseManifest, null, 2)}\n`);
    fs.writeFileSync(path.join(releaseDir, 'README.md'), `${renderReleaseReadme(versionDirName, catalog, scorecards)}\n`);
    fs.writeFileSync(path.join(releaseDir, 'CHANNEL_MAP.md'), `${renderChannelMap(versionDirName)}\n`);

    const notes = [
        `# Release Notes ${versionDirName}`,
        '',
        `Generated at: ${new Date().toISOString()}`,
        '',
        `- Packaged marketplace skills: ${catalog.count}`,
        `- Vertical packs: ${bundleCatalog.count}`,
        `- Avg quality score: ${scorecards.summary.avgQualityScore}`,
        `- Avg ROI score: ${scorecards.summary.avgRoiScore}`,
        `- Estimated value baseline: $${scorecards.summary.estimatedValueUsd.toLocaleString('en-US')}`,
        '',
        '## Publish Checklist',
        '- Validate `manifests/` checksums and skill counts.',
        '- Confirm demo prompts execute against current runtime.',
        '- Attach release archive to GitHub release and include CHANNEL_MAP guidance.',
        ''
    ].join('\n');
    fs.writeFileSync(path.join(releaseDir, 'RELEASE_NOTES.md'), `${notes}\n`);

    console.log(`[package-marketplace-release] Release package created: ${path.relative(REPO_ROOT, releaseDir)}`);
    console.log(`[package-marketplace-release] Packs: ${packManifests.length}. Skills copied: ${catalog.count}.`);
}

main();
