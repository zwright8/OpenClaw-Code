---
name: homeland-tsunami-port-closure-and-sealift-regeneration-cell
description: Coordinate homeland port shutdown, berth recovery, and sealift regeneration during tsunami-driven disruption. Use when military throughput depends on restoring safe port operations after surge warnings or damage.
---

# Homeland Tsunami Port Closure And Sealift Regeneration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter homeland-defense, sealift, and DSCA decisions during tsunami-driven port disruption.
- Confirm warning timelines, harbor status, cargo priorities, berth availability, and command relationships before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using tsunami warnings, berth and channel status, vessel queues, inland transload options, and throughput priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in crew safety, sealift recovery speed, cargo accountability, and onward movement.
3. Identify branch triggers for full shutdown, partial reopening, alternate-port diversion, and inland transload activation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: port-closure timeline, sealift regeneration ladder, and alternate-throughput branch plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-tsunami-port-closure-sealift-regeneration-v1` with `protocol_stack_id=ps-homeland-tsunami-port-closure-sealift-regeneration-stack-v1`.
- Alternate: select a mission-adjacent sealift, harbor-defense, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-TSUNAMI-PORT-112` and `toolchain_profile_id=tsunami-port-sealift-regeneration-v1`.
- Degraded: one protected berth or cargo flow at a time with manual harbor-master and command approval.

## Domain Packet Defaults

- Default packet ID: `DPL-TSUNAMI-PORT-SEALIFT-REGEN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: port-surge digital twin, berth-damage and channel survey board, and sealift regeneration scheduler.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `OGC`, `EDXL-DE/CAP`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If surge timing, berth safety, or closure authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag harbor-worker safety, damaged berths, channel-survey uncertainty, and cargo accountability gaps before recommending action.
- Do not fabricate warning timelines, hydrographic clearance, or port-release approvals.
