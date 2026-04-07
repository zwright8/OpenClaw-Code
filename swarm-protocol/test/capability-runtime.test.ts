import test from 'node:test';
import assert from 'node:assert/strict';
import {
    executeCapabilityById,
    normalizeCapabilityId,
    resolveCapabilityModuleSpecifier
} from '../runtime.js';

test('normalizeCapabilityId normalizes mixed separators', () => {
    assert.equal(
        normalizeCapabilityId('  cultural-context window  prioritizer  '),
        'cultural_context_window_prioritizer'
    );
});

test('resolveCapabilityModuleSpecifier maps capability id to module URL', () => {
    const specifier = resolveCapabilityModuleSpecifier('truth_engine');
    assert.match(specifier, /truth-engine\.js$/);
});

test('executeCapabilityById evaluates capability and builds follow-up tasks', async () => {
    const result = await executeCapabilityById('cultural_context_window_prioritizer', {
        contexts: [
            {
                contextId: 'ctx-1',
                demand: 84,
                capacity: 36,
                risk: 78,
                impact: 82,
                readiness: 40,
                trust: 47,
                quality: 45
            }
        ]
    });

    assert.equal(result.capabilityId, 'cultural_context_window_prioritizer');
    assert.equal(typeof result.evaluateExportName, 'string');
    assert.ok(result.evaluateExportName.length > 0);
    assert.equal(typeof result.toTasksExportName, 'string');
    assert.ok(result.toTasksExportName.length > 0);

    const report = result.report as { summary?: Record<string, unknown>; recommendations?: unknown[]; };
    assert.equal(typeof report.summary, 'object');
    assert.ok(Array.isArray(report.recommendations));
    assert.ok(report.recommendations.length > 0);

    assert.ok(Array.isArray(result.followupTasks));
    assert.ok(result.followupTasks.length > 0);
});

test('executeCapabilityById throws for unknown capabilities', async () => {
    await assert.rejects(
        executeCapabilityById('definitely_not_a_real_capability', {}),
        /Unable to load capability module/
    );
});
