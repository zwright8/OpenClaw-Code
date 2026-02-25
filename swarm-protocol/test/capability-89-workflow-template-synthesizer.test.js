import test from 'node:test';
import assert from 'node:assert/strict';
import { runCapabilityChecks } from './capability-test-utils.js';
import {
    synthesizeWorkflowTemplates,
    workflowTemplatesToTasks,
    WorkflowTemplateSynthesizer
} from '../index.js';

test('capability 89 workflow template synthesizer', () => {
    runCapabilityChecks({
        buildReport: synthesizeWorkflowTemplates,
        toTasks: workflowTemplatesToTasks,
        ClassCtor: WorkflowTemplateSynthesizer,
        input: {
            workflowRuns: [
                {
                    workflowId: 'wf-1',
                    domain: 'incident',
                    successRate: 64,
                    latencyMs: 28000,
                    runCount: 12,
                    steps: [
                        { key: 'triage', failureRate: 8, latencyMs: 2100 },
                        { key: 'recover', failureRate: 32, latencyMs: 9200 }
                    ]
                },
                {
                    workflowId: 'wf-2',
                    domain: 'incident',
                    successRate: 78,
                    latencyMs: 22000,
                    runCount: 8,
                    steps: [
                        { key: 'triage', failureRate: 6, latencyMs: 1900 },
                        { key: 'recover', failureRate: 26, latencyMs: 8700 }
                    ]
                }
            ]
        },
        assertReport: (report) => {
            assert.equal(report.summary.templateCount, 1);
            assert.equal(report.alerts.includes('template_bottlenecks_detected'), true);
        }
    });
});
