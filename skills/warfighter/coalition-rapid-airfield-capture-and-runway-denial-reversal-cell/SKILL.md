---
name: coalition-rapid-airfield-capture-and-runway-denial-reversal-cell
description: Support coalition warfighter planning for rapid airfield seizure, denial reversal, and sortie restoration under contested conditions.
---

# Coalition Rapid Airfield Capture and Runway Denial Reversal Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for coalition warfighter missions in this domain.
- Confirm authorities, coalition caveats, legal constraints, and commander decision points before recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Build mission context with airfield status, denial mechanisms, threat conditions, and restoration timelines.
2. Generate branches with explicit tradeoffs in speed, survivability, engineering demand, and escalation.
3. Select primary, alternate, and degraded toolchain configurations and protocol/message paths.
4. Bind tool outputs to commander decisions with confidence and validation gates.
5. Produce decision-ready recommendations with task ownership and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternatives and trigger conditions.
4. Decision points and approval gates.
5. Staff tasking with suspense.

## Domain Tool Stack

Use these tool categories by default: runway damage assessment systems, engineering clearance schedulers, and coalition sortie regeneration planners.

## Protocol Profile

Preferred protocol families for this skill: AIXM/FIXM, Link 16 J-series, USMTF, NATO APP-11/ADatP-3 aligned, API/JSON.

## Domain Toolchain Defaults

- Primary: select a mission-fit tool_suite_id from ../_shared/references/warfighter-external-tool-and-protocol-catalog.md.
- Alternate: select a cross-check tool_suite_id with independent provenance.
- Degraded: commander-approved manual runway status board with UTC acknowledgment logging.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md for concrete tool suites and protocol stacks.
- Use ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-COALITION-RAPID-AIRFIELD-DENIAL-REVERSAL-001 for critical recommendations.
- Include tool_suite_id, protocol_stack_id, packet_id, data freshness (UTC), confidence, and fallback path for each high-impact branch.
- If no packet matches, define a provisional packet with validation_owner and revalidation_utc.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal/policy/ROE constraints and coalition interoperability limits early.
- Downgrade to advisory-only when authority, provenance, or acknowledgment integrity is uncertain.
- Do not fabricate sources, approvals, or operational authorities.
