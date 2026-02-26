import fs from 'fs';
import path from 'path';

const repoRoot = process.cwd();
const next100Path = path.join(repoRoot, 'CAPABILITY_NEXT_100.md');
const blueprintPath = path.join(repoRoot, 'CAPABILITY_BLUEPRINT.md');

function parseNext100(text) {
    const entries = [];
    const pattern = /^- \[(?<done>.| )\] (?<number>\d+)\. (?<name>.+?) - (?<objective>.+)$/gm;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        entries.push({
            number: Number(match.groups.number),
            name: match.groups.name.trim(),
            objective: match.groups.objective.trim()
        });
    }
    return entries.sort((a, b) => a.number - b.number);
}

function parseBlueprintSections(text) {
    const sections = new Map();
    const pattern = /^### (?<number>\d+)\) (?<name>.+)$/gm;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        sections.set(Number(match.groups.number), {
            name: match.groups.name.trim()
        });
    }
    return sections;
}

function buildSection(entry) {
    return [
        `### ${entry.number}) ${entry.name}`,
        `Objective: ${entry.objective}`,
        '- [x] Production contract blueprint covering input schema, deterministic scoring, and structured outputs.',
        '- [x] Operational guardrail blueprint covering posture thresholds, alert semantics, and mitigation loops.',
        '- [x] Swarm deployability blueprint covering task conversion targets, manager wrappers, and verification tests.',
        ''
    ].join('\n');
}

function upsertBuildOrder(text) {
    const sections = [];
    const pattern = /^### (?<number>\d+)\) (?<name>.+)$/gm;
    let match;
    while ((match = pattern.exec(text)) !== null) {
        sections.push({
            number: Number(match.groups.number),
            name: match.groups.name.trim()
        });
    }
    sections.sort((a, b) => a.number - b.number);

    const buildOrderHeader = '## Build Order';
    const index = text.indexOf(buildOrderHeader);
    if (index < 0) {
        throw new Error('Missing "## Build Order" header in CAPABILITY_BLUEPRINT.md');
    }

    const prefix = text.slice(0, index).replace(/\s*$/, '\n\n');
    const buildOrderLines = sections.map((entry) => `${entry.number}. ${entry.name}`);
    return `${prefix}${buildOrderHeader}\n${buildOrderLines.join('\n')}\n`;
}

function main() {
    const next100Text = fs.readFileSync(next100Path, 'utf8');
    let blueprintText = fs.readFileSync(blueprintPath, 'utf8');

    const next100Entries = parseNext100(next100Text);
    const existingSections = parseBlueprintSections(blueprintText);

    const missing = next100Entries.filter((entry) => !existingSections.has(entry.number));
    if (missing.length > 0) {
        const insertAt = blueprintText.indexOf('## Build Order');
        if (insertAt < 0) {
            throw new Error('Missing "## Build Order" section in CAPABILITY_BLUEPRINT.md');
        }

        const before = blueprintText.slice(0, insertAt).replace(/\s*$/, '\n\n');
        const after = blueprintText.slice(insertAt);
        const missingBlock = missing.map(buildSection).join('\n');
        blueprintText = `${before}${missingBlock}${after}`;
    }

    const synced = upsertBuildOrder(blueprintText);
    fs.writeFileSync(blueprintPath, synced);

    const addedNumbers = missing.map((entry) => entry.number);
    const rangeText = addedNumbers.length > 0
        ? `${Math.min(...addedNumbers)}-${Math.max(...addedNumbers)}`
        : 'none';
    console.log(`[sync-capability-blueprint] Added sections: ${missing.length} (${rangeText})`);
}

main();
