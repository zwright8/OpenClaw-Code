---
name: joint-aerial-refueling-fuel-contamination-isolation-and-reconstitution-cell
description: Coordinate aerial-refueling fuel isolation, contamination response, and tanker reconstitution. Use when sortie generation depends on restoring safe refueling capacity after fuel-quality or hardware failures.
---

# Joint Aerial Refueling Fuel Contamination Isolation And Reconstitution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter tanker recovery, fuel-integrity, and receiver-priority decisions.
- Confirm fuel sample status, tanker hardware posture, receiver demand, sortie deadlines, and release authority before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using contamination indicators, fuel-chain custody, tanker availability, receiver demand, and timeline pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in sortie support, contamination risk, hardware recovery, and mission delay.
3. Identify branch triggers for fuel quarantine, tanker swap, receiver reprioritization, and degraded refuel posture.
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

Primary products: fuel-isolation ladder, refuel-capacity recovery plan, and receiver-priority queue.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aerial-refueling-fuel-contamination-reconstitution-v1` with `protocol_stack_id=ps-joint-aerial-refueling-fuel-contamination-reconstitution-stack-v1`.
- Alternate: select a mission-adjacent tanker, fuel-quality, or air-tasking suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-REFUEL-CONTAM-111` and `toolchain_profile_id=aerial-refueling-fuel-contamination-reconstitution-v1`.
- Degraded: mission-essential refuel only with dual-source fuel confirmation and narrowed receiver release.

## Domain Packet Defaults

- Default packet ID: `DPL-AERIAL-REFUEL-FUEL-CONTAMINATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: fuel-quality ledger, tanker boom or drogue maintenance tracker, and receiver-priority refuel scheduler.
- Preferred protocol profiles for coordination and machine exchange: signed fuel manifests, `AIXM/FIXM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If contamination status, fuel-custody integrity, or tanker release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag contamination ambiguity, mixed-fuel risk, filter integrity gaps, and receiver-priority tradeoffs before recommending action.
- Do not fabricate fuel test results, aircraft availability, or release approvals.
