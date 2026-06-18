import fs from 'fs';
import path from 'path';

type HermesAgentConfig = {
    version: number;
    agent: {
        id: string;
        name: string;
        displayName: string;
        description: string;
        mode: string;
        owner: string;
    };
    loadout: {
        skillRoot: string;
        skillFileName: string;
        agentMetadataPath: string;
        sharedReferencesRoot: string;
        outputManifest: string;
        include: string[];
        exclude: string[];
    };
    routing: {
        defaultStrategy: string;
        fallbackSkillName: string;
        handoffTarget: string;
        evidenceRequired: boolean;
    };
    guardrails: string[];
    requiredSharedReferences: string[];
};

type CliOptions = {
    repoRoot: string;
    agentPath: string;
    outPath: string | null;
    checkOnly: boolean;
    strictAgentMetadata: boolean;
    help: boolean;
};

type SkillMetadata = {
    name: string;
    description: string;
    title: string;
};

type AgentInterfaceMetadata = {
    displayName: string;
    shortDescription: string;
};

type HermesSkillManifestEntry = {
    loadoutId: string;
    name: string;
    title: string;
    description: string;
    skillPath: string;
    agentMetadataPath: string | null;
    agentDisplayName: string | null;
    agentShortDescription: string | null;
};

type HermesManifest = {
    version: 1;
    generatedAt: string;
    agent: HermesAgentConfig['agent'];
    routing: HermesAgentConfig['routing'];
    source: {
        agentConfigPath: string;
        skillRoot: string;
        skillFileName: string;
        agentMetadataPath: string;
        sharedReferencesRoot: string;
    };
    summary: {
        skillCount: number;
        skillsWithAgentMetadata: number;
        skillsMissingAgentMetadata: number;
        sharedReferenceCount: number;
    };
    guardrails: string[];
    requiredSharedReferences: string[];
    sharedReferences: string[];
    skills: HermesSkillManifestEntry[];
};

const DEFAULT_AGENT_PATH = path.join('agents', 'hermes', 'agent.json');

function printHelp() {
    console.log(`Build the Hermes warfighter agent loadout manifest

Usage:
  tsx scripts/build-hermes-agent.ts [options]

Options:
  --repo-root <path>            Repository root (default: .)
  --agent <path>                Hermes agent config path (default: agents/hermes/agent.json)
  --out <path>                  Manifest output path (default: config loadout.outputManifest)
  --check                       Validate and print a summary without writing the manifest
  --strict-agent-metadata       Fail when a skill is missing agents/openai.yaml
  -h, --help                    Show help
`);
}

function parseArgs(argv: string[]): CliOptions {
    const repoRoot = path.resolve(process.cwd());
    const options: CliOptions = {
        repoRoot,
        agentPath: path.join(repoRoot, DEFAULT_AGENT_PATH),
        outPath: null,
        checkOnly: false,
        strictAgentMetadata: false,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '-h' || token === '--help') {
            options.help = true;
            continue;
        }
        if (token === '--check') {
            options.checkOnly = true;
            continue;
        }
        if (token === '--strict-agent-metadata') {
            options.strictAgentMetadata = true;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--repo-root') {
            options.repoRoot = path.resolve(process.cwd(), value);
            options.agentPath = path.join(options.repoRoot, DEFAULT_AGENT_PATH);
            i++;
            continue;
        }
        if (token === '--agent') {
            options.agentPath = path.resolve(options.repoRoot, value);
            i++;
            continue;
        }
        if (token === '--out') {
            options.outPath = path.resolve(options.repoRoot, value);
            i++;
            continue;
        }

        throw new Error(`Unknown option: ${token}`);
    }

    return options;
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function readJsonFile<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function toRepoRelative(repoRoot: string, filePath: string): string {
    return path.relative(repoRoot, filePath).split(path.sep).join('/');
}

function resolveRepoPath(repoRoot: string, relativePath: string): string {
    return path.resolve(repoRoot, relativePath);
}

function isConflictMarked(markdown: string): boolean {
    return /^<<<<<<< |^=======|^>>>>>>> /m.test(markdown);
}

