import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'path';
import {
    executeSkillImplementation,
    hasExternalSkillImprovementCatalog,
    loadSkillImplementationById,
    loadExternalSkillImplementationById
} from '../../skills/runtime/index.js';

const cwd = path.resolve(process.cwd());
const REPO_ROOT = path.basename(cwd) === 'cognition-core'
    ? path.resolve(cwd, '..')
    : cwd;

test('external skill implementations include generated improvement profiles', () => {
    assert.equal(hasExternalSkillImprovementCatalog(REPO_ROOT), true);

    const implementation = loadExternalSkillImplementationById(1, REPO_ROOT);
    assert.ok(implementation.improvementProfile);
    assert.ok(implementation.improvementProfile?.tier);
    assert.ok(Array.isArray(implementation.improvementProfile?.guardrails));
    assert.ok(implementation.improvementProfile?.guardrails.length >= 3);
});

test('materialized generated skills resolve directly by id', () => {
    const implementation = loadSkillImplementationById(1001, REPO_ROOT);
    assert.equal(implementation.skillId, 1001);
    assert.ok(implementation.skillName.length > 0);
    assert.ok(Array.isArray(implementation.implementationGuide));
    assert.ok(implementation.implementationGuide.length > 0);
});

test('skill execution includes improvement-derived actions and deliverables', () => {
    const implementation = loadExternalSkillImplementationById(1, REPO_ROOT);
    const execution = executeSkillImplementation(implementation, {
        signalQuality: 90,
        evidenceCoverage: 88,
        confidenceHealth: 86,
        operationalReadiness: 84,
        harmPotential: 18,
        resourcePressure: 25,
        urgency: 62,
        impactPotential: 82,
        humanApprovalLatency: 20
    });

    assert.ok(execution.improvementTier);
    assert.equal(typeof execution.autopilotReady, 'boolean');
    assert.ok(execution.actions.some((action) => action.startsWith('autopilot-ready:')));
    assert.ok(execution.deliverables.some((deliverable) => deliverable.startsWith('improvement-tier:')));
});
