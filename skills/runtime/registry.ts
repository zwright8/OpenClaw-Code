import path from 'path';
import fs from 'fs';
import type {
    SkillImplementation,
    SkillManifestEntry,
    SkillRegistryFilters,
    SkillRuntimeCatalog
} from './types.js';

const GENERATED_ROOT = path.join('skills', 'generated');
const MANIFEST_FILES = ['skills.manifest.10000.json', 'skills.manifest.json'] as const;
const RUNTIME_CATALOG_FILES = ['runtime.catalog.10000.json', 'runtime.catalog.json'] as const;

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function normalizeFilters(filters: SkillRegistryFilters = {}) {
    return {
        ids: new Set((filters.ids || []).map((value) => Number(value))),
        names: new Set((filters.names || []).map((value) => value.toLowerCase())),
        domains: new Set((filters.domains || []).map((value) => value.toLowerCase())),
        archetypes: new Set((filters.archetypes || []).map((value) => value.toLowerCase()))
    };
}

function hasFilters(filters: ReturnType<typeof normalizeFilters>) {
    return (
        filters.ids.size > 0
        || filters.names.size > 0
        || filters.domains.size > 0
        || filters.archetypes.size > 0
    );
}

function filterManifestEntries(
    entries: SkillManifestEntry[],
    filters: SkillRegistryFilters = {}
): SkillManifestEntry[] {
    const normalized = normalizeFilters(filters);
    if (!hasFilters(normalized)) {
        return entries;
    }

    return entries.filter((entry) => {
        if (normalized.ids.size > 0 && !normalized.ids.has(entry.id)) return false;
        if (normalized.names.size > 0 && !normalized.names.has(entry.name.toLowerCase())) return false;
        if (normalized.domains.size > 0 && !normalized.domains.has(entry.domain.toLowerCase())) return false;
        if (normalized.archetypes.size > 0 && !normalized.archetypes.has(entry.runtimeArchetype.toLowerCase())) return false;
        return true;
    });
}

export function resolveGeneratedRoot(repoRoot = process.cwd()): string {
    return path.join(repoRoot, GENERATED_ROOT);
}

function resolveGeneratedFile(
    repoRoot: string,
    candidates: readonly string[]
): string {
    const generatedRoot = resolveGeneratedRoot(repoRoot);
    for (const candidate of candidates) {
        const filePath = path.join(generatedRoot, candidate);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
    }
    return path.join(generatedRoot, candidates[candidates.length - 1]);
}

export function loadSkillManifest(repoRoot = process.cwd()): SkillManifestEntry[] {
    const manifestPath = resolveGeneratedFile(repoRoot, MANIFEST_FILES);
    const entries = loadJson<SkillManifestEntry[]>(manifestPath);
    return entries.slice().sort((a, b) => a.id - b.id);
}

export function loadRuntimeCatalog(repoRoot = process.cwd()): SkillRuntimeCatalog {
    const runtimeCatalogPath = resolveGeneratedFile(repoRoot, RUNTIME_CATALOG_FILES);
    return loadJson<SkillRuntimeCatalog>(runtimeCatalogPath);
}

export function loadSkillImplementationFromEntry(
    entry: SkillManifestEntry,
    repoRoot = process.cwd()
): SkillImplementation {
    return loadJson<SkillImplementation>(path.join(repoRoot, entry.implementationPath));
}

export function loadSkillImplementationById(
    skillId: number,
    repoRoot = process.cwd()
): SkillImplementation {
    const manifest = loadSkillManifest(repoRoot);
    const entry = manifest.find((candidate) => candidate.id === skillId);
    if (!entry) {
        throw new Error(`Skill ${skillId} not found in manifest`);
    }
    return loadSkillImplementationFromEntry(entry, repoRoot);
}

export function loadAllSkillImplementations(
    repoRoot = process.cwd(),
    filters: SkillRegistryFilters = {}
): SkillImplementation[] {
    const manifest = loadSkillManifest(repoRoot);
    const scopedEntries = filterManifestEntries(manifest, filters);
    return scopedEntries.map((entry) => loadSkillImplementationFromEntry(entry, repoRoot));
}

export function summarizeSkillManifest(entries: SkillManifestEntry[]) {
    const domainCounts = new Map<string, number>();
    const archetypeCounts = new Map<string, number>();

    for (const entry of entries) {
        domainCounts.set(entry.domain, (domainCounts.get(entry.domain) || 0) + 1);
        archetypeCounts.set(entry.runtimeArchetype, (archetypeCounts.get(entry.runtimeArchetype) || 0) + 1);
    }

    const topDomains = Array.from(domainCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([domain, count]) => ({ domain, count }));
    const topArchetypes = Array.from(archetypeCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([archetype, count]) => ({ archetype, count }));

    return {
        totalSkills: entries.length,
        topDomains,
        topArchetypes
    };
}