function parseMetadata(markdown: string, filePath: string): SkillMetadata {
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
    const frontmatter = frontmatterMatch?.[1] || '';
    const name = frontmatter.match(/(?:^|\n)name:\s+(.+?)(?:\n|$)/)?.[1]?.trim() || '';
    const description = frontmatter.match(/(?:^|\n)description:\s+(.+?)(?:\n|$)/)?.[1]?.trim() || '';
    const title = markdown.match(/^#\s+(.+?)$/m)?.[1]?.trim() || '';

    assert(name.length > 0, `Missing frontmatter name in ${filePath}`);
    assert(description.length > 0, `Missing frontmatter description in ${filePath}`);
    assert(title.length > 0, `Missing title heading in ${filePath}`);

    return { name, description, title };
}

function extractYamlString(raw: string, key: string): string {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = raw.match(new RegExp(`(?:^|\\n)\\s*${escapedKey}:\\s*["']?([^"'\\n]+)["']?(?:\\n|$)`));
    return match?.[1]?.trim() || '';
}

function parseAgentInterface(filePath: string): AgentInterfaceMetadata {
    const raw = fs.readFileSync(filePath, 'utf8');
    return {
        displayName: extractYamlString(raw, 'display_name'),
        shortDescription: extractYamlString(raw, 'short_description')
    };
}

function walkFiles(root: string, predicate: (entry: fs.Dirent) => boolean): string[] {
    if (!fs.existsSync(root)) return [];
    const results: string[] = [];
    const pending = [root];

    while (pending.length > 0) {
        const current = pending.pop();
        if (!current) continue;
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                pending.push(fullPath);
                continue;
            }
            if (entry.isFile() && predicate(entry)) {
                results.push(fullPath);
            }
        }
    }

    return results.sort((a, b) => a.localeCompare(b));
}

function discoverSkillFiles(skillRoot: string, skillFileName: string): string[] {
    return walkFiles(skillRoot, (entry) => entry.name === skillFileName)
        .filter((filePath) => !filePath.includes(`${path.sep}_shared${path.sep}`));
}

function discoverSharedReferences(sharedReferencesRoot: string): string[] {
    return walkFiles(sharedReferencesRoot, (entry) => entry.name.endsWith('.md'));
}

function assertConfig(config: HermesAgentConfig, configPath: string) {
    assert(config.version === 1, `Invalid Hermes config version in ${configPath}`);
    assert(config.agent?.id === 'agent:hermes', 'Hermes agent id must be agent:hermes');
    assert(config.agent.name === 'Hermes', 'Hermes agent name must be Hermes');
    assert(config.loadout?.skillRoot.length > 0, 'Missing loadout.skillRoot');
    assert(config.loadout.skillFileName.length > 0, 'Missing loadout.skillFileName');
    assert(config.loadout.agentMetadataPath.length > 0, 'Missing loadout.agentMetadataPath');
    assert(config.loadout.sharedReferencesRoot.length > 0, 'Missing loadout.sharedReferencesRoot');
    assert(config.loadout.outputManifest.length > 0, 'Missing loadout.outputManifest');
    assert(Array.isArray(config.guardrails) && config.guardrails.length >= 4, 'Hermes guardrails are too thin');
    assert(
        Array.isArray(config.requiredSharedReferences) && config.requiredSharedReferences.length > 0,
        'Hermes must declare required shared references'
    );
}

