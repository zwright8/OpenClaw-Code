import fs from 'node:fs';
import path from 'node:path';

type TaskStatus = 'success' | 'failed' | 'approval_pending' | 'skipped';

type RuntimeTaskResult = {
    taskId: string;
    status: TaskStatus;
    reason: string;
    latencyMs: number;
    skillId?: number;
};

type RuntimeArtifact = {
    generatedAt?: string;
    taskResults?: RuntimeTaskResult[];
};

type SkillCatalogEntry = {
    id: number;
    name: string;
    domain: string;
    archetype: string;
};

type SkillCatalog = {
    generatedAt: string;
    entries: SkillCatalogEntry[];
};

type SkillAccumulator = {
    totalRuns: number;
    terminalRuns: number;
    successCount: number;
    failedCount: number;
    approvalPendingCount: number;
    skippedCount: number;
    latencies: number[];
    failureClasses: Map<string, number>;
};

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const OUTPUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'skill-performance.json');

const FAILURE_CLASSIFIERS: Array<{ key: string; test: (reason: string) => boolean; }> = [
    { key: 'runtime_checks_failed', test: (reason) => reason.includes('runtime checks') },
    { key: 'oversight_escalation_failed', test: (reason) => reason.includes('oversight escalation') },
    { key: 'promotion_validation_failed', test: (reason) => reason.includes('validation failed acceptance thresholds') },
    { key: 'approval_wait', test: (reason) => reason.includes('approval') || reason.includes('reviewer assignment') },
    { key: 'throttled', test: (reason) => reason.includes('throttling') },
    { key: 'unknown', test: () => true }
];

function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function median(sorted: number[]): number {
    if (sorted.length === 0) return 0;
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
    }
    return sorted[mid];
}

function percentile(sorted: number[], q: number): number {
    if (sorted.length === 0) return 0;
    if (sorted.length === 1) return sorted[0];
    const index = (sorted.length - 1) * q;
    const lo = Math.floor(index);
    const hi = Math.ceil(index);
    if (lo === hi) return sorted[lo];
    const value = sorted[lo] + (sorted[hi] - sorted[lo]) * (index - lo);
    return Number(value.toFixed(2));
}

function classifyFailure(reason: string): string {
    const normalized = reason.trim().toLowerCase();
    for (const classifier of FAILURE_CLASSIFIERS) {
        if (classifier.test(normalized)) {
            return classifier.key;
        }
    }
    return 'unknown';
}

function deriveSkillId(task: RuntimeTaskResult): number | null {
    if (typeof task.skillId === 'number') return task.skillId;
    const match = task.taskId.match(/(\d{1,4})$/);
    if (!match) return null;
    return Number(match[1]);
}

function listRuntimeArtifactPaths(): string[] {
    const files = fs.readdirSync(GENERATED_ROOT)
        .filter((name) => name.startsWith('runtime.') && name.endsWith('.json'))
        .sort();

    return files
        .map((name) => path.join(GENERATED_ROOT, name))
        .filter((filePath) => {
            const artifact = readJson<RuntimeArtifact>(filePath);
            return Array.isArray(artifact.taskResults);
        });
}

function main() {
    const catalog = readJson<SkillCatalog>(path.join(GENERATED_ROOT, 'runtime.catalog.json'));
    const catalogById = new Map<number, SkillCatalogEntry>(catalog.entries.map((entry) => [entry.id, entry]));
    const artifactPaths = listRuntimeArtifactPaths();

    const skillMetrics = new Map<number, SkillAccumulator>();
    const sourceArtifacts: Array<{ file: string; generatedAt: string | null; }> = [];

    for (const artifactPath of artifactPaths) {
        const artifact = readJson<RuntimeArtifact>(artifactPath);
        const taskResults = artifact.taskResults ?? [];
        sourceArtifacts.push({
            file: path.basename(artifactPath),
            generatedAt: artifact.generatedAt ?? null
        });

        for (const task of taskResults) {
            const skillId = deriveSkillId(task);
            if (skillId === null || !catalogById.has(skillId)) continue;

            const acc = skillMetrics.get(skillId) ?? {
                totalRuns: 0,
                terminalRuns: 0,
                successCount: 0,
                failedCount: 0,
                approvalPendingCount: 0,
                skippedCount: 0,
                latencies: [],
                failureClasses: new Map<string, number>()
            };

            acc.totalRuns += 1;
            acc.latencies.push(task.latencyMs);

            if (task.status === 'success') {
                acc.successCount += 1;
                acc.terminalRuns += 1;
            } else if (task.status === 'failed') {
                acc.failedCount += 1;
                acc.terminalRuns += 1;
                const failureClass = classifyFailure(task.reason);
                acc.failureClasses.set(failureClass, (acc.failureClasses.get(failureClass) ?? 0) + 1);
            } else if (task.status === 'approval_pending') {
                acc.approvalPendingCount += 1;
            } else if (task.status === 'skipped') {
                acc.skippedCount += 1;
            }

            skillMetrics.set(skillId, acc);
        }
    }

    const skills = Array.from(skillMetrics.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([skillId, acc]) => {
            const catalogEntry = catalogById.get(skillId)!;
            const sortedLatencies = [...acc.latencies].sort((a, b) => a - b);
            const avgLatencyMs =
                sortedLatencies.length === 0
                    ? 0
                    : Number((sortedLatencies.reduce((sum, value) => sum + value, 0) / sortedLatencies.length).toFixed(2));

            return {
                skillId,
                skillName: catalogEntry.name,
                domain: catalogEntry.domain,
                archetype: catalogEntry.archetype,
                runs: {
                    total: acc.totalRuns,
                    terminal: acc.terminalRuns,
                    success: acc.successCount,
                    failed: acc.failedCount,
                    approvalPending: acc.approvalPendingCount,
                    skipped: acc.skippedCount
                },
                successRate: acc.terminalRuns === 0 ? 0 : Number((acc.successCount / acc.terminalRuns).toFixed(4)),
                latencyMs: {
                    avg: avgLatencyMs,
                    min: sortedLatencies[0] ?? 0,
                    p50: median(sortedLatencies),
                    p95: percentile(sortedLatencies, 0.95),
                    max: sortedLatencies[sortedLatencies.length - 1] ?? 0
                },
                failureClasses: Object.fromEntries(
                    Array.from(acc.failureClasses.entries()).sort((a, b) => a[0].localeCompare(b[0]))
                )
            };
        });

    const output = {
        version: 1,
        sourceCatalogGeneratedAt: catalog.generatedAt,
        sourceArtifacts,
        skillCount: skills.length,
        skills
    };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

    console.log(`[score-skill-runs] wrote ${OUTPUT_PATH} (skills=${skills.length}, artifacts=${artifactPaths.length})`);
}

main();
