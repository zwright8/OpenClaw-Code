---
name: joint-aircraft-hydraulic-contamination-and-servicing-cell
description: Coordinate aircraft hydraulic fluid contamination response, servicing release, and component isolation decisions for U.S. warfighters. Use when degraded hydraulic systems threaten flight controls, maintenance recovery, or cross-fleet serviceability.
---

# Joint Aircraft Hydraulic Contamination And Servicing Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter hydraulic-contamination response, servicing release, and component-isolation decisions.
- Confirm supported aircraft, maintenance authority, contamination evidence, parts posture, and sortie timeline before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with fluid sample status, affected systems, servicing history, failure symptoms, and sortie demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in flight safety, maintenance tempo, parts burn, and mission availability.
3. Identify branch triggers for component isolation, system flush, cannibalization, and no-fly release.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and maintenance decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: hydraulic contamination isolation board, servicing release matrix, and component quarantine ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aircraft-hydraulic-contamination-servicing-v1` with `protocol_stack_id=ps-joint-aircraft-hydraulic-contamination-servicing-stack-v1`.
- Alternate: a mission-adjacent airframe maintenance suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Degraded: no-fly or reduced-maneuver posture with manual sampling logs and protected maintenance readback only.

## Domain Packet Defaults

- Default packet ID: `DPL-AIRCRAFT-HYDRAULIC-CONTAMINATION-001`.
- Preferred `toolchain_id=TC-HYD-153` and `toolchain_profile_id=aircraft-hydraulic-contamination-servicing-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: hydraulic fluid sampling board, contamination-control ledger, component isolation tracker, and servicing release board.
- Preferred protocol profiles for coordination and machine exchange: signed maintenance manifests, `AIXM/FIXM`, `OPC UA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If contamination evidence, maintenance release authority, or component pedigree is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unverified contamination sources, unsafe servicing assumptions, and flight-control risk before recommending action.
- Do not fabricate maintenance releases, sample results, or safe-to-fly determinations.
