---
name: arctic-over-ice-ground-line-of-communication-resilience-cell
description: Support Arctic warfighter mobility planning for over-ice ground line-of-communication resilience, route survivability, and sustainment assurance.
---

# Arctic Over Ice Ground Line Of Communication Resilience Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. and coalition warfighter teams in this domain.
- Confirm echelon, mission phase, authorities, classification handling, and commander decision timeline.
- Keep outputs advisory-only unless explicit command authority and approvals are provided.

## Workflow

1. Frame the mission problem with operational context, threat model, and critical dependencies.
2. Identify assumptions, invalidation triggers, legal-policy constraints, and coalition releasability limits.
3. Build one recommended option and at least two alternatives with risk/tempo/sustainment tradeoffs.
4. Bind each option to external tool/protocol execution packets with degraded-mode fallbacks.
5. Publish commander and staff views with decisions-now/later, branch triggers, and owner/suspense tracking.

## Required Output Format

1. Situation snapshot and what changed.
2. Recommended option and rationale.
3. Alternative options with trigger conditions.
4. Decision points and authority gates.
5. Staff tasking matrix with owners and suspense.

## Domain Products

Primary products: over-ice GLOC survivability matrix, sustainment branch map, mobility risk trigger ledger.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and execute the Core Integration Protocol sequence.
- Use `../_shared/references/tool-protocol-playbooks.md` and `../_shared/references/external-tool-endpoints-and-adapters.md` for machine-ingestible invocation packets.
- Include provenance fields: source system, refresh time (UTC), assumptions, confidence, and known gaps.
- Prioritize these tool families for this domain: ice-route analytics, weather/terrain risk fusion, convoy survivability planners, Arctic sustainment telemetry.

## Assurance and Authority Requirements

- Validate outputs with `../_shared/references/mission-assurance-checklist.md`, `../_shared/references/tool-health-and-trust-monitoring.md`, and `../_shared/references/us-joint-protocol-assurance-drill.md`.
- Apply approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- If authority, provenance, tool trust, or interoperability is uncertain, downgrade to advisory-only and require command review.

## Tool/Protocol Binding

- Bind recommendations to `tool_suite_id=ts-arctic-over-ice-ground-line-of-communication-resilience-cell-v1` and `protocol_stack_id=ps-arctic-over-ice-ground-line-of-communication-resilience-cell-stack-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Bind machine-ingestible execution packets to `packet_id=DPL-ARCTIC-OVER-ICE-GLOC-RESILIENCE-001` from `../_shared/references/domain-tool-packet-library.md`.
- Include `validation_owner`, `revalidation_utc`, and degraded-mode fallback for every critical dependency.