function buildManifest(options: CliOptions): HermesManifest {
    assert(fs.existsSync(options.agentPath), `Missing Hermes agent config: ${options.agentPath}`);
    const config = readJsonFile<HermesAgentConfig>(options.agentPath);
    assertConfig(config, options.agentPath);

    const skillRoot = resolveRepoPath(options.repoRoot, config.loadout.skillRoot);
    const sharedReferencesRoot = resolveRepoPath(options.repoRoot, config.loadout.sharedReferencesRoot);
    assert(fs.existsSync(skillRoot), `Missing Hermes skill root: ${skillRoot}`);
    assert(fs.existsSync(sharedReferencesRoot), `Missing Hermes shared references root: ${sharedReferencesRoot}`);

    const skillFiles = discoverSkillFiles(skillRoot, config.loadout.skillFileName);
    assert(skillFiles.length > 0, `No ${config.loadout.skillFileName} files found under ${skillRoot}`);

    const seenNames = new Set<string>();
    const skills = skillFiles.map((skillFile) => {
        const markdown = fs.readFileSync(skillFile, 'utf8');
        assert(!isConflictMarked(markdown), `Unresolved conflict markers in ${skillFile}`);
        const metadata = parseMetadata(markdown, skillFile);
        assert(!seenNames.has(metadata.name), `Duplicate warfighter skill name: ${metadata.name}`);
        seenNames.add(metadata.name);

        const skillDir = path.dirname(skillFile);
        const agentMetadataPath = path.join(skillDir, config.loadout.agentMetadataPath);
        const hasAgentMetadata = fs.existsSync(agentMetadataPath);
        if (options.strictAgentMetadata) {
            assert(hasAgentMetadata, `Missing agent metadata for ${skillFile}`);
        }
        const agentMetadata = hasAgentMetadata ? parseAgentInterface(agentMetadataPath) : null;

        return {
            loadoutId: `warfighter:${metadata.name}`,
            name: metadata.name,
            title: metadata.title,
            description: metadata.description,
            skillPath: toRepoRelative(options.repoRoot, skillFile),
            agentMetadataPath: hasAgentMetadata ? toRepoRelative(options.repoRoot, agentMetadataPath) : null,
            agentDisplayName: agentMetadata?.displayName || null,
            agentShortDescription: agentMetadata?.shortDescription || null
        };
    });

    const sharedReferencePaths = discoverSharedReferences(sharedReferencesRoot)
        .map((referencePath) => toRepoRelative(options.repoRoot, referencePath));
    const sharedReferenceNames = new Set(sharedReferencePaths.map((referencePath) => path.basename(referencePath)));
    for (const requiredReference of config.requiredSharedReferences) {
        assert(
            sharedReferenceNames.has(requiredReference),
            `Missing required Hermes shared reference: ${requiredReference}`
        );
    }

    const skillsWithAgentMetadata = skills.filter((skill) => skill.agentMetadataPath).length;

    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        agent: config.agent,
        routing: config.routing,
        source: {
            agentConfigPath: toRepoRelative(options.repoRoot, options.agentPath),
            skillRoot: config.loadout.skillRoot,
            skillFileName: config.loadout.skillFileName,
            agentMetadataPath: config.loadout.agentMetadataPath,
            sharedReferencesRoot: config.loadout.sharedReferencesRoot
        },
        summary: {
            skillCount: skills.length,
            skillsWithAgentMetadata,
            skillsMissingAgentMetadata: skills.length - skillsWithAgentMetadata,
            sharedReferenceCount: sharedReferencePaths.length
        },
        guardrails: config.guardrails,
        requiredSharedReferences: config.requiredSharedReferences,
        sharedReferences: sharedReferencePaths,
        skills
    };
}

function writeJson(filePath: string, payload: unknown) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        printHelp();
        return;
    }

    const config = readJsonFile<HermesAgentConfig>(options.agentPath);
    const outPath = options.outPath || resolveRepoPath(options.repoRoot, config.loadout.outputManifest);
    const manifest = buildManifest(options);

    if (!options.checkOnly) {
        writeJson(outPath, manifest);
    }

    const action = options.checkOnly ? 'Validated' : 'Built';
    console.log(
        `[build-hermes-agent] ${action} ${manifest.summary.skillCount} warfighter skills for ${manifest.agent.id} ` +
        `(${manifest.summary.skillsWithAgentMetadata} with agent metadata, ` +
        `${manifest.summary.skillsMissingAgentMetadata} missing agent metadata, ` +
        `${manifest.summary.sharedReferenceCount} shared references).`
    );
    if (!options.checkOnly) {
        console.log(`[build-hermes-agent] Manifest: ${toRepoRelative(options.repoRoot, outPath)}`);
    }
}

main();
