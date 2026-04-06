---
name: homeland-emac-interstate-force-flow-synchronization-cell
description: Synchronize EMAC support, interstate staging, and cross-state force flow for domestic operations. Use when U.S. commanders need to deconflict military movement with emergency mutual-aid demand and reception constraints.
---

# Homeland EMAC Interstate Force Flow Synchronization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter interstate mutual-aid, staging, and domestic force-flow decisions.
- Confirm requesting states, EMAC terms, staging bases, route constraints, reception capacity, and command approval timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using supported states, incoming capabilities, staging nodes, route status, and mission priority.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, congestion, legal clarity, and sustainment burden.
3. Identify branch triggers for EMAC activation, staging overflow, convoy diversion, and reception-node failure.
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

Primary products: interstate force-flow matrix, staging and reception ladder, and EMAC support synchronization board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-emac-interstate-force-flow-synchronization-v1` with `protocol_stack_id=ps-homeland-emac-interstate-force-flow-synchronization-stack-v1`.
- Alternate: select a mission-adjacent DSCA, mobility, or evacuation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual interstate movement board with route-control checkpoints and no staging-node expansion without command review.

## Domain Packet Defaults

- Default packet ID: `DPL-EMAC-FORCE-FLOW-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: EMAC request tracker, staging-capacity board, convoy scheduler, and reception-node status dashboard.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `NIMS/ICS`, `CAP`, signed movement orders, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If EMAC validity, route authority, or reception accountability is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag cross-state credential gaps, convoy congestion, reimbursement ambiguity, and unsafe staging assumptions before recommending action.
- Do not fabricate EMAC acceptance, route clearance, or reception-node readiness.
