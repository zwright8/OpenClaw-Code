import fs from 'fs';
import path from 'path';
import {
    createDefaultSkillHardeningProfile,
    hasExternalSkillRegistry,
    loadExternalSkillImplementationIndex,
    loadSkillImplementationFromEntry,
    loadSkillManifest,
    normalizeSkillHardeningProfile
} from '../skills/runtime/index.js';

type CliOptions = {
    repoRoot: string;
    includeManifest: boolean;
    includeExternal: boolean;
    basePolicy: 'off' | 'report' | 'enforce';
    baseMinScore: number;
    baseStrict: boolean;
    outPath: string;
    help: boolean;
};

const HIGH_RISK_DOMAIN_KEYWORDS = [
    'health',
    'medical',
    'clinical',
    'security',
    'privacy',
    'safety',
    'rights',
    'compliance',
    'governance',
    'crisis',
    'disaster',
    'infra',
    'finance',
    'legal'
];

const PUBLIC_IMPACT_DOMAIN_KEYWORDS = [
    'publicservice',
    'public service',
    'education',
    'community',
    'inclusion',
    'equity',
    'economic',
    'logistics',
    'impact'
];

function printHelp() {
    console.log(`Build domain-aware skill hardening profile

Usage:
  tsx scripts/build-skill-hardening-profile.ts [options]

Options:
  --repo-root <path>          Repo root containing skills directories (default: .)
  --manifest-only             Use only skills/generated catalog
  --external-only             Use only skills/generated-10000 catalog
  --base-policy <mode>        Default policy: off|report|enforce (default: enforce)
  --base-min-score <n>        Default min deployable score (default: 82)
  --no-base-strict            Default profile strict mode off
  --out <path>                Output profile path (default: skills/state/skills.hardening.profile.json)
  -h, --help                  Show help
`);
}

function parsePolicy(raw: string) {
    const value = String(raw || '').trim().toLowerCase();
    if (value !== 'off' && value !== 'report' && value !== 'enforce') {
        throw new Error('--base-policy must be one of: off, report, enforce');
    }
    return value as 'off' | 'report' | 'enforce';
}

function parseIntInRange(raw: string, flag: string, min = 1, max = 100) {
    const value = Number(raw);
    if (!Number.isFinite(value) || !Number.isInteger(value) || value < min || value > max) {
        throw new Error(`${flag} must be an integer between ${min} and ${max}`);
    }
    return value;
}

function parseArgs(argv: string[]): CliOptions {
    const repoRoot = path.resolve(process.cwd());
    const options: CliOptions = {
        repoRoot,
        includeManifest: true,
        includeExternal: true,
        basePolicy: 'enforce',
        baseMinScore: 82,
        baseStrict: true,
        outPath: path.join(repoRoot, 'skills', 'state', 'skills.hardening.profile.json'),
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '-h' || token === '--help') {
            options.help = true;
            continue;
        }
        if (token === '--manifest-only') {
            options.includeManifest = true;
            options.includeExternal = false;
            continue;
        }
        if (token === '--external-only') {
            options.includeManifest = false;
            options.includeExternal = true;
            continue;
        }
        if (token === '--no-base-strict') {
            options.baseStrict = false;
            continue;
        }

        const value = argv[i + 1];
        if (value === undefined) {
            throw new Error(`Missing value for ${token}`);
        }

        if (token === '--repo-root') {
            options.repoRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }
        if (token === '--base-policy') {
            options.basePolicy = parsePolicy(value);
            i++;
            continue;
        }
        if (token === '--base-min-score') {
            options.baseMinScore = parseIntInRange(value, '--base-min-score');
            i++;
            continue;
        }
        if (token === '--out') {
            options.outPath = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    if (!options.includeManifest && !options.includeExternal) {
        throw new Error('At least one catalog must be selected');
    }
    if (!argv.includes('--out')) {
        options.outPath = path.join(options.repoRoot, 'skills', 'state', 'skills.hardening.profile.json');
    }

    return options;
}

function slugify(value: string): string {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-+/g, '-');
}

function includesAnyKeyword(text: string, keywords: string[]): boolean {
    const normalized = String(text || '').trim().toLowerCase();
    if (!normalized) return false;
    return keywords.some((keyword) => normalized.includes(keyword));
}

function collectDomainCounts(options: CliOptions) {
    const domainCounts = new Map<string, number>();

    if (options.includeManifest) {
        const manifest = loadSkillManifest(options.repoRoot);
        for (const entry of manifest) {
            const implementation = loadSkillImplementationFromEntry(entry, options.repoRoot);
            const domain = String(implementation.domain || '').trim();
            if (!domain) continue;
            domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
        }
    }

    if (options.includeExternal) {
        if (!hasExternalSkillRegistry(options.repoRoot)) {
            throw new Error('External skill registry not found at skills/generated-10000/implementations.json');
        }
        const external = loadExternalSkillImplementationIndex(options.repoRoot);
        for (const implementation of external.values()) {
            const domain = String(implementation.domain || '').trim();
            if (!domain) continue;
            domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
        }
    }

    return domainCounts;
}

function buildDomainRules(
    domainCounts: Map<string, number>,
    baseMinScore: number
) {
    const rules: Array<{
        id: string;
        description: string;
        domains: string[];
        minDeployableScore: number;
        strict: boolean;
        policy: 'enforce';
    }> = [];

    for (const [domain, count] of domainCounts.entries()) {
        if (count < 5) continue;
        if (includesAnyKeyword(domain, HIGH_RISK_DOMAIN_KEYWORDS)) {
            rules.push({
                id: `domain-critical-${slugify(domain)}`.slice(0, 80),
                description: `Critical-domain hardening override for ${domain}.`,
                domains: [domain.toLowerCase()],
                minDeployableScore: Math.max(baseMinScore + 8, 90),
                strict: true,
                policy: 'enforce'
            });
            continue;
        }
        if (includesAnyKeyword(domain, PUBLIC_IMPACT_DOMAIN_KEYWORDS)) {
            rules.push({
                id: `domain-impact-${slugify(domain)}`.slice(0, 80),
                description: `Public-impact hardening override for ${domain}.`,
                domains: [domain.toLowerCase()],
                minDeployableScore: Math.max(baseMinScore + 4, 86),
                strict: true,
                policy: 'enforce'
            });
        }
    }

    return rules
        .sort((a, b) => a.id.localeCompare(b.id))
        .slice(0, 250);
}

function main() {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
        printHelp();
        return;
    }

    const domainCounts = collectDomainCounts(options);
    const defaultProfile = createDefaultSkillHardeningProfile({
        policy: options.basePolicy,
        minDeployableScore: options.baseMinScore,
        strict: options.baseStrict
    });
    const domainRules = buildDomainRules(domainCounts, options.baseMinScore);

    const mergedProfile = normalizeSkillHardeningProfile({
        ...defaultProfile,
        generatedAt: new Date().toISOString(),
        rules: [...domainRules, ...defaultProfile.rules]
    }, {
        policy: options.basePolicy,
        minDeployableScore: options.baseMinScore,
        strict: options.baseStrict
    });

    fs.mkdirSync(path.dirname(options.outPath), { recursive: true });
    fs.writeFileSync(options.outPath, `${JSON.stringify(mergedProfile, null, 2)}\n`);

    console.log(`Hardening profile written: ${options.outPath}`);
    console.log(`Domains analyzed: ${domainCounts.size}`);
    console.log(`Rules generated: ${mergedProfile.rules.length}`);
}

main();
