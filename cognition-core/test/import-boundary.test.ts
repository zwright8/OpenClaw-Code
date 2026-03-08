import fs from 'fs';
import path from 'path';
import test from 'node:test';
import assert from 'node:assert/strict';

const cwd = path.resolve(process.cwd());
const ROOT = path.basename(cwd) === 'cognition-core'
    ? path.resolve(cwd, '..')
    : cwd;
const COGNITION_ROOT = path.join(ROOT, 'cognition-core');

function listTsFiles(rootDir, out = []) {
    if (!fs.existsSync(rootDir)) return out;
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === 'reports') continue;
        const fullPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            listTsFiles(fullPath, out);
            continue;
        }
        if (entry.isFile() && entry.name.endsWith('.ts')) {
            out.push(fullPath);
        }
    }
    return out;
}

test('cognition-core does not import swarm-protocol index barrel', () => {
    const candidates = [
        path.join(COGNITION_ROOT, 'src'),
        path.join(COGNITION_ROOT, 'scripts'),
        path.join(COGNITION_ROOT, 'index.ts')
    ];

    const files = [];
    for (const candidate of candidates) {
        if (!fs.existsSync(candidate)) continue;
        const stats = fs.statSync(candidate);
        if (stats.isDirectory()) {
            listTsFiles(candidate, files);
        } else if (stats.isFile()) {
            files.push(candidate);
        }
    }

    const offenders = [];
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('swarm-protocol/index.js')) {
            offenders.push(path.relative(ROOT, file));
        }
    }

    assert.deepEqual(
        offenders,
        [],
        `Import boundary violation: use swarm-protocol/runtime.js instead of swarm-protocol/index.js.\nOffenders:\n${offenders.join('\n')}`
    );
});
