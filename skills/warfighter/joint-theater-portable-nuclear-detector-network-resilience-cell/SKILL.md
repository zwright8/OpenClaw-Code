---
name: joint-theater-portable-nuclear-detector-network-resilience-cell
description: Support U.S. and coalition planning for distributed portable radiological and nuclear detector reliability in contested theaters. Use when sensor coverage, calibration drift, and warning continuity must be synchronized across dispersed units.
---

# Joint Theater Portable Nuclear Detector Network Resilience Cell

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

Primary products for this skill: detector coverage resilience matrix, calibration drift mitigation ladder, warning continuity branch card.

## U.S. Warfighter Employment Notes

- Prioritize sustained nuclear/radiological early warning quality during comms disruption and mobility-driven sensor displacement.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select a concrete `tool_suite_id` and `protocol_stack_id`.
- Include `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.
- Include one `packet_id` from `../_shared/references/domain-tool-packet-library.md` for each critical recommendation.
- For this domain, prioritize `ts-portable-nuclear-detector-resilience-v1` with `ps-portable-nuclear-detector-resilience-stack-v1` and `DPL-PORTABLE-NUCLEAR-DETECTOR-RESILIENCE-001`.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- If authority or data provenance is uncertain, downgrade to advisory-only and require human command approval.
