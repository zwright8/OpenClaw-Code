import fs from 'fs';
import path from 'path';

type ReleaseManifest = {
    version: number;
    releaseVersion: string;
    sourceCatalogCount: number;
    bundleCount: number;
    packs: Array<{
        verticalId: string;
        count: number;
        manifestPath: string;
        demoPath: string;
    }>;
};

type Options = {
    version: string | null;
};

const REPO_ROOT = process.cwd();
const RELEASES_ROOT = path.join(REPO_ROOT, 'skills', 'marketplace', 'releases');

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) {
        throw new Error(message);
    }
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function parseArgs(argv: string[]): Options {
    const options: Options = {
        version: null
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

    return options;
}

function resolveReleaseDir(version: string | null): string {
    assert(fs.existsSync(RELEASES_ROOT), `Missing releases root: ${RELEASES_ROOT}`);

    if (version) {
        const dir = path.join(RELEASES_ROOT, version.startsWith('v') ? version : `v${version}`);
        assert(fs.existsSync(dir), `Release directory not found: ${dir}`);
        return dir;
    }

    const candidates = fs.readdirSync(RELEASES_ROOT)
        .filter((name) => fs.statSync(path.join(RELEASES_ROOT, name)).isDirectory())
        .sort();
    assert(candidates.length > 0, 'No release directories found.');
    return path.join(RELEASES_ROOT, candidates[candidates.length - 1]);
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    const releaseDir = resolveReleaseDir(options.version);

    const manifestPath = path.join(releaseDir, 'release.manifest.json');
    const readmePath = path.join(releaseDir, 'README.md');
    const notesPath = path.join(releaseDir, 'RELEASE_NOTES.md');
    const channelMapPath = path.join(releaseDir, 'CHANNEL_MAP.md');

    assert(fs.existsSync(manifestPath), `Missing release.manifest.json: ${manifestPath}`);
    assert(fs.existsSync(readmePath), `Missing README.md: ${readmePath}`);
    assert(fs.existsSync(notesPath), `Missing RELEASE_NOTES.md: ${notesPath}`);
    assert(fs.existsSync(channelMapPath), `Missing CHANNEL_MAP.md: ${channelMapPath}`);

    const manifest = loadJson<ReleaseManifest>(manifestPath);
    assert(Array.isArray(manifest.packs) && manifest.packs.length > 0, 'Release manifest has no packs');

    let totalPackSkills = 0;
    for (const pack of manifest.packs) {
        const packManifestPath = path.join(releaseDir, pack.manifestPath);
        const demoPath = path.join(releaseDir, pack.demoPath);
        assert(fs.existsSync(packManifestPath), `Missing pack manifest: ${packManifestPath}`);
        assert(fs.existsSync(demoPath), `Missing demo file: ${demoPath}`);

        const packManifest = loadJson<{ count: number; skills: Array<{ path: string; }>; }>(packManifestPath);
        assert(Array.isArray(packManifest.skills), `Invalid pack skills array: ${packManifestPath}`);
        assert(packManifest.count === packManifest.skills.length, `Pack count mismatch: ${packManifestPath}`);

        for (const skill of packManifest.skills) {
            const skillPath = path.join(releaseDir, skill.path);
            assert(fs.existsSync(skillPath), `Missing packaged skill file: ${skill.path}`);
        }

        totalPackSkills += packManifest.count;
    }

    assert(totalPackSkills === manifest.sourceCatalogCount, `Pack total mismatch: ${totalPackSkills} != ${manifest.sourceCatalogCount}`);

    console.log(`[validate-marketplace-release] Release validated: ${path.relative(REPO_ROOT, releaseDir)}`);
    console.log(`[validate-marketplace-release] Packs: ${manifest.packs.length}, Skills: ${totalPackSkills}`);
}

main();
