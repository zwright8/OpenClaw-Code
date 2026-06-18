export const BaseGeneratedSkillRequiredSections = [
    '## Why This Skill Exists',
    '## When To Use',
    '## Step-by-Step Implementation Guide',
    '## Required Deliverables',
    '## Operational Runbook',
    '## Guardrails'
] as const;

export const ToolShardSkillRequiredSections = [
    '## Why This Skill Exists',
    '## Quick Reference',
    '## Trigger Checklist',
    '## Auth & Access Profile',
    '## Step-by-Step Implementation Guide',
    '## Validation Gates & Test Matrix',
    '## Failure Modes & Recovery Playbook',
    '## Credential Reuse Policy',
    '## Handoff Contract'
] as const;

type GeneratedSkillMarkdownInput = {
    skillName: string;
    description: string;
    title: string;
    reason: string;
    whenToUse: string;
    implementationGuide: string[];
    requiredDeliverables: string[];
    runbook: {
        preflight: string[];
        execution: string[];
        recovery: string[];
        handoff: string[];
    };
    guardrails: string[];
};

type SkillMarkdownContractOptions = {
    expectedName: string;
    expectedTitle?: string;
    requiredSections?: readonly string[];
    expectedStepCount?: number;
    minStepCount?: number;
};

export function parseFrontmatter(markdown: string): Record<string, string> {
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

export function extractNumberedSteps(markdown: string): string[] {
    return markdown
        .split('\n')
        .filter((line) => /^\d+\.\s+/.test(line))
        .map((line) => line.replace(/^\d+\.\s+/, '').trim())
        .filter(Boolean);
}

export function assertSkillMarkdownContract(
    filePath: string,
    markdown: string,
    {
        expectedName,
        expectedTitle,
        requiredSections = BaseGeneratedSkillRequiredSections,
        expectedStepCount,
        minStepCount = 6
    }: SkillMarkdownContractOptions
) {
    const frontmatter = parseFrontmatter(markdown);
    assert(frontmatter.name, `Missing frontmatter name in ${filePath}`);
    assert(frontmatter.description, `Missing frontmatter description in ${filePath}`);
    assert(frontmatter.name === expectedName, `Frontmatter name mismatch in ${filePath}`);

    if (expectedTitle) {
        assert(markdown.includes(`# ${expectedTitle}\n`), `Missing H1 title in ${filePath}`);
    }

    for (const section of requiredSections) {
        assert(markdown.includes(section), `Missing required section "${section}" in ${filePath}`);
    }

    const steps = extractNumberedSteps(markdown);
    assert(steps.length >= minStepCount, `Expected at least ${minStepCount} implementation steps in ${filePath}`);
    if (expectedStepCount !== undefined) {
        assert(
            steps.length === expectedStepCount,
            `Expected ${expectedStepCount} implementation steps in ${filePath}, found ${steps.length}`
        );
    }
}

export function renderGeneratedSkillMarkdown(input: GeneratedSkillMarkdownInput): string {
    return `---
name: ${input.skillName}
description: ${clean(input.description)}
---

# ${input.title}

## Why This Skill Exists
${clean(input.reason)}

## When To Use
${clean(input.whenToUse)}

## Step-by-Step Implementation Guide
${renderNumberedList(input.implementationGuide)}

## Required Deliverables
${renderBulletList(input.requiredDeliverables)}

## Operational Runbook
### Preflight
${renderBulletList(input.runbook.preflight)}

### Execution
${renderBulletList(input.runbook.execution)}

### Recovery
${renderBulletList(input.runbook.recovery)}

### Handoff
${renderBulletList(input.runbook.handoff)}

## Guardrails
${renderBulletList(input.guardrails)}
`;
}

export function renderNumberedList(items: string[]): string {
    return items.map((item, index) => `${index + 1}. ${clean(item)}`).join('\n');
}

export function renderBulletList(items: string[]): string {
    if (items.length === 0) return '- None specified.';
    return items.map((item) => `- ${clean(item)}`).join('\n');
}

function clean(value: string): string {
    return String(value || '').replace(/\s+/g, ' ').trim();
}

function assert(condition: unknown, message: string): asserts condition {
    if (!condition) throw new Error(message);
}
