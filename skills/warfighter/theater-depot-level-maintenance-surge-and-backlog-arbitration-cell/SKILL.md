---
name: theater-depot-level-maintenance-surge-and-backlog-arbitration-cell
description: Prioritize depot induction, repair backlog burn-down, and cross-theater maintenance flow when U.S. warfighter readiness depends on scarce depot capacity. Use when sustainers need explicit backlog triage, throughput tradeoffs, and readiness-return sequencing.
---

# Theater Depot Level Maintenance Surge And Backlog Arbitration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm depot authorities, readiness priorities, materiel categories, and production deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with backlog size, induction demand, parts constraints, labor availability, and readiness priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, readiness return, transport burden, and quality risk.
3. Identify branch or sequel triggers for surge shifts, cross-leveling, hold decisions, or reallocation of depot slots.
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

Primary products: depot backlog arbitration board, induction priority matrix, and readiness return forecast.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-depot-maintenance-surge-backlog-arbitration-v1` with `protocol_stack_id=ps-theater-depot-maintenance-surge-backlog-arbitration-stack-v1`.
- Alternate: select a mission-adjacent maintenance-readiness, industrial-mobilization, or logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual backlog board with command-approved induction caps, UTC acknowledgment logging, and paper release packets.

## Domain Packet Defaults

- Default packet ID: `DPL-DEPOT-MAINT-SURGE-BACKLOG-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: depot backlog board, induction scheduler, parts-constraint tracker, and readiness demand planner.
- Preferred protocol profiles for coordination and machine exchange: signed work-order manifests, `NIEM`, `OPC UA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If backlog data, readiness demand, or surge authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag safety, airworthiness, certification, transport-latency, and labor-capacity risks before recommending action.
- Do not fabricate depot throughput, parts availability, or release authority.
