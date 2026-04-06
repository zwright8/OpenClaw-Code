---
name: joint-commissary-exchange-subsistence-and-hygiene-priority-restoration-cell
description: Restore commissary, exchange, subsistence, and hygiene-item access for warfighters and dependents after attack, disaster, supply shock, or installation isolation. Use when retail support continuity directly affects U.S. warfighter family stability, morale, or readiness.
---

# Joint Commissary Exchange Subsistence And Hygiene Priority Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter commissary, exchange, and essential-retail restoration decisions.
- Confirm affected installations, stock posture, protected populations, transport constraints, refrigeration status, and commander decision timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using retail-site status, essential-item shortages, supply-line disruptions, protected populations, and morale or readiness effects.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, equity, cold-chain risk, and logistics burden.
3. Identify branch triggers for rationing, mobile retail activation, cross-leveling, refrigeration failure, and austere distribution fallback.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and essential-retail continuity trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: essential-retail priority matrix, subsistence and hygiene allocation board, and emergency retail support packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-commissary-exchange-subsistence-hygiene-restoration-v1` with `protocol_stack_id=ps-joint-commissary-exchange-subsistence-hygiene-restoration-stack-v1`.
- Alternate: select a mission-adjacent logistics, shelter-support, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual essential-retail ration board with commander-approved priorities and no unsupported resupply estimates.

## Domain Packet Defaults

- Default packet ID: `DPL-COMMISSARY-EXCHANGE-HYGIENE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: commissary stock board, exchange essential-item inventory, cold-storage monitor, and protected-population distribution planner.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `GS1/EPCIS`, signed supply notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If inventory fidelity, rationing authority, or protected-population prioritization is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag inequitable distribution, cold-storage spoilage, hygiene shortfalls, and unsupported restoration claims before recommending action.
- Do not fabricate stock levels, refrigeration status, or retail-reopening approvals.
