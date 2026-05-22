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

test('auditWarfighterSkillMarkdown flags fires and ROE combat-control metadata', () => {
    const markdown = `---
name: coalition-fires-clearance-and-digital-roe-cell
description: Support coalition fires clearance, digital ROE synchronization, and fire-control governance for strike execution.
---

# Coalition Fires Clearance And Digital ROE Cell

## Mission Scope

- Treat this skill as advisory only.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/coalition-fires-clearance-and-digital-roe-cell/SKILL.md',
        markdown
    });

    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-fires-or-strike'));
    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-roe-or-fire-control'));
});

test('auditWarfighterSkillMarkdown flags target-validation and retargeting metadata', () => {
    const markdown = `---
name: joint-precision-fires-data-lineage-and-retargeting-cell
description: Support target validation, retargeting decisions, and strike authorization when sensor disagreement affects fires execution.
---

# Joint Precision Fires Data Lineage And Retargeting Cell

## Mission Scope

- Treat this skill as advisory only.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/joint-precision-fires-data-lineage-and-retargeting-cell/SKILL.md',
        markdown
    });

    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-targeting'));
    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-fires-or-strike'));
});

test('auditWarfighterSkillMarkdown flags ISR and electronic-warfare metadata', () => {
    const markdown = `---
name: isr-collection-and-sensor-tasking
description: Design ISR collection strategies, sensor tasking plans, and electronic warfare mission-data reprogramming for contested environments.
---

# ISR Collection And Sensor Tasking

## Mission Scope

- Treat this skill as advisory only.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/isr-collection-and-sensor-tasking/SKILL.md',
        markdown
    });

    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-isr-or-ew'));
});

test('auditWarfighterSkillMarkdown flags combat-function drift inside support skill bodies', () => {
    const markdown = `---
name: after-action-review-analyst
description: Run structured AAR analysis and improvement tracking for training, readiness, and corrective-action coordination.
---

# After Action Review Analyst

## Mission Scope

- Treat this skill as a noncombat support aid.

## Workflow

1. Build tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
2. Integrate dependencies across joint functions: command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.

## Required Inputs

- Event timeline and participant feedback.

## Required Output Format

1. Situation snapshot

## External Tools and Protocol Integration

- Use approved source systems only.

## Interoperability Validation Checklist

- Validate the final packet.

## Failure Handling

- If evidence is incomplete, publish a degraded-mode packet.

## Guardrails

- Do not fabricate evidence.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/after-action-review-analyst/SKILL.md',
        markdown
    });

    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-support-body-combat-functions'));
    assert.ok(report.prohibitedFindings.some((finding) => finding.ruleId === 'prohibited-support-body-force-posture'));
    assert.equal(report.structuralFindings.length, 0);
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

test('auditWarfighterSkillMarkdown accepts noncombat AAR/IP support content', () => {
    const markdown = `---
name: after-action-review-analyst
description: Convert exercise, maintenance, cyber-defense, or disaster-response evidence into a structured AAR/IP with tracked corrective actions.
---

# After Action Review Analyst

## Problem Statement

- Turn observations into validated corrective actions with owners and closure evidence.

## Mission Scope

- Treat this skill as a noncombat support aid for training, readiness, maintenance, disaster response, medical administration, cyber defense, and communications recovery.

## Workflow

1. Compare expected outcomes, observed outcomes, and evidence quality.
2. Build a sustain/improve register with owners, suspense, and validation steps.

## Required Inputs

- Event identifier, UTC window, objective list, source records, and action tracker state.

## Required Output Format

1. Event snapshot
2. Observation table
3. Improvement plan

## External Tools and Protocol Integration

- Pull source records from approved APIs, CSV exports, or STIX/TAXII collections and normalize them into a single evidence table.

## Interoperability Validation Checklist

- Verify every finding maps to an objective, source record, owner, and closure method.

## Failure Handling

- If a system-of-record is unavailable, mark the draft provisional and assign a revalidation deadline.

## Guardrails

- Do not use this skill for targeting, fires, force-employment planning, or battle tracking.
`;

    const report = auditWarfighterSkillMarkdown({
        skillPath: 'skills/warfighter/after-action-review-analyst/SKILL.md',
        markdown
    });

    assert.equal(report.prohibitedFindings.length, 0);
    assert.equal(report.structuralFindings.length, 0);
});
