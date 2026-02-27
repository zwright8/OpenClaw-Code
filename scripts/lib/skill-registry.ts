import fs from 'fs';
import path from 'path';

export type RegistryRiskTier = 'low' | 'medium' | 'high' | 'critical';

export type SkillRegistryEntry = {
  skillId: number;
  skillName: string;
  title: string;
  domain: string;
  shard: string;
  shardPath: string;
  routingTags: string[];
  tags: string[];
  riskTier: RegistryRiskTier;
  qualityScore: {
    score: number | null;
    confidence: number | null;
    lastEvaluatedAt: string | null;
  };
  metadata: {
    archetype: string | null;
    coreMethod: string | null;
    requiredSignals: string[];
    approvalGates: string[];
    featureFlag: string | null;
  };
};

export type SkillRegistry = {
  version: 1;
  source: {
    root: string;
    shardsDir: string;
    totalShards: number;
  };
  stats: {
    totalSkills: number;
    riskTierCounts: Record<RegistryRiskTier, number>;
  };
  entries: SkillRegistryEntry[];
};

export const REPO_ROOT = process.cwd();
export const SHARDS_DIR = path.join(REPO_ROOT, 'skills', 'generated', 'shards');
export const REGISTRY_PATH = path.join(REPO_ROOT, 'skills', 'state', 'skill-registry.json');

export function normalizeText(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function sanitizeTag(value: unknown): string {
  return normalizeText(value)
    .replace(/[^a-z0-9:/._-]+/g, '-')
    .replace(/(^-+|-+$)/g, '');
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

function listDirectories(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b));
}

function parseSkillId(fallbackDirName: string, implementation: Record<string, unknown>): number {
  const raw = implementation.skillId ?? fallbackDirName.split('-')[0] ?? '0';
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
}

function inferRiskTier(implementation: Record<string, unknown>): RegistryRiskTier {
  const runtimeProfile = (implementation.runtimeProfile ?? {}) as Record<string, unknown>;
  const postureThresholds = (runtimeProfile.postureThresholds ?? {}) as Record<string, unknown>;
  const criticalRisk = Number(postureThresholds.criticalRisk ?? 0);
  const reviewRisk = Number(postureThresholds.reviewRisk ?? 0);

  if (criticalRisk >= 85) return 'critical';
  if (criticalRisk >= 75 || reviewRisk >= 65) return 'high';
  if (criticalRisk >= 60 || reviewRisk >= 50) return 'medium';
  return 'low';
}

function buildTags(implementation: Record<string, unknown>): string[] {
  const runtimeProfile = (implementation.runtimeProfile ?? {}) as Record<string, unknown>;
  const orchestration = (runtimeProfile.orchestration ?? {}) as Record<string, unknown>;
  const requiredSignals = Array.isArray(runtimeProfile.requiredSignals) ? runtimeProfile.requiredSignals : [];

  const rawTags = [
    implementation.domainSlug,
    implementation.domain,
    runtimeProfile.archetype,
    runtimeProfile.coreMethod,
    ...(Array.isArray(orchestration.components) ? orchestration.components : []),
    ...requiredSignals,
  ]
    .map(sanitizeTag)
    .filter(Boolean);

  return uniqueSorted(rawTags);
}

function buildRoutingTags(implementation: Record<string, unknown>): string[] {
  const runtimeProfile = (implementation.runtimeProfile ?? {}) as Record<string, unknown>;
  const orchestration = (runtimeProfile.orchestration ?? {}) as Record<string, unknown>;

  const directRoutingTag = sanitizeTag(orchestration.routingTag);
  const fallbackRoutingTag = sanitizeTag(`${implementation.domainSlug ?? implementation.domain}:${runtimeProfile.archetype ?? 'general'}`);

  return uniqueSorted([directRoutingTag, fallbackRoutingTag]);
}

function readImplementation(skillDirPath: string): Record<string, unknown> {
  const implementationPath = path.join(skillDirPath, 'implementation.json');
  if (!fs.existsSync(implementationPath)) return {};
  return JSON.parse(fs.readFileSync(implementationPath, 'utf8')) as Record<string, unknown>;
}

export function buildSkillRegistryFromShards(): SkillRegistry {
  const shardDirs = listDirectories(SHARDS_DIR);
  const entries: SkillRegistryEntry[] = [];

  for (const shard of shardDirs) {
    const shardPath = path.join(SHARDS_DIR, shard);
    const skillDirs = listDirectories(shardPath);

    for (const skillDirName of skillDirs) {
      const skillDirPath = path.join(shardPath, skillDirName);
      const implementation = readImplementation(skillDirPath);

      const skillId = parseSkillId(skillDirName, implementation);
      if (skillId <= 0) continue;

      const runtimeProfile = (implementation.runtimeProfile ?? {}) as Record<string, unknown>;
      const orchestration = (runtimeProfile.orchestration ?? {}) as Record<string, unknown>;

      const skillName = String(implementation.skillName ?? skillDirName);
      const title = String(implementation.title ?? skillName);
      const domain = String(implementation.domain ?? implementation.domainSlug ?? 'unknown');

      const requiredSignals = Array.isArray(runtimeProfile.requiredSignals)
        ? runtimeProfile.requiredSignals.map((value) => String(value)).sort((a, b) => a.localeCompare(b))
        : [];
      const approvalGates = Array.isArray(orchestration.approvalGates)
        ? orchestration.approvalGates.map((value) => String(value)).sort((a, b) => a.localeCompare(b))
        : [];

      entries.push({
        skillId,
        skillName,
        title,
        domain,
        shard,
        shardPath: path.relative(REPO_ROOT, skillDirPath),
        routingTags: buildRoutingTags(implementation),
        tags: buildTags(implementation),
        riskTier: inferRiskTier(implementation),
        qualityScore: {
          score: null,
          confidence: null,
          lastEvaluatedAt: null,
        },
        metadata: {
          archetype: runtimeProfile.archetype ? String(runtimeProfile.archetype) : null,
          coreMethod: runtimeProfile.coreMethod ? String(runtimeProfile.coreMethod) : null,
          requiredSignals,
          approvalGates,
          featureFlag: runtimeProfile.rollout && typeof runtimeProfile.rollout === 'object' && (runtimeProfile.rollout as Record<string, unknown>).featureFlag
            ? String((runtimeProfile.rollout as Record<string, unknown>).featureFlag)
            : null,
        },
      });
    }
  }

  entries.sort((a, b) => (a.skillId - b.skillId) || a.skillName.localeCompare(b.skillName));

  const stats = {
    totalSkills: entries.length,
    riskTierCounts: {
      low: entries.filter((entry) => entry.riskTier === 'low').length,
      medium: entries.filter((entry) => entry.riskTier === 'medium').length,
      high: entries.filter((entry) => entry.riskTier === 'high').length,
      critical: entries.filter((entry) => entry.riskTier === 'critical').length,
    },
  } as SkillRegistry['stats'];

  return {
    version: 1,
    source: {
      root: '.',
      shardsDir: path.relative(REPO_ROOT, SHARDS_DIR),
      totalShards: shardDirs.length,
    },
    stats,
    entries,
  };
}

export function writeRegistryToDisk(registry: SkillRegistry, outputPath = REGISTRY_PATH): void {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
}

export function loadRegistry(registryPath = REGISTRY_PATH): SkillRegistry {
  return JSON.parse(fs.readFileSync(registryPath, 'utf8')) as SkillRegistry;
}
