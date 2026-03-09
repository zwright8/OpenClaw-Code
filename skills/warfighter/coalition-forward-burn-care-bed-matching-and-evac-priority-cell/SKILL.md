---
name: coalition-forward-burn-care-bed-matching-and-evac-priority-cell
description: Coordinate coalition burn-care bed matching and evacuation sequencing under high casualty surge. Use when specialty care bottlenecks require cross-theater medical brokerage.
---

# Coalition Forward Burn-Care Bed Matching and Evac Priority Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter missions.
- Confirm echelon, authorities, timeline, and decision owner before recommending options.
- Keep outputs unclassified by default unless user-provided handling guidance changes that.

## Workflow

1. Frame the mission problem with: burn casualty profile, burn center capacity, transport risk, coalition caveats.
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

Primary products for this skill: burn-bed matching board, evac priority ladder, treatment continuity branch plan.

## U.S. Warfighter Employment Notes

- Reduce preventable mortality by matching severity to specialty care timelines and transport survivability.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select a concrete `tool_suite_id` and `protocol_stack_id`.
- Include `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.
- Include one `packet_id` from `../_shared/references/domain-tool-packet-library.md` for each critical recommendation.
- For this domain, prioritize ts-burn-care-bed-broker-v1 with ps-burn-care-bed-broker-stack-v1.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- If authority or data provenance is uncertain, downgrade to advisory-only and require human command approval.
