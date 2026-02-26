import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    classifyReflectionErrors,
    reflectionErrorsToTasks,
    SelfReflectionErrorTaxonomy
} from '../index.js';

test('capability 83 self-reflection error taxonomy', () => {
    runCapabilityChecks({
        buildReport: classifyReflectionErrors,
        toTasks: reflectionErrorsToTasks,
        ClassCtor: SelfReflectionErrorTaxonomy,
        input: {
            incidents: [
                {
                    incidentId: 'inc-1',
                    summary: 'Hallucination caused unsupported evidence in incident summary',
                    severity: 86,
                    recurrence: 3,
                    tags: ['evidence', 'fabricated']
                },
                {
                    incidentId: 'inc-2',
                    summary: 'Missed dependency in plan sequencing',
                    severity: 64,
                    recurrence: 2,
                    tags: ['plan']
                }
            ]
        },
        assertReport: (report) => {
            assert.ok(report.taxonomy.length >= 1);
            assert.equal(report.alerts.includes('taxonomy_recurring_critical_errors'), true);
        }
    });
});
