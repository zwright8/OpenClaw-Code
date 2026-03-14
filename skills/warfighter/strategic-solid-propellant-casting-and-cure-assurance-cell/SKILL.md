---
name: strategic-solid-propellant-casting-and-cure-assurance-cell
description: Coordinate strategic solid-propellant casting, cure scheduling, and lot-release assurance. Use when motor production, recertification, or industrial recovery depends on scarce mix, mold, or environmental-control capacity.
---

# Strategic Solid Propellant Casting And Cure Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm release authority, explosive-safety constraints, plant capacity, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with casting backlog, cure-capacity status, precursor availability, lot holds, and mission demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, safety, throughput, and industrial fragility.
3. Identify branch or sequel triggers, scrap or rework thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: casting queue ladder, cure-capacity priority matrix, and lot-release confidence brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-solid-propellant-casting-cure-assurance-v1` with `protocol_stack_id=ps-strategic-solid-propellant-casting-cure-assurance-stack-v1`.
- Alternate: `tool_suite_id=ts-strategic-supply-shock-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: deterrence-critical lot focus with manual environmental logging, dual-approval batch release, and explicit scrap or rework holds.

## Domain Packet Defaults

- Default packet ID: `DPL-SOLID-PROPELLANT-CASTING-CURE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: batch and cure ledger, environmental-control monitor, and lot-release governance board.
- Preferred protocol profiles for coordination and machine exchange: signed lot manifests, `OPC UA`, `API/JSON`, `USMTF`, and `NIEM`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, lot pedigree, or environmental evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag explosive-safety, workforce, environmental-control, and strategic-demand constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
