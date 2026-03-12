---
name: joint-hypersonic-strike-window-and-civil-warning-deconfliction-cell
description: Support U.S. warfighter planning and decision support for hypersonic strike timing, warning-system synchronization, and civil-risk deconfliction under compressed timelines.
---

# Joint Hypersonic Strike Window and Civil Warning Deconfliction Cell

## Mission Scope

- Treat this skill as planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm echelon, operating environment, authorities, timeline, and decision points before analysis.
- Keep products unclassified by default unless handling guidance is explicitly provided.

## Workflow

1. Frame the mission problem using current intent, threat indicators, operational constraints, and known assumptions.
2. Define measurable objectives, risk thresholds, branch conditions, and invalidation indicators.
3. Build one recommended option plus at least two alternatives with explicit tradeoffs in tempo, survivability, sustainment, and escalation risk.
4. Integrate dependencies across command and control, movement/maneuver, fires/effects, intelligence, protection, sustainment, and information.
5. Convert recommendations into staff-action outputs with owners, suspense dates, and branch triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option and rationale.
3. Alternative options with trigger conditions.
4. Decision points now/later/pre-delegated.
5. Staff tasking with owner and deadline.

## Domain Products

Primary products for this skill: strike-window synchronization matrix, civil-warning latency ladder, authority-gated launch deconfliction packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: hypersonic timeline adjudicators, civil warning relay health boards, strategic effects risk scorers.

## External Tools and Protocol Integration

- Use integration baseline in ../_shared/references/external-tools-protocols.md and select concrete systems-of-record.
- Use protocol examples in ../_shared/references/tool-protocol-playbooks.md to produce operator-ready tool packets.
- Use at least one primary source and one cross-check source before final recommendation.
- Prefer protocol families: USMTF, Link 16 J-series, CAP, NIEM, API/JSON.
- Include provenance metadata: source system, refresh time (UTC), assumptions, and confidence.

## Interoperability Validation Checklist

- Run ../_shared/references/mission-assurance-checklist.md before release.
- Ensure each product includes source provenance, protocol/message format, UTC refresh time, confidence, and known gaps.
- If checks fail, provide degraded-mode fallback and required staff coordination.

## Tool Invocation Contract

- For each tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback.
- Map tool outputs directly to commander decision points.
- If a tool is unavailable, provide manual workaround with time and confidence impact.

## Guardrails

- Flag assumptions that exceed available evidence.
- Identify legal/policy/ROE/safety/coalition constraints early.
- Separate facts, assessments, and unknowns.
- Do not fabricate sources, authorities, or approvals.
- Require explicit human command approval for recommendations that could alter mission posture or escalation risk.

## Core Shared References

- ../_shared/references/domain-tool-packet-library.md
- ../_shared/references/joint-mission-data-contracts.md
- ../_shared/references/human-agent-command-escalation-matrix.md
- ../_shared/references/warfighter-tool-authority-gates.md
- ../_shared/references/cross-domain-integration-playbook.md
- ../_shared/references/warfighter-external-tool-and-protocol-catalog.md

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-joint-hypersonic-strike-civil-warning-deconfliction-v1 with protocol_stack_id=ps-joint-hypersonic-strike-civil-warning-deconfliction-stack-v1.
- Alternate: tool_suite_id=ts-strategic-deterrence-v1 with protocol_stack_id=ps-strategic-deterrence-stack-v1.
- Degraded: authenticated voice/readback plus UTC acknowledgment ledger and manual fallback board.

## Domain Packet Defaults

- Default packet IDs: DPL-HYPERSONIC-CIVWARN-DECONF-001, DPL-HYPERSONIC-CIVWARN-DECONF-002.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.

## Operational Execution Hardening

- Require ack_chain_status=verified for mission-critical exchanges before posture-changing recommendations.
- Require trust_score >= 0.80 for each primary external dependency, else elevate alternate stack and mark outputs provisional.
- Include a final command-ready line: GO, NO-GO, or GO-WITH-CONSTRAINTS with rationale tied to authority and protocol checks.
