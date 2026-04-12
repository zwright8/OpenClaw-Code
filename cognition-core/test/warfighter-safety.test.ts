import test from 'node:test';
import assert from 'node:assert/strict';
import { auditWarfighterSkillMarkdown } from '../../skills/runtime/index.js';

test('auditWarfighterSkillMarkdown flags prohibited targeting and CDE metadata', () => {
    const markdown = `---
name: joint-targeting-standards-and-cde-governance-cell
description: Support targeting standards governance, collateral damage estimate workflow assurance, and no-strike synchronization.
---

# Joint Targeting Standards and CDE Governance Cell

## Mission Scope

- Treat this skill as advisory only.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/joint-targeting-standards-and-cde-governance-cell/SKILL.md',
        markdown
    });

    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-targeting'));
});

test('auditWarfighterSkillMarkdown does not false-positive on lawful cyber attack-surface language', () => {
    const markdown = `---
name: theater-mission-network-failover-cell
description: Support cyber defense recovery, attack-surface review, and resilient communications restoration for mission continuity.
---

# Theater Mission Network Failover Cell

## Mission Scope

- Treat this skill as a noncombat support aid.

## Workflow

1. Assess the outage.

## Required Inputs

- Current network telemetry with UTC timestamps.
- Configuration backup status and credential scope.

## Required Output Format

1. Recovery plan

## Domain Tooling and Protocol Baseline

- Use network telemetry and configuration backups.

## Interoperability Validation Checklist

- Validate restored links and audit evidence.

## Failure Handling

- If primary telemetry is stale, downgrade to advisory-only and request manual confirmation.

## Guardrails

- Do not recommend offensive cyber activity.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/theater-mission-network-failover-cell/SKILL.md',
        markdown
    });

    assert.equal(report.prohibitedFindings.length, 0);
    assert.equal(report.structuralFindings.length, 0);
});

test('auditWarfighterSkillMarkdown reports structural gaps for lawful support skills missing sections', () => {
    const markdown = `---
name: maintenance-backlog-repair-readiness-cell
description: Coordinate maintenance repair backlog, parts readiness, and depot scheduling continuity.
---

# Maintenance Backlog Repair Readiness Cell

## Mission Scope

- Treat this skill as a noncombat support aid.

## Guardrails

- Do not fabricate maintenance status.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/maintenance-backlog-repair-readiness-cell/SKILL.md',
        markdown
    });

    assert.equal(report.prohibitedFindings.length, 0);
    assert.ok(report.structuralFindings.some((finding) => finding.ruleId === 'missing-workflow'));
    assert.ok(report.structuralFindings.some((finding) => finding.ruleId === 'missing-required-inputs'));
    assert.ok(report.structuralFindings.some((finding) => finding.ruleId === 'missing-tool-protocol'));
    assert.ok(report.structuralFindings.some((finding) => finding.ruleId === 'missing-validation'));
    assert.ok(report.structuralFindings.some((finding) => finding.ruleId === 'missing-failure-handling'));
});

test('auditWarfighterSkillMarkdown flags offensive combat-force-employment metadata', () => {
    const markdown = `---
name: offensive-counter-air-mission-planner
description: Build offensive counter-air plans to suppress or destroy adversary air capabilities under contested air defense.
---

# Offensive Counter Air Mission Planner

## Mission Scope

- Treat this skill as advisory only.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/offensive-counter-air-mission-planner/SKILL.md',
        markdown
    });

    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-combat-force-employment'));
});

test('auditWarfighterSkillMarkdown credits inline core inputs and degraded fallback evidence', () => {
    const markdown = `---
name: after-action-review-analyst
description: Run structured AAR analysis and improvement tracking for training, readiness, and corrective-action coordination.
---

# After Action Review Analyst

## Mission Scope

- Treat this skill as a noncombat support aid.

## Workflow

1. Frame the mission problem using these core inputs: event timeline, observed events, participant feedback, and readiness metrics.
2. Produce a commander-facing recommendation and a staff tracker.

## Required Output Format

1. Situation snapshot
2. Recommended option

## External Tools and Protocol Integration

- For each external tool recommendation, include required inputs, query template, output schema, transport protocol, and fallback path.

## Interoperability Validation Checklist

- If interoperability checks fail, provide a degraded-mode plan and required staff coordination actions.

## Guardrails

- Do not fabricate evidence.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/after-action-review-analyst/SKILL.md',
        markdown
    });

    assert.equal(report.prohibitedFindings.length, 0);
    assert.ok(!report.structuralFindings.some((finding) => finding.ruleId === 'missing-required-inputs'));
    assert.ok(!report.structuralFindings.some((finding) => finding.ruleId === 'missing-failure-handling'));
});
