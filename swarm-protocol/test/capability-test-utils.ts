import assert from 'node:assert/strict';

export function runCapabilityChecks({
    buildReport,
    toTasks,
    ClassCtor,
    input,
    assertReport
}) {
    const report = buildReport(input, { now: () => 5_000_000 });
    assert.ok(report && typeof report === 'object');
    assert.ok(report.summary && typeof report.summary === 'object');
    assertReport(report);

    const tasks = toTasks(report, { fromAgentId: 'agent:test' });
    assert.ok(Array.isArray(tasks));
    assert.ok(tasks.length > 0);
    assert.equal(tasks[0].kind, 'task_request');
    assert.equal(tasks[0].from, 'agent:test');

    const capability = new ClassCtor({ localAgentId: 'agent:local', now: () => 5_100_000 });
    const classReport = capability.evaluate(input);
    const classTasks = capability.buildTasks(classReport);

    assert.ok(Array.isArray(classTasks));
    assert.ok(classTasks.length > 0);
    assert.equal(classTasks[0].from, 'agent:local');
    assert.equal(capability.listHistory({ limit: 5 }).length, 1);
}
