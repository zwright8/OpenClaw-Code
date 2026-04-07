---
name: strategic-defense-industrial-workforce-clearance-and-assignment-cell
description: Coordinate clearance reciprocity, credentialing, and assignment of scarce defense-industrial labor when U.S. warfighter production and repair capacity depend on trusted workforce placement across depots, shipyards, and missile plants.
---

# Strategic Defense Industrial Workforce Clearance And Assignment Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm workforce authority, clearance policy, facility priorities, and production deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with billet demand, workforce availability, clearance status, credential constraints, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, security risk, training burden, and strategic resilience.
3. Identify branch triggers for reciprocity, cross-leveling, provisional assignment, retraining, or billet hold decisions.
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

Primary products: workforce clearance matrix, billet fill ladder, and industrial surge queue.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-defense-industrial-workforce-clearance-assignment-v1` with `protocol_stack_id=ps-strategic-defense-industrial-workforce-clearance-assignment-stack-v1`.
- Alternate: select a mission-adjacent industrial-mobilization, depot-readiness, or workforce suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential billets only with manual reciprocity checks and time-boxed provisional assignment.

## Domain Packet Defaults

- Default packet ID: `DPL-INDUSTRIAL-WORKFORCE-CLEARANCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: cleared workforce registry, industrial workload board, and reciprocity adjudication tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed workforce manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If clearance validity, credential status, or assignment authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag insider-risk exposure, credential gaps, billet mismatch, and production-latency consequences before recommending action.
- Do not fabricate clearance status, credential reciprocity, or assignment approvals.

## Domain Toolchain Override (2026-04-06, Expansion Wave LXVIII Addendum)

- Add `tool_suite_id=ts-strategic-defense-industrial-workforce-family-stabilization-v1` + `protocol_stack_id=ps-strategic-defense-industrial-workforce-family-stabilization-stack-v1` when clearance and assignment recommendations depend on emergency childcare, transport support, or housing relief that preserves critical-worker attendance.
- Add `tool_suite_id=ts-strategic-military-housing-utility-safety-restoration-v1` + `protocol_stack_id=ps-strategic-military-housing-utility-safety-restoration-stack-v1` when billet fill rates or protected-worker availability depend on nearby housing safety, utility recovery, or relocation support.
- Add `tool_suite_id=ts-theater-allied-civilian-contractor-readiness-force-protection-v1` + `protocol_stack_id=ps-theater-allied-civilian-contractor-readiness-force-protection-stack-v1` when mixed civilian or allied contractor support affects industrial throughput, site protection, or surge assignment confidence.
- Add `packet_id=DPL-INDUSTRIAL-WORKFORCE-FAMILY-001`, `packet_id=DPL-HOUSING-UTILITY-SAFETY-001`, and `packet_id=DPL-CONTRACTOR-READINESS-FP-001` for branches that materially alter workforce availability, site-protection posture, or production-readiness confidence.
