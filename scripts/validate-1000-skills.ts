import fs from 'fs';
import path from 'path';

type ManifestEntry = {
    id: number;
    name: string;
    title: string;
    domain: string;
    path: string;
    reason: string;
    stepCount: number;
};

const REPO_ROOT = process.cwd();
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const MANIFEST_PATH = path.join(SKILL_ROOT, 'skills.manifest.json');

function parseFrontmatter(markdown: string): Record<string, string> {
    const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!match) return {};
    const frontmatter: Record<string, string> = {};
    for (const line of match[1].split('\n')) {
        const idx = line.indexOf(':');
        if (idx < 0) continue;
        const key = line.slice(0, idx).trim();
        const value = line.slice(idx + 1).trim();
        frontmatter[key] = value;
    }
    return frontmatter;
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}

function validateSkillMarkdown(filePath: string, expectedName: string) {
    const markdown = fs.readFileSync(filePath, 'utf8');
    const frontmatter = parseFrontmatter(markdown);
    assert(frontmatter.name, `Missing frontmatter name in ${filePath}`);
    assert(frontmatter.description, `Missing frontmatter description in ${filePath}`);
    assert(frontmatter.name === expectedName, `Frontmatter name mismatch in ${filePath}`);

    const steps = markdown.split('\n').filter((line) => /^\d+\.\s+/.test(line));
    assert(steps.length >= 6, `Expected at least 6 implementation steps in ${filePath}`);
    assert(markdown.includes('## Why This Skill Exists'), `Missing reason section in ${filePath}`);
    assert(markdown.includes('## Step-by-Step Implementation Guide'), `Missing implementation guide in ${filePath}`);
}

function main() {
    assert(fs.existsSync(MANIFEST_PATH), `Missing manifest: ${MANIFEST_PATH}`);
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')) as ManifestEntry[];
    assert(Array.isArray(manifest), 'Manifest is not an array');
    assert(manifest.length === 1000, `Expected 1000 skills, found ${manifest.length}`);

    let checked = 0;
    for (const entry of manifest) {
        assert(typeof entry.id === 'number' && entry.id >= 1, `Invalid id in manifest entry ${JSON.stringify(entry)}`);
        assert(typeof entry.name === 'string' && entry.name.length > 0, `Invalid name in manifest entry ${entry.id}`);
        assert(entry.name.length <= 64, `Skill name too long for entry ${entry.id}: ${entry.name}`);
        assert(/^[a-z0-9-]+$/.test(entry.name), `Skill name has invalid characters for entry ${entry.id}: ${entry.name}`);

        const absolutePath = path.join(REPO_ROOT, entry.path);
        assert(fs.existsSync(absolutePath), `Missing skill file for entry ${entry.id}: ${entry.path}`);
        validateSkillMarkdown(absolutePath, entry.name);
        checked += 1;
    }

    console.log(`[validate-1000-skills] Validated ${checked} skills successfully.`);
}

main();
