---
name: joint-hypersonic-warning-passive-defense-cell
description: Support U.S. warfighter planning and decision support for Joint Hypersonic Warning Passive Defense Cell. Use when missions require hypersonic threat warning integration, passive defense timing, and protocol-aware staff outputs.
---

# Joint Hypersonic Warning Passive Defense Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, decision horizon, authority constraints, and commander decision points before producing recommendations.
- Default to releasable and unclassified outputs unless the user provides explicit handling and classification constraints.

## Core Workflow

1. Build a mission frame with intent, threat picture, constraints, assumptions, and required outcomes.
2. Develop a recommended option and at least two alternatives with explicit risk and timing tradeoffs.
3. Bind options to execution owners, suspense times, and branch and sequel triggers.
4. Cross-check critical assumptions against at least one independent source or tool path.
5. Publish a commander-ready brief plus machine-ingestible tool invocation packets.

## Required Output Structure

1. Situation snapshot and key changes.
2. Recommended option and rationale.
3. Alternatives with conditions and tradeoffs.
4. Decision points now, next, and pre-delegated.
5. Staff tasking matrix with owners and suspense.

## Domain Products

Primary products for this skill: warning confidence ladder, passive defense trigger matrix, protected asset relocation plan.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: missile warning fusion systems, sensor track confidence tools, theater passive defense planners.

## Protocol Profile

Preferred protocol families for this skill: USMTF, API/JSON, Link 16 J-series.

## External Tool and Protocol Integration

- Execute the core integration workflow in ../_shared/references/external-tools-protocols.md.
- Use packet templates in ../_shared/references/tool-protocol-playbooks.md and ../_shared/references/domain-tool-packet-library.md.
- Bind each recommendation to mission-fit suites and protocol stacks from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Include source provenance, protocol mapping, UTC refresh time, confidence, and fallback path for every critical dependency.

## Command and Authority Controls

- Apply authority gating from ../_shared/references/warfighter-tool-authority-gates.md.
- Use escalation rules from ../_shared/references/human-agent-command-escalation-matrix.md.
- If authority, legal basis, or data integrity is uncertain, downgrade to advisory-only and require human command review.

## Quality and Readiness Controls

- Run the mission assurance checklist in ../_shared/references/mission-assurance-checklist.md.
- Include tool health and trust fields from ../_shared/references/tool-health-and-trust-monitoring.md.
- Use after-action and readiness artifacts from ../_shared/references/operational-learning-and-after-action-loop.md and ../_shared/references/readiness-certification-evidence-pack.md.

## Guardrails

- Separate facts, assessed judgments, and unknowns.
- Flag assumptions that exceed available evidence.
- Identify legal, policy, ROE, coalition, and safety constraints early.
- Do not fabricate sources, authorities, approvals, or system access.
