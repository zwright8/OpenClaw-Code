import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    discoverAndPlanSkillInstallations,
    skillDiscoveryToTasks,
    SkillDiscoveryAutoInstaller
} from '../index.js';

test('capability 86 skill discovery auto-installer', () => {
    runCapabilityChecks({
        buildReport: discoverAndPlanSkillInstallations,
        toTasks: skillDiscoveryToTasks,
        ClassCtor: SkillDiscoveryAutoInstaller,
        input: {
            requiredCapabilities: ['analysis', 'simulation'],
            installedSkills: [
                { skillId: 'skill-analysis', capabilities: ['analysis'], reliability: 80, trustScore: 82 }
            ],
            candidateCatalog: [{
                skillId: 'skill-sim-lite',
                source: 'registry',
                capabilities: ['simulation'],
                maturity: 62,
                trustScore: 58,
                integrationCost: 66,
                validationCoverage: 52
            }]
        },
        assertReport: (report) => {
            assert.equal(report.summary.requirementCount, 2);
            assert.equal(report.summary.installableCount >= 1, true);
        }
    });
});
