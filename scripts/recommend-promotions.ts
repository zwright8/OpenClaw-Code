import fs from 'node:fs';
import path from 'node:path';

type SkillPerformanceEntry = {
    skillId: number;
    skillName: string;
    domain: string;
    successRate: number;
    runs: {
        total: number;
        terminal: number;
        success: number;
        failed: number;
        approvalPending: number;
        skipped: number;
    };
    latencyMs: {
        p95: number;
    };
    failureClasses: Record<string, number>;
};

type SkillPerformance = {
    version: number;
    sourceCatalogGeneratedAt: string;
    sourceArtifacts: Array<{ file: string; generatedAt: string | null; }>;
    skillCount: number;
    skills: SkillPerformanceEntry[];
};

const REPO_ROOT = process.cwd();
const INPUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'skill-performance.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'skills', 'state', 'skill-promotion-recommendations.json');

const DEFAULT_THRESHOLDS = {
    minTerminalRuns: 2,
    promoteMinSuccessRate: 0.9,
    promoteMaxP95LatencyMs: 30000,
    promoteMaxApprovalPendingRatio: 0.25,
    promoteMaxFailureRatio: 0.1,
    demoteMaxSuccessRate: 0.6,
    demoteMinFailureRatio: 0.25,
    demoteMinApprovalPendingRatio: 0.4
};

function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function main() {
    if (!fs.existsSync(INPUT_PATH)) {
        throw new Error(`Missing performance input: ${INPUT_PATH}. Run scripts/score-skill-runs.ts first.`);
    }

    const performance = readJson<SkillPerformance>(INPUT_PATH);

    const promote: Array<{ skillId: number; skillName: string; reason: string; }> = [];
    const hold: Array<{ skillId: number; skillName: string; reason: string; }> = [];
    const demote: Array<{ skillId: number; skillName: string; reason: string; }> = [];

    for (const skill of performance.skills) {
        const terminal = skill.runs.terminal;
        const approvalPendingRatio = skill.runs.total === 0 ? 0 : skill.runs.approvalPending / skill.runs.total;
        const failureRatio = terminal === 0 ? 0 : skill.runs.failed / terminal;

        if (terminal < DEFAULT_THRESHOLDS.minTerminalRuns) {
            hold.push({
                skillId: skill.skillId,
                skillName: skill.skillName,
                reason: `insufficient terminal samples (${terminal}/${DEFAULT_THRESHOLDS.minTerminalRuns})`
            });
            continue;
        }

        if (
            skill.successRate <= DEFAULT_THRESHOLDS.demoteMaxSuccessRate ||
            failureRatio >= DEFAULT_THRESHOLDS.demoteMinFailureRatio ||
            approvalPendingRatio >= DEFAULT_THRESHOLDS.demoteMinApprovalPendingRatio
        ) {
            demote.push({
                skillId: skill.skillId,
                skillName: skill.skillName,
                reason:
                    `successRate=${skill.successRate.toFixed(4)}, failureRatio=${failureRatio.toFixed(4)}, ` +
                    `approvalPendingRatio=${approvalPendingRatio.toFixed(4)}`
            });
            continue;
        }

        if (
            skill.successRate >= DEFAULT_THRESHOLDS.promoteMinSuccessRate &&
            skill.latencyMs.p95 <= DEFAULT_THRESHOLDS.promoteMaxP95LatencyMs &&
            approvalPendingRatio <= DEFAULT_THRESHOLDS.promoteMaxApprovalPendingRatio &&
            failureRatio <= DEFAULT_THRESHOLDS.promoteMaxFailureRatio
        ) {
            promote.push({
                skillId: skill.skillId,
                skillName: skill.skillName,
                reason:
                    `successRate=${skill.successRate.toFixed(4)}, p95=${skill.latencyMs.p95}ms, ` +
                    `approvalPendingRatio=${approvalPendingRatio.toFixed(4)}, failureRatio=${failureRatio.toFixed(4)}`
            });
            continue;
        }

        hold.push({
            skillId: skill.skillId,
            skillName: skill.skillName,
            reason:
                `mixed metrics: successRate=${skill.successRate.toFixed(4)}, p95=${skill.latencyMs.p95}ms, ` +
                `approvalPendingRatio=${approvalPendingRatio.toFixed(4)}, failureRatio=${failureRatio.toFixed(4)}`
        });
    }

    const sortById = <T extends { skillId: number; }>(items: T[]) => items.sort((a, b) => a.skillId - b.skillId);
    sortById(promote);
    sortById(hold);
    sortById(demote);

    const output = {
        version: 1,
        sourcePerformanceVersion: performance.version,
        sourceCatalogGeneratedAt: performance.sourceCatalogGeneratedAt,
        sourceArtifacts: performance.sourceArtifacts,
        thresholds: DEFAULT_THRESHOLDS,
        summary: {
            totalSkills: performance.skillCount,
            promoteCount: promote.length,
            holdCount: hold.length,
            demoteCount: demote.length
        },
        promote,
        hold,
        demote
    };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');

    console.log(
        `[recommend-promotions] wrote ${OUTPUT_PATH} ` +
        `(promote=${promote.length}, hold=${hold.length}, demote=${demote.length})`
    );
}

main();
