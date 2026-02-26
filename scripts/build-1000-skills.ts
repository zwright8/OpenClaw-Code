import fs from 'fs';
import path from 'path';

type SkillUpdate = {
    id: number;
    title: string;
    domain: string;
    reason: string;
    steps: string[];
};

const REPO_ROOT = process.cwd();
const SOURCE_PATH = path.join(REPO_ROOT, 'SKILLS_UPDATES_1000.md');
const SKILL_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const MANIFEST_PATH = path.join(SKILL_ROOT, 'skills.manifest.json');
const INDEX_PATH = path.join(SKILL_ROOT, 'INDEX.md');

function slugify(value: string): string {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/-{2,}/g, '-');
}

function cleanSentence(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

function parseUpdates(markdown: string): SkillUpdate[] {
    const lines = markdown.split('\n');
    const updates: SkillUpdate[] = [];
    let current: SkillUpdate | null = null;

    const pushCurrent = () => {
        if (!current) return;
        if (current.steps.length === 0) {
            throw new Error(`Update ${current.id} has no implementation steps`);
        }
        updates.push(current);
        current = null;
    };

    for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        const updateMatch = line.match(/^## Update (\d+): (.+)$/);
        if (updateMatch) {
            pushCurrent();
            current = {
                id: Number(updateMatch[1]),
                title: cleanSentence(updateMatch[2]),
                domain: '',
                reason: '',
                steps: []
            };
            continue;
        }

        if (!current) continue;

        if (line.startsWith('- Domain: ')) {
            current.domain = cleanSentence(line.slice('- Domain: '.length));
            continue;
        }

        if (line.startsWith('- Why this new skill is needed: ')) {
            current.reason = cleanSentence(line.slice('- Why this new skill is needed: '.length));
            continue;
        }

        if (line.match(/^\d+\.\s+/)) {
            const stepText = line.replace(/^\d+\.\s+/, '');
            current.steps.push(cleanSentence(stepText));
        }
    }

    pushCurrent();
    updates.sort((a, b) => a.id - b.id);
    return updates;
}

function buildSkillName(id: number, title: string, usedNames: Set<string>): string {
    const idPrefix = `u${String(id).padStart(4, '0')}`;
    const titleSlug = slugify(title);
    const maxTail = Math.max(1, 64 - idPrefix.length - 1);
    let candidate = `${idPrefix}-${titleSlug.slice(0, maxTail)}`.replace(/-+$/g, '');
    if (!candidate) candidate = idPrefix;

    let dedupe = 1;
    while (usedNames.has(candidate)) {
        const suffix = `-${dedupe}`;
        const allowed = Math.max(1, 64 - suffix.length);
        candidate = `${candidate.slice(0, allowed)}${suffix}`.replace(/-+$/g, '');
        dedupe += 1;
    }
    usedNames.add(candidate);
    return candidate;
}

function buildSkillMarkdown(update: SkillUpdate, skillName: string): string {
    const description = cleanSentence(
        `Build and operate the "${update.title}" capability for ${update.domain}. ` +
        `Trigger when this exact capability is needed in mission execution.`
    );

    const stepList = update.steps
        .map((step, index) => `${index + 1}. ${step}`)
        .join('\n');

    return `---
name: ${skillName}
description: ${description}
---

# ${update.title}

## Why This Skill Exists
${update.reason}

## When To Use
Use this skill when the request explicitly needs "${update.title}" outcomes in the ${update.domain} domain.

## Step-by-Step Implementation Guide
${stepList}

## Required Deliverables
- Capability contract: input schema, deterministic scoring, output schema, and failure modes.
- Orchestration integration: task routing, approval gates, retries, and rollback controls.
- Validation evidence: unit tests, integration tests, simulation checks, and rollout telemetry.
`;
}

function ensureCleanOutputDir(outputDir: string) {
    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir, { recursive: true });
}

function main() {
    const sourceMarkdown = fs.readFileSync(SOURCE_PATH, 'utf8');
    const updates = parseUpdates(sourceMarkdown);
    if (updates.length !== 1000) {
        throw new Error(`Expected 1000 updates in ${SOURCE_PATH}, found ${updates.length}`);
    }

    ensureCleanOutputDir(SKILL_ROOT);
    const usedNames = new Set<string>();
    const manifest: Array<{
        id: number;
        name: string;
        title: string;
        domain: string;
        path: string;
        reason: string;
        stepCount: number;
    }> = [];

    for (const update of updates) {
        if (!update.domain || !update.reason || update.steps.length < 6) {
            throw new Error(`Update ${update.id} is missing required fields (domain/reason/steps)`);
        }

        const skillName = buildSkillName(update.id, update.title, usedNames);
        const dirName = `${String(update.id).padStart(4, '0')}-${slugify(update.title).slice(0, 80)}`;
        const skillDir = path.join(SKILL_ROOT, dirName);
        fs.mkdirSync(skillDir, { recursive: true });
        fs.writeFileSync(path.join(skillDir, 'SKILL.md'), buildSkillMarkdown(update, skillName));

        manifest.push({
            id: update.id,
            name: skillName,
            title: update.title,
            domain: update.domain,
            path: `skills/generated/${dirName}/SKILL.md`,
            reason: update.reason,
            stepCount: update.steps.length
        });
    }

    fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

    const indexLines = [
        '# Generated Skills Index (1000 Skills)',
        '',
        'This index is generated from `SKILLS_UPDATES_1000.md`.',
        '',
        '| Update | Skill Name | Domain | Path |',
        '| --- | --- | --- | --- |',
        ...manifest.map((entry) => (
            `| ${entry.id} | \`${entry.name}\` | ${entry.domain} | ${entry.path} |`
        )),
        ''
    ];
    fs.writeFileSync(INDEX_PATH, indexLines.join('\n'));

    console.log(`[build-1000-skills] Generated ${manifest.length} skills in ${SKILL_ROOT}`);
}

main();
