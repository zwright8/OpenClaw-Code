---
name: strategic-military-family-evacuation-and-safehaven-allocation-cell
description: Support U.S. military planning for dependent evacuation and safehaven allocation during major theater or homeland crises. Use when family movement, accountability, and shelter capacity must be synchronized with force generation needs.
---

# Strategic Military Family Evacuation And Safehaven Allocation Cell

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

Primary products for this skill: family evacuation phasing plan, safehaven capacity map, accountability and reunification tracker.

## U.S. Warfighter Employment Notes

- Prioritize force readiness by reducing dependent evacuation friction and preserving transparent accountability during fast-moving crises.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select a concrete `tool_suite_id` and `protocol_stack_id`.
- Include `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.
- Include one `packet_id` from `../_shared/references/domain-tool-packet-library.md` for each critical recommendation.
- For this domain, prioritize `ts-military-family-evac-safehaven-v1` with `ps-military-family-evac-safehaven-stack-v1` and `DPL-MILITARY-FAMILY-EVAC-SAFEHAVEN-001`.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- If authority or data provenance is uncertain, downgrade to advisory-only and require human command approval.

## Domain Toolchain Override (2026-04-07, Expansion Wave LXXIV Addendum)

- Add `toolchain_id=TC-CONSULAR-293`, `tool_suite_id=ts-theater-passport-visa-consular-safehaven-document-bridge-v1`, and `protocol_stack_id=ps-theater-passport-visa-consular-safehaven-document-bridge-stack-v1` when family evacuation or safehaven allocation depends on passport recovery, visa continuity, consular action, or host-nation document acceptance.
- Add `packet_id=DPL-PASSPORT-VISA-SAFEHAVEN-001` for branches that materially alter dependent movement timing, safehaven legitimacy, or commander confidence in protected relocation.
