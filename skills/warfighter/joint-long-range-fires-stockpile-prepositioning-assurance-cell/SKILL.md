---
name: joint-long-range-fires-stockpile-prepositioning-assurance-cell
description: Support prepositioning assurance for long-range fires stockpiles across distributed theaters. Use when munition positioning, transport risk, and launch timing must be balanced under threat.
---

# Joint Long-Range Fires Stockpile Prepositioning Assurance Cell

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

Primary products for this skill: stockpile prepositioning matrix, launch-support throughput timeline, contested movement branch plan.

## U.S. Warfighter Employment Notes

- Prioritize survivable munition posture and reload continuity while controlling exposure to strike, sabotage, and transportation chokepoints.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select a concrete `tool_suite_id` and `protocol_stack_id`.
- Include `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.
- Include one `packet_id` from `../_shared/references/domain-tool-packet-library.md` for each critical recommendation.
- For this domain, prioritize `tool_suite_id=ts-long-range-fires-stockpile-assurance-v1` with `protocol_stack_id=ps-long-range-fires-stockpile-assurance-stack-v1` and `DPL-LONG-RANGE-FIRES-STOCKPILE-ASSURANCE-001`.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- If authority or data provenance is uncertain, downgrade to advisory-only and require human command approval.
