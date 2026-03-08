import fs from 'fs';
import path from 'path';
import test from 'node:test';
import assert from 'node:assert/strict';

const ROOT = path.resolve(process.cwd());
const SRC_DIR = path.join(ROOT, 'src');
const RUNTIME_ENTRYPOINT = path.join(ROOT, 'runtime.ts');
const CAPABILITIES_ENTRYPOINT = path.join(ROOT, 'capabilities.ts');

const INTERNAL_ONLY_MODULES = new Set([
    'capability-toolkit'
]);

function parseExportedModules(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const modules = [];
    const pattern = /^export \* from '\.\/src\/([^']+)\.js';$/gm;
    let match;
    while ((match = pattern.exec(content)) !== null) {
        modules.push(match[1]);
    }
    return modules;
}

function listSourceModules() {
    return fs.readdirSync(SRC_DIR)
        .filter((entry) => entry.endsWith('.ts'))
        .map((entry) => entry.replace(/\.ts$/, ''))
        .sort();
}

test('public surface exports all src modules except internal allowlist', () => {
    const runtimeModules = parseExportedModules(RUNTIME_ENTRYPOINT);
    const capabilityModules = parseExportedModules(CAPABILITIES_ENTRYPOINT);
    const exported = new Set([...runtimeModules, ...capabilityModules]);
    const sourceModules = listSourceModules();

    const missing = sourceModules.filter((moduleId) => (
        !INTERNAL_ONLY_MODULES.has(moduleId) && !exported.has(moduleId)
    ));

    assert.deepEqual(
        missing,
        [],
        `Missing public exports for src modules:\n${missing.join('\n')}`
    );
});

test('runtime and capability entrypoints do not overlap', () => {
    const runtimeModules = new Set(parseExportedModules(RUNTIME_ENTRYPOINT));
    const capabilityModules = new Set(parseExportedModules(CAPABILITIES_ENTRYPOINT));
    const overlap = [...runtimeModules].filter((moduleId) => capabilityModules.has(moduleId)).sort();

    assert.deepEqual(
        overlap,
        [],
        `Duplicate exports across runtime/capabilities entrypoints:\n${overlap.join('\n')}`
    );
});
