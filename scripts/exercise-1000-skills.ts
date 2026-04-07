import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';
import {
    executeSkillImplementation,
    skillExecutionToTasks,
    type SkillExecutionInput,
    type SkillImplementation,
    type SkillPosture
} from '../skills/runtime/index.js';

type ManifestEntry = {
    id: number;
    name: string;
    title: string;
    domain: string;
    path: string;
    implementationPath: string;
    reason: string;
    stepCount: number;
    runtimeArchetype: string;
    coreMethod: string;
    primaryArtifact: string;
};

const REPO_ROOT = process.cwd();
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const MANIFEST_PATH = path.join(SKILL_ROOT, 'skills.manifest.json');
const REPORT_PATH = path.join(SKILL_ROOT, 'runtime.execution-report.json');

function loadJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
}

function buildInput(id: number): SkillExecutionInput {
    return {
        missionId: `validation-${String(id).padStart(4, '0')}`,
        signalQuality: 45 + (id * 11) % 50,
        evidenceCoverage: 42 + (id * 7) % 55,
        confidenceHealth: 40 + (id * 13) % 53,
        operationalReadiness: 38 + (id * 17) % 55,
        harmPotential: 14 + (id * 5) % 70,
        resourcePressure: 9 + (id * 3) % 75,
        urgency: 25 + (id * 19) % 70,
        impactPotential: 35 + (id * 23) % 65,
        humanApprovalLatency: 5 + (id * 29) % 70
    };
}

function main() {
    assert.ok(fs.existsSync(MANIFEST_PATH), `Missing manifest: ${MANIFEST_PATH}`);
    const manifest = loadJson<ManifestEntry[]>(MANIFEST_PATH);
    assert.equal(manifest.length, 1000, `Expected 1000 entries in manifest, found ${manifest.length}`);

    const postureCounts: Record<SkillPosture, number> = {
        ready: 0,
        review_required: 0,
        critical: 0
    };
    const domainCounts = new Map<string, number>();
    const sampleRuns: Array<{
        id: number;
        name: string;
        domain: string;
        posture: SkillPosture;
        overallScore: number;
        riskScore: number;
    }> = [];

    for (const entry of manifest) {
        const implementationPath = path.join(REPO_ROOT, entry.implementationPath);
        assert.ok(fs.existsSync(implementationPath), `Missing implementation for skill ${entry.id}`);
        const implementation = loadJson<SkillImplementation>(implementationPath);

        const execution = executeSkillImplementation(implementation, buildInput(entry.id));
        assert.equal(execution.skillId, entry.id, `Skill id mismatch for ${entry.id}`);
        assert.equal(execution.skillName, entry.name, `Skill name mismatch for ${entry.id}`);
        assert.ok(execution.scores.overallScore >= 0 && execution.scores.overallScore <= 100);
        assert.ok(execution.scores.riskScore >= 0 && execution.scores.riskScore <= 100);
        assert.ok(execution.deliverables.length >= 4, `Expected deliverables for ${entry.id}`);
        assert.ok(execution.actions.length >= 4, `Expected actions for ${entry.id}`);
        assert.ok(execution.approvalGates.length >= 2, `Expected approval gates for ${entry.id}`);

        const tasks = skillExecutionToTasks(execution, { fromAgentId: 'agent:runtime-audit' });
        assert.ok(tasks.length >= 3, `Expected task pack for ${entry.id}`);
        assert.ok(tasks.every((task) => task.kind === 'task_request'), `Invalid task kind for ${entry.id}`);
        assert.ok(tasks.every((task) => task.from === 'agent:runtime-audit'), `Unexpected task sender for ${entry.id}`);

        postureCounts[execution.posture] += 1;
        domainCounts.set(entry.domain, (domainCounts.get(entry.domain) || 0) + 1);

        if (
            sampleRuns.length < 10
            && (entry.id % 97 === 0 || entry.id === 1 || entry.id === 500 || entry.id === 1000)
        ) {
            sampleRuns.push({
                id: entry.id,
                name: entry.name,
                domain: entry.domain,
                posture: execution.posture,
                overallScore: execution.scores.overallScore,
                riskScore: execution.scores.riskScore
            });
        }
    }

    const topDomains = Array.from(domainCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([domain, count]) => ({ domain, count }));

    const report = {
        generatedAt: new Date().toISOString(),
        totalSkillsExecuted: manifest.length,
        postureCounts,
        topDomains,
        sampleRuns
    };
    fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`);

    console.log(
        `[exercise-1000-skills] Executed ${manifest.length} skills | ` +
        `ready=${postureCounts.ready} review_required=${postureCounts.review_required} critical=${postureCounts.critical}`
    );
}

main();
