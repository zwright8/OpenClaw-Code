import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const DEFAULT_SKILLS_OUT = path.join('skills', 'state', 'embedding-routing.skills.jsonl');
const DEFAULT_DOMAINS_OUT = path.join('skills', 'state', 'embedding-routing.domains.jsonl');
const DEFAULT_MEMORY_OUT = path.join('skills', 'state', 'embedding-routing.memory.jsonl');
const DEFAULT_BUDGET_OUT = path.join('skills', 'state', 'embedding-routing.budget.json');
const DEFAULT_MEMORY_DAYS = 30;
const DEFAULT_MAX_MEMORY_ENTRIES = 500;
const MANIFEST_FILES = ['skills.manifest.10000.json', 'skills.manifest.json'] as const;

type SkillManifestEntry = {
    id: number;
    name?: string;
    title?: string;
    domain?: string;
    path?: string;
    implementationPath?: string;
    reason?: string;
    stepCount?: number;
    runtimeArchetype?: string | null;
    coreMethod?: string | null;
    primaryArtifact?: string | null;
};

type JsonRecord = Record<string, unknown>;

type Options = {
    repoRoot: string;
    manifestPath: string | null;
    skillsOutPath: string;
    domainsOutPath: string;
    memoryOutPath: string;
    budgetOutPath: string;
    memoryRoot: string | null;
    memoryDays: number;
    maxMemoryEntries: number;
    skipSkills: boolean;
    skipMemory: boolean;
    help: boolean;
};

function printHelp() {
    console.log(`Build compact embedding routing corpora for OpenClaw.

Usage:
  tsx scripts/build-embedding-routing-corpus.ts [options]

Options:
  --repo-root <path>         Repository root (default: cwd)
  --manifest <path>          Explicit skill manifest path
  --skills-out <path>        Output JSONL for compact skill routing docs
  --domains-out <path>       Output JSONL for compact domain routing docs
  --memory-out <path>        Output JSONL for compact memory routing docs
  --budget-out <path>        Output JSON for corpus budget summary
  --memory-root <path>       Root directory for markdown memory files
  --memory-days <n>          Include memory entries modified in last n days (default: 30)
  --max-memory <n>           Max memory entries to include (default: 500)
  --skip-skills              Skip skill/domain routing corpus generation
  --skip-memory              Skip memory routing corpus generation
  -h, --help                 Show help
`);
}

function parsePositiveInt(raw: string, flag: string): number {
    const value = Number(raw);
    if (!Number.isInteger(value) || value <= 0) {
        throw new Error(`${flag} must be a positive integer`);
    }
    return value;
}

