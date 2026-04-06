---
name: strategic-defense-industrial-workforce-family-stabilization-cell
description: Preserve strategic defense-industrial output by stabilizing family, housing, transport, and emergency-service disruptions affecting critical cleared or specialized workers. Use when commanders or staffs must link industrial workforce continuity to warfighting readiness with explicit tool and protocol bindings.
---

# Strategic Defense Industrial Workforce Family Stabilization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter industrial-workforce stabilization decisions that affect strategic production and depot throughput.
- Confirm affected plants or depots, workforce dependencies, family-support gaps, transport constraints, and production priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using workforce attendance, family-support disruptions, housing or transport friction, and production criticality.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in output, workforce trust, equity, and security.
3. Identify branch triggers for emergency childcare, shuttle support, housing assistance, shift redesign, and billet cross-leveling.
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

Primary products: workforce-family stabilization board, production-risk ladder, and emergency support allocation tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-defense-industrial-workforce-family-stabilization-v1` with `protocol_stack_id=ps-strategic-defense-industrial-workforce-family-stabilization-stack-v1`.
- Alternate: select a mission-adjacent industrial, family-readiness, or transportation-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual critical-worker roster with command-approved support priorities and no unsupported assumption about workforce availability.

## Domain Packet Defaults

- Default packet ID: `DPL-INDUSTRIAL-WORKFORCE-FAMILY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: critical-worker ledger, family-support demand tracker, shuttle or lodging allocator, and production-priority board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed workforce manifests, `API/JSON`, `S/MIME`, `OPC UA`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If workforce data, support-resource availability, or production-reprioritization authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag burnout risk, family-support inequity, transport fragility, and production single-point failures before recommending action.
- Do not fabricate workforce status, support capacity, or production-authority approvals.
