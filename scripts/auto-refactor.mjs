import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_REPO_ROOT = path.resolve(SCRIPT_DIR, '..');
const IGNORED_DIRS = new Set(['.git', 'node_modules']);
const CHECKED_EXTENSIONS = new Set(['.js', '.mjs', '.cjs']);

function parseArgs(argv) {
    const options = {
        repoRoot: DEFAULT_REPO_ROOT,
        help: false
    };

    for (let i = 0; i < argv.length; i++) {
        const token = argv[i];
        if (token === '--help' || token === '-h') {
            options.help = true;
            continue;
        }

        if (token === '--repo') {
            const value = argv[i + 1];
            if (!value) throw new Error('Missing value for --repo');
            options.repoRoot = path.resolve(process.cwd(), value);
            i++;
            continue;
        }

        throw new Error(`Unknown argument: ${token}`);
    }

    return options;
}

function printHelp() {
    console.log(`OpenClaw Auto-Refactor (lint/check mode)

Usage:
  node scripts/auto-refactor.mjs [options]

Options:
  --repo <path>   Repository root to scan (default: current repo)
  -h, --help      Show help
`);
}

function walk(rootDir, onFile) {
    const entries = fs.readdirSync(rootDir, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.name.startsWith('.DS_Store')) continue;

        const fullPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            if (IGNORED_DIRS.has(entry.name)) continue;
            walk(fullPath, onFile);
            continue;
        }
        onFile(fullPath);
    }
}

function collectFiles(repoRoot) {
    const jsFiles = [];
    const packageJsonFiles = [];

    walk(repoRoot, (filePath) => {
        const base = path.basename(filePath);
        if (base === 'package.json') {
            packageJsonFiles.push(filePath);
            return;
        }

        const ext = path.extname(filePath);
        if (CHECKED_EXTENSIONS.has(ext)) {
            jsFiles.push(filePath);
        }
    });

    return { jsFiles, packageJsonFiles };
}

function runSyntaxChecks(jsFiles) {
    const issues = [];

    for (const filePath of jsFiles) {
        const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
        if (result.status === 0) continue;

        const stderr = (result.stderr || '').trim();
        issues.push({
            type: 'syntax',
            filePath,
            message: stderr || 'Syntax check failed'
        });
    }

    return issues;
}

function extractNodeEntrypoints(scriptCommand) {
    const entrypoints = [];
    const chunks = scriptCommand.split(/&&|\|\|/);

    for (const chunk of chunks) {
        const tokens = chunk.trim().split(/\s+/).filter(Boolean);
        for (let i = 0; i < tokens.length; i++) {
            if (tokens[i] !== 'node') continue;
            let cursor = i + 1;
            while (cursor < tokens.length && tokens[cursor].startsWith('-')) {
                cursor++;
            }
            if (cursor < tokens.length) {
                const target = tokens[cursor].replace(/^['"]|['"]$/g, '');
                entrypoints.push(target);
            }
        }
    }

    return entrypoints;
}

function runPackageScriptChecks(packageJsonFiles) {
    const issues = [];

    for (const filePath of packageJsonFiles) {
        const pkg = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (!pkg.scripts || typeof pkg.scripts !== 'object') continue;

        const packageDir = path.dirname(filePath);
        for (const [scriptName, command] of Object.entries(pkg.scripts)) {
            if (typeof command !== 'string') continue;
            const entrypoints = extractNodeEntrypoints(command);

            for (const entrypoint of entrypoints) {
                const resolved = path.isAbsolute(entrypoint)
                    ? entrypoint
                    : path.resolve(packageDir, entrypoint);
                if (fs.existsSync(resolved)) continue;

                issues.push({
                    type: 'script-entrypoint',
                    filePath,
                    message: `Script "${scriptName}" references missing file: ${entrypoint}`
                });
            }
        }
    }

    return issues;
}

function collectRelativeImports(filePath) {
    const source = fs.readFileSync(filePath, 'utf8');
    const imports = new Set();
    const patterns = [
        /\bimport\s+(?:[^'"]*?\s+from\s+)?['"]([^'"]+)['"]/g,
        /\bexport\s+[^'"]*?\s+from\s+['"]([^'"]+)['"]/g,
        /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g
    ];

    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(source)) !== null) {
            imports.add(match[1]);
        }
    }

    return [...imports].filter((entry) => entry.startsWith('.'));
}

function resolveImportCandidate(baseFile, specifier) {
    const withoutQuery = specifier.split('?')[0].split('#')[0];
    const candidateRoot = path.resolve(path.dirname(baseFile), withoutQuery);

    const candidates = [];
    if (path.extname(candidateRoot)) {
        candidates.push(candidateRoot);
    } else {
        candidates.push(
            candidateRoot,
            `${candidateRoot}.js`,
            `${candidateRoot}.mjs`,
            `${candidateRoot}.cjs`,
            `${candidateRoot}.json`,
            path.join(candidateRoot, 'index.js'),
            path.join(candidateRoot, 'index.mjs'),
            path.join(candidateRoot, 'index.cjs')
        );
    }

    return candidates.find((candidate) => fs.existsSync(candidate));
}

function runImportChecks(jsFiles) {
    const issues = [];

    for (const filePath of jsFiles) {
        for (const specifier of collectRelativeImports(filePath)) {
            const resolved = resolveImportCandidate(filePath, specifier);
            if (resolved) continue;

            issues.push({
                type: 'import',
                filePath,
                message: `Missing relative import target: "${specifier}"`
            });
        }
    }

    return issues;
}

function renderIssue(issue, repoRoot) {
    const relative = path.relative(repoRoot, issue.filePath) || issue.filePath;
    return `[${issue.type}] ${relative}: ${issue.message}`;
}

(function main() {
    try {
        const options = parseArgs(process.argv.slice(2));
        if (options.help) {
            printHelp();
            return;
        }

        const { jsFiles, packageJsonFiles } = collectFiles(options.repoRoot);
        const issues = [
            ...runSyntaxChecks(jsFiles),
            ...runPackageScriptChecks(packageJsonFiles),
            ...runImportChecks(jsFiles)
        ];

        console.log(`[auto-refactor] JS files checked: ${jsFiles.length}`);
        console.log(`[auto-refactor] package.json files checked: ${packageJsonFiles.length}`);

        if (issues.length === 0) {
            console.log('[auto-refactor] No issues found.');
            return;
        }

        console.log(`[auto-refactor] Found ${issues.length} issue(s):`);
        for (const issue of issues) {
            console.log(`  - ${renderIssue(issue, options.repoRoot)}`);
        }
        process.exit(1);
    } catch (err) {
        console.error(`[auto-refactor] Failed: ${err.message}`);
        process.exit(1);
    }
})();
