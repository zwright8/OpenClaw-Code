---
name: expeditionary-prime-power-generator-maintenance-and-load-balance-cell
description: Coordinate expeditionary generator maintenance, prime-power dispatch, and load-balance recommendations for U.S. warfighters. Use when base resilience, repair backlog, or fuel-constrained electrical demand could degrade mission continuity.
---

# Expeditionary Prime Power Generator Maintenance And Load Balance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter expeditionary power generation, maintenance, and electrical prioritization decisions.
- Confirm node layout, generation assets, load priorities, maintenance backlog, fuel posture, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with generator health, load demand, fuel burn, spare-parts posture, and priority-of-life or mission-essential circuits.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in power continuity, repair tempo, fuel consumption, and force protection.
3. Identify branch triggers for load shedding, black-start, cross-tie shifts, generator swap-outs, and contractor or allied support.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and engineer decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: generator readiness board, load-balance ladder, and mission-power restoration matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-prime-power-generator-load-balance-v1` with `protocol_stack_id=ps-expeditionary-prime-power-generator-load-balance-stack-v1`.
- Alternate: select a mission-adjacent energy or sustainment suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual load board with daily meter readback, paper maintenance ledger, and commander-approved priority circuits only.

## Domain Packet Defaults

- Default packet ID: `DPL-PRIME-POWER-GENERATOR-LOAD-BALANCE-001`.
- Preferred `toolchain_id=TC-POWER-137` and `toolchain_profile_id=prime-power-generator-load-balance-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: generator dispatch board, load-balance monitor, fuel burn tracker, and maintenance parts queue.
- Preferred protocol profiles for coordination and machine exchange: `OPC UA`, signed maintenance manifests, `OGC`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If electrical telemetry, load priority authority, or maintenance-release data is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag overload risk, fuel shortfall, electrical backfeed hazards, and repair-part uncertainty before recommending action.
- Do not fabricate telemetry, maintenance clearance, or electrical authority.
