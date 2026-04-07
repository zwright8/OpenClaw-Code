---
name: homeland-governor-request-for-forces-and-mission-assignment-cell
description: Translate governor requests for forces into auditable mission-assignment options, sourcing choices, and approval paths. Use when commanders need clear domestic support recommendations tied to authorities, timing, and capability availability.
---

# Homeland Governor Request For Forces And Mission Assignment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter request-for-forces, mission-assignment, and sourcing decisions in domestic operations.
- Confirm requesting authority, requested capabilities, mission-assignment status, sourcing windows, and approval thresholds before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using requested effects, unmet civil requirements, available force packages, authority limits, and decision timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in responsiveness, legal sufficiency, readiness impact, and cost.
3. Identify branch triggers for immediate-response use, mission-assignment approval, force substitution, and unmet-request escalation.
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

Primary products: request-for-forces decision ladder, mission-assignment tracker, and sourcing-options board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-governor-request-for-forces-mission-assignment-v1` with `protocol_stack_id=ps-homeland-governor-request-for-forces-mission-assignment-stack-v1`.
- Alternate: select a mission-adjacent DSCA, mobilization, or fiscal-authority suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual request ledger with advisory-only sourcing options until authority and mission-assignment status are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-GOV-RFF-MISSION-ASSIGNMENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: request tracker, capability-sourcing board, authority review matrix, and mission-assignment status dashboard.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed request packets, `NIMS/ICS`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If request legitimacy, mission-assignment funding, or sourcing authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported capability promises, authority gaps, hidden readiness costs, and mission-assignment timing risk before recommending action.
- Do not fabricate governor requests, mission assignments, sourcing commitments, or legal approval.
