---
name: expeditionary-solar-microgrid-camouflage-and-signature-cell
description: Plan expeditionary solar microgrid employment that reduces thermal, visual, and RF signatures while preserving mission power continuity.
---

# Expeditionary Solar Microgrid Camouflage And Signature Cell

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

Primary products for this skill: signature-aware microgrid placement matrix, load and storage survivability ladder, camouflage sustainment plan.

## U.S. Warfighter Employment Notes

- Prioritize mission assurance, coalition interoperability, and degraded-mode continuity in this domain.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select a concrete `tool_suite_id` and `protocol_stack_id`.
- Include `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.
- Include one `packet_id` from `../_shared/references/domain-tool-packet-library.md` for each critical recommendation.
- For this domain, prioritize `ts-solar-microgrid-signature-control-v1` with `ps-solar-microgrid-signature-control-stack-v1` and `DPL-SOLAR-MICROGRID-SIGNATURE-CONTROL-001`.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- If authority or data provenance is uncertain, downgrade to advisory-only and require human command approval.