function parseArgs(argv: string[]): Options {
    const options: Options = {
        repoRoot: process.cwd(),
        manifestPath: null,
        skillsOutPath: path.resolve(process.cwd(), DEFAULT_SKILLS_OUT),
        domainsOutPath: path.resolve(process.cwd(), DEFAULT_DOMAINS_OUT),
        memoryOutPath: path.resolve(process.cwd(), DEFAULT_MEMORY_OUT),
        budgetOutPath: path.resolve(process.cwd(), DEFAULT_BUDGET_OUT),
        memoryRoot: null,
        memoryDays: DEFAULT_MEMORY_DAYS,
        maxMemoryEntries: DEFAULT_MAX_MEMORY_ENTRIES,
        skipSkills: false,
        skipMemory: false,
        help: false
    };

    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }
        if (token === '--skip-skills') {
            options.skipSkills = true;
            continue;
        }
        if (token === '--skip-memory') {
            options.skipMemory = true;
            continue;
        }

        const next = argv[i + 1];
        if (!next) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--repo-root') {
            options.repoRoot = path.resolve(process.cwd(), next);
            i += 1;
            continue;
        }
        if (token === '--manifest') {
            options.manifestPath = path.resolve(process.cwd(), next);
            i += 1;
            continue;
        }
        if (token === '--skills-out') {
            options.skillsOutPath = path.resolve(process.cwd(), next);
            i += 1;
            continue;
        }
        if (token === '--domains-out') {
            options.domainsOutPath = path.resolve(process.cwd(), next);
            i += 1;
            continue;
        }
        if (token === '--memory-out') {
            options.memoryOutPath = path.resolve(process.cwd(), next);
            i += 1;
            continue;
        }
        if (token === '--budget-out') {
            options.budgetOutPath = path.resolve(process.cwd(), next);
            i += 1;
            continue;
        }
        if (token === '--memory-root') {
            options.memoryRoot = path.resolve(process.cwd(), next);
            i += 1;
            continue;
        }
        if (token === '--memory-days') {
            options.memoryDays = parsePositiveInt(next, '--memory-days');
            i += 1;
            continue;
        }
        if (token === '--max-memory') {
            options.maxMemoryEntries = parsePositiveInt(next, '--max-memory');
            i += 1;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function ensureDirForFile(filePath: string) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function normalizeSpace(value: unknown): string {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function clip(value: unknown, max = 280): string {
    const text = normalizeSpace(value);
    if (!text) return '';
    if (text.length <= max) return text;
    return `${text.slice(0, Math.max(0, max - 1)).trimEnd()}...`;
}

function trimSentence(value: unknown): string {
    return normalizeSpace(value).replace(/[.!?\s]+$/g, '').trim();
}

function slugify(value: unknown): string {
    return normalizeSpace(value)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

function hashText(value: string): string {
    return crypto.createHash('sha1').update(value).digest('hex').slice(0, 16);
}

function estimateTokensFromChars(charCount: number): number {
    return Math.ceil(Math.max(0, charCount) / 4);
}

function writeJsonl(filePath: string, records: JsonRecord[]) {
    ensureDirForFile(filePath);
    const payload = records.map((record) => JSON.stringify(record)).join('\n');
    fs.writeFileSync(filePath, payload ? `${payload}\n` : '');
}

function resolveManifestPath(repoRoot: string, explicitPath: string | null): string {
    if (explicitPath) {
        if (!fs.existsSync(explicitPath)) {
            throw new Error(`Manifest not found: ${explicitPath}`);
        }
        return explicitPath;
    }

    const generatedRoot = path.join(repoRoot, 'skills', 'generated');
    for (const candidate of MANIFEST_FILES) {
        const filePath = path.join(generatedRoot, candidate);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }

    throw new Error(`No manifest found under ${generatedRoot}`);
}

function countBytes(filePath: string): number {
    try {
        return fs.statSync(filePath).size;
    } catch {
        return 0;
    }
}

function counterTop(values: unknown[], max = 5): string[] {
    const counts = new Map<string, number>();
    for (const value of values) {
        const key = normalizeSpace(value);
        if (!key) continue;
        counts.set(key, (counts.get(key) || 0) + 1);
    }
    return [...counts.entries()]
        .sort((left, right) => {
            if (right[1] !== left[1]) return right[1] - left[1];
            return left[0].localeCompare(right[0]);
        })
        .slice(0, max)
        .map(([value]) => value);
}

function buildSkillRoutingText(entry: SkillManifestEntry): string {
    const title = clip(trimSentence(entry.title || entry.name || `Skill ${entry.id}`), 100);
    const domain = clip(trimSentence(entry.domain || 'Unknown domain'), 80);
    const reason = clip(trimSentence(entry.reason), 180);
    const method = clip(trimSentence(entry.coreMethod), 80);
    const artifact = clip(trimSentence(entry.primaryArtifact), 80);
    const archetype = clip(trimSentence(entry.runtimeArchetype), 60);
    const stepCount = Number.isInteger(entry.stepCount) && Number(entry.stepCount) > 0
        ? `${entry.stepCount} steps`
        : '';

    const segments = [
        title,
        `Domain: ${domain}`,
        reason ? `Why: ${reason}` : '',
        method ? `Method: ${method}` : '',
        artifact ? `Artifact: ${artifact}` : '',
        archetype ? `Archetype: ${archetype}` : '',
        stepCount
    ].filter(Boolean);

    return clip(segments.join('. '), 420);
}

function buildSkillRoutingRecord(entry: SkillManifestEntry): JsonRecord {
    const text = buildSkillRoutingText(entry);
    return {
        id: `skill:${entry.id}`,
        namespace: 'skills.route',
        title: entry.title || entry.name || `Skill ${entry.id}`,
        text,
        pointer: {
            path: entry.path || null,
            implementationPath: entry.implementationPath || null
        },
        metadata: {
            skillId: entry.id,
            skillName: entry.name || null,
            domain: entry.domain || null,
            runtimeArchetype: entry.runtimeArchetype || null,
            coreMethod: entry.coreMethod || null,
            primaryArtifact: entry.primaryArtifact || null,
            stepCount: Number.isInteger(entry.stepCount) ? entry.stepCount : null,
            embeddingHash: hashText(text)
        }
    };
}

function buildDomainRoutingRecords(entries: SkillManifestEntry[]): JsonRecord[] {
    const grouped = new Map<string, SkillManifestEntry[]>();
    for (const entry of entries) {
        const domain = normalizeSpace(entry.domain) || 'Unknown domain';
        const existing = grouped.get(domain) || [];
        existing.push(entry);
        grouped.set(domain, existing);
    }

    return [...grouped.entries()]
        .sort((left, right) => left[0].localeCompare(right[0]))
        .map(([domain, domainEntries]) => {
            const methods = counterTop(domainEntries.map((entry) => entry.coreMethod), 4);
            const artifacts = counterTop(domainEntries.map((entry) => entry.primaryArtifact), 4);
            const examples = domainEntries
                .slice()
                .sort((left, right) => left.id - right.id)
                .slice(0, 5)
                .map((entry) => clip(entry.title || entry.name || `Skill ${entry.id}`, 50));
            const text = clip([
                `${domain}. ${domainEntries.length} skills.`,
                methods.length > 0 ? `Common methods: ${methods.join(', ')}.` : '',
                artifacts.length > 0 ? `Common artifacts: ${artifacts.join(', ')}.` : '',
                examples.length > 0 ? `Representative skills: ${examples.join('; ')}.` : ''
            ].filter(Boolean).join(' '), 420);

            return {
                id: `domain:${slugify(domain) || 'unknown'}`,
                namespace: 'skills.domain',
                title: domain,
                text,
                metadata: {
                    domain,
                    skillCount: domainEntries.length,
                    commonMethods: methods,
                    commonArtifacts: artifacts,
                    sampleSkillIds: domainEntries
                        .slice()
                        .sort((left, right) => left.id - right.id)
                        .slice(0, 10)
                        .map((entry) => entry.id),
                    embeddingHash: hashText(text)
                }
            };
        });
}

function listMarkdownFiles(root: string, output: { filePath: string; mtimeMs: number }[] = []) {
    if (!fs.existsSync(root)) return output;
    for (const item of fs.readdirSync(root)) {
        if (item === '.git' || item === 'node_modules') continue;
        const fullPath = path.join(root, item);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            listMarkdownFiles(fullPath, output);
            continue;
        }
        if (stats.isFile() && item.toLowerCase().endsWith('.md')) {
            output.push({
                filePath: fullPath,
                mtimeMs: Number(stats.mtimeMs)
            });
        }
    }
    return output;
}

function extractHeadings(markdown: string): string[] {
    const headings: string[] = [];
    for (const line of markdown.split('\n')) {
        const match = line.match(/^\s{0,3}#{1,6}\s+(.+?)\s*$/);
        if (!match) continue;
        const heading = normalizeSpace(match[1]);
        if (heading) headings.push(heading);
    }
    return headings;
}

function extractTitle(markdown: string, fallback: string): string {
    const firstHeading = markdown.match(/^\s{0,3}#\s+(.+?)\s*$/m);
    if (firstHeading && normalizeSpace(firstHeading[1])) {
        return normalizeSpace(firstHeading[1]);
    }
    return fallback;
}

function extractSnippet(markdown: string): string {
    const lines = markdown
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !line.startsWith('#'))
        .filter((line) => !line.startsWith('```'))
        .filter((line) => !/^[-*]\s*$/.test(line));
    return clip(lines.slice(0, 5).join(' '), 220);
}

function buildMemoryRoutingRecords({
    memoryRoot,
    maxEntries,
    memoryDays
}: {
    memoryRoot: string;
    maxEntries: number;
    memoryDays: number;
}): JsonRecord[] {
    const cutoffMs = Date.now() - (memoryDays * 24 * 60 * 60 * 1000);
    const dedupe = new Set<string>();
    const files = listMarkdownFiles(memoryRoot)
        .filter((entry) => entry.mtimeMs >= cutoffMs)
        .sort((left, right) => right.mtimeMs - left.mtimeMs)
        .slice(0, maxEntries);

    const records: JsonRecord[] = [];
    for (const file of files) {
        const content = fs.readFileSync(file.filePath, 'utf8');
        const title = extractTitle(content, path.basename(file.filePath, path.extname(file.filePath)));
        const headings = extractHeadings(content).slice(0, 6);
        const snippet = extractSnippet(content);
        const relativePath = path.relative(memoryRoot, file.filePath);
        const text = clip([
            `${title}.`,
            headings.length > 0 ? `Sections: ${headings.join(', ')}.` : '',
            snippet ? `Notes: ${snippet}` : ''
        ].filter(Boolean).join(' '), 420);
        const hash = hashText(text);
        if (dedupe.has(hash)) continue;
        dedupe.add(hash);
        records.push({
            id: `memory:${relativePath.replace(/\\/g, '/')}`,
            namespace: 'memory.route',
            title,
            text,
            pointer: {
                path: file.filePath
            },
            metadata: {
                relativePath,
                modifiedAt: new Date(file.mtimeMs).toISOString(),
                headings,
                embeddingHash: hash
            }
        });
    }
    return records;
}

function sumTextChars(records: JsonRecord[]): number {
    return records.reduce((total, record) => total + normalizeSpace(record.text).length, 0);
}

function buildBudgetSummary({
    manifestPath,
    skillRecords,
    domainRecords,
    memoryRecords,
    rawSkillMarkdownBytes,
    memoryRoot
}: {
    manifestPath: string | null;
    skillRecords: JsonRecord[];
    domainRecords: JsonRecord[];
    memoryRecords: JsonRecord[];
    rawSkillMarkdownBytes: number;
    memoryRoot: string | null;
}) {
    const skillChars = sumTextChars(skillRecords);
    const domainChars = sumTextChars(domainRecords);
    const memoryChars = sumTextChars(memoryRecords);
    const totalCompactChars = skillChars + domainChars + memoryChars;
    const totalCompactTokens = estimateTokensFromChars(totalCompactChars);
    const rawSkillMarkdownTokens = estimateTokensFromChars(rawSkillMarkdownBytes);

    return {
        generatedAt: new Date().toISOString(),
        manifestPath,
        memoryRoot,
        counts: {
            skillRecords: skillRecords.length,
            domainRecords: domainRecords.length,
            memoryRecords: memoryRecords.length
        },
        bytes: {
            rawSkillMarkdownBytes,
            compactSkillChars: skillChars,
            compactDomainChars: domainChars,
            compactMemoryChars: memoryChars,
            totalCompactChars
        },
        estimatedTokens: {
            rawSkillMarkdown: rawSkillMarkdownTokens,
            compactSkills: estimateTokensFromChars(skillChars),
            compactDomains: estimateTokensFromChars(domainChars),
            compactMemory: estimateTokensFromChars(memoryChars),
            totalCompact: totalCompactTokens
        },
        reduction: {
            rawSkillsToCompactSkillsRatio: skillChars > 0
                ? Number((rawSkillMarkdownBytes / skillChars).toFixed(2))
                : null,
            rawSkillsToCompactTotalRatio: totalCompactChars > 0
                ? Number((rawSkillMarkdownBytes / totalCompactChars).toFixed(2))
                : null
        },
        namespaces: [
            {
                namespace: 'skills.domain',
                purpose: 'First-hop routing by domain before any skill hydration.'
            },
            {
                namespace: 'skills.route',
                purpose: 'Compact skill lookup cards. Hydrate full SKILL.md or implementation.json only after retrieval.'
            },
            {
                namespace: 'memory.route',
                purpose: 'Recent memory summaries. Keep raw memory markdown outside the embedding index.'
            }
        ],
        recommendations: [
            'Embed routing cards, not full generated skill documents.',
            'Use metadata filters before vector search whenever domain, recency, or skill id is known.',
            'Hydrate source files lazily after selecting a short candidate list.'
        ]
    };
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        printHelp();
        return;
    }

    const repoRoot = path.resolve(options.repoRoot);
    const manifestPath = options.skipSkills ? null : resolveManifestPath(repoRoot, options.manifestPath);

    let skillRecords: JsonRecord[] = [];
    let domainRecords: JsonRecord[] = [];
    let rawSkillMarkdownBytes = 0;

    if (!options.skipSkills && manifestPath) {
        const entries = loadJson<SkillManifestEntry[]>(manifestPath)
            .filter((entry) => Number.isInteger(entry.id) && entry.id > 0)
            .sort((left, right) => left.id - right.id);

        skillRecords = entries.map((entry) => buildSkillRoutingRecord(entry));
        domainRecords = buildDomainRoutingRecords(entries);
        rawSkillMarkdownBytes = entries.reduce((total, entry) => {
            if (!entry.path) return total;
            return total + countBytes(path.join(repoRoot, entry.path));
        }, 0);

        writeJsonl(options.skillsOutPath, skillRecords);
        writeJsonl(options.domainsOutPath, domainRecords);
    }

    let memoryRecords: JsonRecord[] = [];
    const memoryRoot = options.skipMemory || !options.memoryRoot
        ? null
        : path.resolve(options.memoryRoot);

    if (memoryRoot && fs.existsSync(memoryRoot)) {
        memoryRecords = buildMemoryRoutingRecords({
            memoryRoot,
            maxEntries: options.maxMemoryEntries,
            memoryDays: options.memoryDays
        });
        writeJsonl(options.memoryOutPath, memoryRecords);
    }

    const budget = buildBudgetSummary({
        manifestPath,
        skillRecords,
        domainRecords,
        memoryRecords,
        rawSkillMarkdownBytes,
        memoryRoot
    });

    ensureDirForFile(options.budgetOutPath);
    fs.writeFileSync(options.budgetOutPath, `${JSON.stringify(budget, null, 2)}\n`);

    console.log(`Skill routing records: ${skillRecords.length}`);
    console.log(`Domain routing records: ${domainRecords.length}`);
    console.log(`Memory routing records: ${memoryRecords.length}`);
    console.log(`Raw skill markdown bytes: ${rawSkillMarkdownBytes}`);
    console.log(`Compact routing chars: ${budget.bytes.totalCompactChars}`);
    console.log(`Budget summary: ${options.budgetOutPath}`);
}

try {
    main();
} catch (error) {
    console.error(`Embedding routing corpus build failed: ${(error as Error).message}`);
    process.exit(1);
}
