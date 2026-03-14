---
name: joint-commercial-satellite-imagery-denial-and-retask-governance-cell
description: Govern fallback imagery collection when commercial access is denied, degraded, or reprioritized. Use when commanders need trusted ISR continuity without losing legal, contractual, or coalition release control.
---

# Joint Commercial Satellite Imagery Denial And Retask Governance Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm named areas, collection authorities, commercial constraints, alternate ISR sources, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the denied-imagery problem with affected named areas, timelines, alternate sensors, and release constraints.
2. Build retask, defer, substitute, hold, and coalition-share branches with explicit awareness and timing tradeoffs.
3. Bind each recommendation to concrete collection-broker, retask, and priority-adjudication tools plus packetized outputs.
4. Publish degraded-mode branches when collection authority, alternate coverage, or releasability confidence falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended collection branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Imagery-retask packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: imagery retask matrix, denial-impact ledger, and collection-priority release board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-commercial-sat-imagery-retask-governance-v1` with `protocol_stack_id=ps-joint-commercial-sat-imagery-retask-governance-stack-v1`.
- Alternate: manual retask queue plus national-ISR crosswalk worksheet.
- Degraded: critical named areas only with commander-approved reprioritization.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-COMMERCIAL-SAT-IMAGERY-RETASK-001` for critical recommendations.
- Prioritize these protocol families for this domain: `STANAG 4559`, `OGC`, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, collection constraints, and unresolved coverage gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run collection-authority and releasability checks from `../_shared/references/mission-assurance-checklist.md`.
- If tasking authority, contractual access, or alternate coverage is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate access to commercial imagery, collection rights, or classified sources.
- Separate observed denial or delay from inferred political intent.
- Surface legal, contractual, coalition-sharing, and privacy constraints early.
