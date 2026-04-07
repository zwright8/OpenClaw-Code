import fs from 'fs';
import path from 'path';
import {
    buildSkillRolloutPlan,
    loadAllSkillImplementations,
    rolloutPlanToTasks,
    type SkillRolloutPlan
} from '../skills/runtime/index.js';

const REPO_ROOT = process.cwd();
const GENERATED_ROOT = path.join(REPO_ROOT, 'skills', 'generated');
const PLAN_JSON_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-plan.json');
const PLAN_MARKDOWN_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-plan.md');
const TASKS_JSON_PATH = path.join(GENERATED_ROOT, 'runtime.rollout-tasks.json');

function escapeCell(value: string): string {
    return value.replace(/\|/g, '\\|');
}

function renderMarkdown(plan: SkillRolloutPlan): string {
    const lines: string[] = [];

    lines.push('# Skill Runtime Rollout Plan');
    lines.push('');
    lines.push(`Generated: ${plan.generatedAt}`);
    lines.push('');
    lines.push('## Scenarios');
    lines.push('| Scenario | Weight |');
    lines.push('| --- | --- |');
    for (const scenario of plan.scenarios) {
        lines.push(`| ${scenario.name} | ${scenario.weight} |`);
    }
    lines.push('');
    lines.push('## Lane Summary');
    lines.push(`- Total skills: ${plan.totalSkills}`);
    lines.push(`- Now lane: ${plan.summary.laneCounts.now}`);
    lines.push(`- Next lane: ${plan.summary.laneCounts.next}`);
    lines.push(`- Hold lane: ${plan.summary.laneCounts.hold}`);
    lines.push('');
    lines.push('## Top Domains');
    lines.push('| Domain | Count |');
    lines.push('| --- | --- |');
    for (const entry of plan.summary.topDomains.slice(0, 12)) {
        lines.push(`| ${escapeCell(entry.domain)} | ${entry.count} |`);
    }
    lines.push('');
    lines.push('## Top Archetypes');
    lines.push('| Archetype | Count |');
    lines.push('| --- | --- |');
    for (const entry of plan.summary.topArchetypes.slice(0, 12)) {
        lines.push(`| ${escapeCell(entry.archetype)} | ${entry.count} |`);
    }
    lines.push('');
    lines.push('## Entry Matrix');
    lines.push('| Skill ID | Skill Name | Lane | Readiness | Risk | Archetype | Feature Flag | Reasons |');
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const entry of plan.entries) {
        lines.push(
            `| ${entry.skillId} | \`${entry.skillName}\` | ${entry.lane} | ${entry.readinessIndex} | ` +
            `${entry.riskIndex} | ${escapeCell(entry.archetype)} | \`${entry.featureFlag}\` | ` +
            `${escapeCell(entry.reasons.join('; '))} |`
        );
    }
    lines.push('');

    return lines.join('\n');
}

function main() {
    const implementations = loadAllSkillImplementations(REPO_ROOT);
    if (implementations.length !== 1000) {
        throw new Error(`Expected 1000 skill implementations, found ${implementations.length}`);
    }

    const rolloutPlan = buildSkillRolloutPlan(implementations);
    const rolloutTasks = rolloutPlanToTasks(rolloutPlan);

    fs.writeFileSync(PLAN_JSON_PATH, `${JSON.stringify(rolloutPlan, null, 2)}\n`);
    fs.writeFileSync(PLAN_MARKDOWN_PATH, renderMarkdown(rolloutPlan));
    fs.writeFileSync(TASKS_JSON_PATH, `${JSON.stringify(rolloutTasks, null, 2)}\n`);

    console.log(
        `[plan-1000-skills-rollout] planned ${rolloutPlan.totalSkills} skills | ` +
        `now=${rolloutPlan.summary.laneCounts.now} ` +
        `next=${rolloutPlan.summary.laneCounts.next} ` +
        `hold=${rolloutPlan.summary.laneCounts.hold} ` +
        `tasks=${rolloutTasks.length}`
    );
}

main();
