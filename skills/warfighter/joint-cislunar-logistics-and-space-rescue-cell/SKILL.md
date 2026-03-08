---
name: joint-cislunar-logistics-and-space-rescue-cell
description: Coordinate cislunar logistics windows, contingency rescue synchronization, and orbital reentry support under contested conditions. Use when commands need options with explicit tool/protocol bindings, authority gates, and degraded exchanges.
---

# Joint Cislunar Logistics and Space Rescue Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Start by confirming echelon, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the mission problem with commander intent, latest indicators, and limiting assumptions.
2. Identify explicit branch triggers, invalidation thresholds, and confidence risks.
3. Build a recommended option plus at least two alternatives with clear tradeoffs in tempo, survivability, sustainment burden, and escalation risk.
4. Bind each critical recommendation to concrete external tools, protocol stack, and a degraded-mode branch.
5. Produce commander-facing and staff-action outputs with owners, suspense dates, and revalidation triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended option and rationale.
3. Alternative options with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.

## Domain Products

Primary products for this skill: cislunar logistics window board, rescue branch timeline, orbital handover risk ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-cislunar-rescue-assurance-v1` with `protocol_stack_id=ps-cislunar-rescue-assurance-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: authenticated voice/readback + UTC acknowledgment ledger + commander decision log.

## Domain Packet Defaults

- Default packet ID: `DPL-CISLUNAR-RESCUE-001`.
- If no packet fully matches, define a provisional packet using the shared schema and assign a validation owner.

## Toolchain Profile Binding

- Default `toolchain_id`: `TC-SPACE-PNT-008`.
- Include `primary_system`, `cross_check_system`, `protocol_binding`, `credential_scope`, and `fallback_path` for each critical recommendation.

## External Tools and Protocol Integration

- Use baseline integration workflow in `../_shared/references/external-tools-protocols.md`.
- Bind concrete tool and protocol selections through `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Use packet templates from `../_shared/references/domain-tool-packet-library.md` and playbooks in `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance fields: source system, refresh UTC, assumptions, confidence, and known gaps.

## Authority and Assurance Gates

- Apply `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run interoperability and assurance checks from `../_shared/references/mission-assurance-checklist.md`, `../_shared/references/tool-health-and-trust-monitoring.md`, and `../_shared/references/us-joint-protocol-assurance-drill.md`.
- Downgrade to advisory-only if legal basis, authority scope, or protocol acknowledgment integrity is uncertain.

## Guardrails

- Flag assumptions that exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Do not fabricate authorities, approvals, or source evidence.
