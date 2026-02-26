import fs from 'fs';
import path from 'path';
import type {
    SkillImplementation,
    SkillImprovementCatalog,
    SkillImprovementProfile
} from './types.js';

const GENERATED_ROOT = path.join('skills', 'generated-10000');
const IMPLEMENTATIONS_FILE = 'implementations.json';
const IMPROVEMENTS_FILE = 'improvements.catalog.json';

type ExternalImplementationBundle = {
    version: number;
    sourceFile: string;
    generatedAt: string;
    count: number;
    entries: SkillImplementation[];
};

const cache = new Map<string, Map<number, SkillImplementation>>();
const improvementCache = new Map<string, Map<number, SkillImprovementProfile>>();

function resolveImplementationsPath(repoRoot = process.cwd()): string {
    return path.join(path.resolve(repoRoot), GENERATED_ROOT, IMPLEMENTATIONS_FILE);
}

function resolveImprovementsPath(repoRoot = process.cwd()): string {
    return path.join(path.resolve(repoRoot), GENERATED_ROOT, IMPROVEMENTS_FILE);
}

function loadBundle(filePath: string): ExternalImplementationBundle {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ExternalImplementationBundle;
    if (!raw || typeof raw !== 'object' || !Array.isArray(raw.entries)) {
        throw new Error(`Invalid external implementation bundle: ${filePath}`);
    }
    return raw;
}

function buildIndex(entries: SkillImplementation[]): Map<number, SkillImplementation> {
    const index = new Map<number, SkillImplementation>();
    for (const entry of entries) {
        const skillId = Number(entry?.skillId);
        if (!Number.isInteger(skillId) || skillId <= 0) continue;
        if (index.has(skillId)) continue;
        index.set(skillId, entry);
    }
    return index;
}

function buildImprovementIndex(entries: SkillImprovementCatalog['entries']): Map<number, SkillImprovementProfile> {
    const index = new Map<number, SkillImprovementProfile>();
    for (const entry of entries || []) {
        const skillId = Number(entry?.skillId);
        if (!Number.isInteger(skillId) || skillId <= 0) continue;
        if (!entry?.improvementProfile || typeof entry.improvementProfile !== 'object') continue;
        if (index.has(skillId)) continue;
        index.set(skillId, entry.improvementProfile);
    }
    return index;
}

function loadImprovementIndex(repoRoot = process.cwd()): Map<number, SkillImprovementProfile> {
    const filePath = resolveImprovementsPath(repoRoot);
    if (improvementCache.has(filePath)) {
        return improvementCache.get(filePath)!;
    }
    if (!fs.existsSync(filePath)) {
        const empty = new Map<number, SkillImprovementProfile>();
        improvementCache.set(filePath, empty);
        return empty;
    }

    try {
        const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as SkillImprovementCatalog;
        if (!raw || typeof raw !== 'object' || !Array.isArray(raw.entries)) {
            const empty = new Map<number, SkillImprovementProfile>();
            improvementCache.set(filePath, empty);
            return empty;
        }
        const index = buildImprovementIndex(raw.entries);
        improvementCache.set(filePath, index);
        return index;
    } catch {
        const empty = new Map<number, SkillImprovementProfile>();
        improvementCache.set(filePath, empty);
        return empty;
    }
}

function mergeImplementationWithImprovement(
    implementation: SkillImplementation,
    improvement: SkillImprovementProfile | undefined
): SkillImplementation {
    if (!improvement) return implementation;
    return {
        ...implementation,
        improvementProfile: improvement
    };
}

export function hasExternalSkillRegistry(repoRoot = process.cwd()): boolean {
    return fs.existsSync(resolveImplementationsPath(repoRoot));
}

export function hasExternalSkillImprovementCatalog(repoRoot = process.cwd()): boolean {
    return fs.existsSync(resolveImprovementsPath(repoRoot));
}

export function loadExternalSkillImplementationIndex(repoRoot = process.cwd()): Map<number, SkillImplementation> {
    const filePath = resolveImplementationsPath(repoRoot);
    if (cache.has(filePath)) {
        return cache.get(filePath)!;
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`External skill implementation registry not found: ${filePath}`);
    }

    const bundle = loadBundle(filePath);
    const improvementIndex = loadImprovementIndex(repoRoot);
    const mergedEntries = bundle.entries.map((implementation) => mergeImplementationWithImprovement(
        implementation,
        improvementIndex.get(implementation.skillId)
    ));
    const index = buildIndex(mergedEntries);
    cache.set(filePath, index);
    return index;
}

export function loadExternalSkillImplementationById(
    skillId: number,
    repoRoot = process.cwd()
): SkillImplementation {
    const normalized = Number(skillId);
    if (!Number.isInteger(normalized) || normalized <= 0) {
        throw new Error(`Invalid skill id: ${skillId}`);
    }

    const index = loadExternalSkillImplementationIndex(repoRoot);
    const implementation = index.get(normalized);
    if (!implementation) {
        throw new Error(`External skill ${normalized} not found in generated-10000 registry`);
    }
    return implementation;
}
