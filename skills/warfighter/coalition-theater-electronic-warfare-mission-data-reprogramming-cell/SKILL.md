---
name: coalition-theater-electronic-warfare-mission-data-reprogramming-cell
description: Coordinate coalition electronic warfare mission-data reprogramming to keep emitter libraries and countermeasure sets current under contested timelines. Use when urgent reprogramming affects survivability or strike effectiveness.
---

# Coalition Theater Electronic Warfare Mission Data Reprogramming Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter missions.
- Confirm echelon, authorities, timeline, and decision owner before recommending options.
- Keep outputs unclassified by default unless user-provided handling guidance changes that.

## Workflow

1. Frame the mission problem with domain constraints, available resources, and threat indicators.
2. Identify assumptions, risk thresholds, and invalidation triggers.
3. Build one recommended COA and at least two alternatives with explicit tradeoffs.
4. Bind each recommendation to concrete tools, protocols, data freshness, and authority gates.
5. Produce commander summary plus staff action tracker with owners and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and branch triggers.
5. Staff tasking and suspense dates.

## Domain Products

Primary products for this skill: EW mission-data reprogram decision matrix, emitter-library update tracker, coalition validation handoff packet.

## U.S. Warfighter Employment Notes

- Prioritize rapid but controlled mission-data updates that preserve coalition interoperability and avoid fratricide in contested electromagnetic conditions.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select a concrete `tool_suite_id` and `protocol_stack_id`.
- Include `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.
- Include one `packet_id` from `../_shared/references/domain-tool-packet-library.md` for each critical recommendation.
- For this domain, prioritize `tool_suite_id=ts-ew-mission-data-reprogram-v1` with `protocol_stack_id=ps-ew-mission-data-reprogram-stack-v1` and `DPL-EW-MISSION-DATA-REPROGRAM-001`.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- If authority or data provenance is uncertain, downgrade to advisory-only and require human command approval.
