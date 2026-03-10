import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import {
    assessSkillImplementationHardening,
    assessSkillImplementationHardeningBatch,
    buildSkillDeployabilityIndex,
    createDefaultSkillHardeningProfile,
    loadSkillImplementationById
} from '../../skills/runtime/index.js';

const cwd = path.resolve(process.cwd());
const REPO_ROOT = path.basename(cwd) === 'cognition-core'
    ? path.resolve(cwd, '..')
    : cwd;

test('assessSkillImplementationHardening marks baseline generated skills deployable', () => {
    const implementation = loadSkillImplementationById(1, REPO_ROOT);
    const report = assessSkillImplementationHardening(implementation, {
        source: 'manifest',
        minDeployableScore: 82,
        strict: true
    });

    assert.equal(report.source, 'manifest');
    assert.equal(report.skillId, 1);
    assert.equal(report.deployable, true);
    assert.ok(report.hardeningScore >= 82);
    assert.equal(report.blockingFindings, 0);
    assert.equal(report.scenarioResults.length, 3);
});

test('assessSkillImplementationHardening catches broken runtime contract', () => {
    const implementation = loadSkillImplementationById(1, REPO_ROOT);
    const broken = JSON.parse(JSON.stringify(implementation));
    broken.runtimeProfile.scoringWeights.truth = 0.9;
    broken.runtimeProfile.scoringWeights.execution = 0.9;
    broken.runtimeProfile.scoringWeights.safety = 0;
    broken.runtimeProfile.scoringWeights.impact = 0;
    broken.runtimeProfile.requiredSignals = ['signal-a'];
    broken.runtimeProfile.orchestration.approvalGates = ['none'];
    broken.runtimeProfile.validation.suites = [];

    const report = assessSkillImplementationHardening(broken, {
        source: 'manifest',
        minDeployableScore: 82,
        strict: true
    });

    assert.equal(report.deployable, false);
    assert.ok(report.blockingFindings >= 1);
    assert.ok(report.findings.some((finding) => finding.blocking));
    assert.ok(report.findings.some((finding) => finding.checkId === 'runtime_contract'));
});

test('assessSkillImplementationHardeningBatch builds deployability index', () => {
    const implementation = loadSkillImplementationById(1, REPO_ROOT);
    const batch = assessSkillImplementationHardeningBatch([
        {
            source: 'manifest',
            implementation
        }
    ], {
        minDeployableScore: 82,
        strict: true
    });

    assert.equal(batch.summary.evaluated, 1);
    assert.equal(batch.summary.deployable, 1);

    const index = buildSkillDeployabilityIndex(batch);
    assert.equal(index.version, 1);
    assert.equal(index.entries.length, 1);
    assert.equal(index.entries[0].key, 'manifest:1');
});

test('hardening profile can switch specific skills to report-only policy', () => {
    const implementation = loadSkillImplementationById(1, REPO_ROOT);
    const broken = JSON.parse(JSON.stringify(implementation));
    broken.runtimeProfile.requiredSignals = ['signal-a'];
    broken.runtimeProfile.validation.suites = [];
    broken.runtimeProfile.orchestration.approvalGates = [];

    const profile = createDefaultSkillHardeningProfile({
        policy: 'enforce',
        minDeployableScore: 82,
        strict: true
    });
    profile.rules.unshift({
        id: 'report-skill-1',
        skillIds: [1],
        policy: 'report',
        strict: true,
        minDeployableScore: 95
    });

    const report = assessSkillImplementationHardening(broken, {
        source: 'manifest',
        profile
    });

    assert.equal(report.appliedPolicy.policy, 'report');
    assert.equal(report.hardeningGatePass, false);
    assert.equal(report.deployable, true);
    assert.ok(report.blockingFindings >= 1);
});
