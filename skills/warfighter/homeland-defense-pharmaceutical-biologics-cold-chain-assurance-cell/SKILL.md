---
name: homeland-defense-pharmaceutical-biologics-cold-chain-assurance-cell
description: Maintain homeland military pharmaceutical and biologics cold-chain assurance during cyber-physical disruption and surge casualty demand.
---

# Homeland Defense Pharmaceutical Biologics Cold Chain Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, authorities, coalition constraints, data handling requirements, and commander decision timeline.
- Keep outputs unclassified by default unless handling instructions are explicitly provided.

## Workflow

1. Frame the mission problem with current threat picture, mission objectives, operational constraints, and required effects.
2. Define assumptions, invalidation triggers, and branch conditions.
3. Build a primary and at least one alternate option with tradeoffs in tempo, survivability, interoperability, sustainment burden, and escalation.
4. Bind recommendations to cross-domain dependencies across C2, intelligence, fires/effects, protection, sustainment, and information.
5. Produce commander-facing and staff-facing outputs with owners, suspense, and acknowledgment criteria.

## Required Output Format

Deliver in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternatives and branch triggers.
4. Decision points and timing.
5. Staff tasking with owners/suspense.
6. Tool invocation packet summary with protocol details.

## Domain Products

Primary products for this skill: biologics cold-chain integrity board, military-civil medicine prioritization matrix, protected distribution continuity packet.

## Domain Tool Stack

Use these tool categories as the baseline stack: cold-chain telemetry assurance systems, medical logistics orchestration boards, contamination and diversion adjudication tools.

## Protocol Profile

Preferred protocol families for this skill: HL7/FHIR, NIMS/ICS, NIEM, USMTF, API/JSON.

## External Tools and Protocol Integration

- Use ../_shared/references/warfighter-external-tool-and-protocol-catalog.md to select a mission-fit tool_suite_id and protocol_stack_id.
- Use ../_shared/references/joint-operations-external-toolchain-profiles.md and bind each recommendation to concrete primary and cross-check systems.
- Use ../_shared/references/external-tool-endpoints-and-adapters.md and define endpoint contract, transport mode, timeout, and degraded fallback.
- Include tool_suite_id, protocol_stack_id, interop_standard_set, endpoint_security_profile, primary_exchange_path, and degraded_exchange_method for each critical recommendation.

## Interoperability and Assurance Gates

- Run ../_shared/references/mission-assurance-checklist.md before release.
- Run ../_shared/references/us-joint-protocol-assurance-drill.md before release.
- Apply authority controls from ../_shared/references/warfighter-tool-authority-gates.md and ../_shared/references/human-agent-command-escalation-matrix.md.
- If data freshness, authority, or protocol acknowledgment is uncertain, downgrade to advisory-only and require human command review.

## Tool Invocation Contract

For each critical external dependency include:

- Objective and decision linkage.
- Required input schema and validation checks.
- Query or action template.
- Expected output schema and freshness SLA.
- Transport protocol and acknowledgment timeout.
- Degraded-mode fallback path and confidence impact.

## Guardrails

- Distinguish facts, assessments, and unknowns.
- Identify legal, policy, ROE, safety, medical, and coalition interoperability constraints early.
- Do not fabricate intelligence, authorities, approvals, tool outputs, or system connectivity.
- Require explicit commander/legal review for recommendations that can materially alter force posture, casualty risk, or escalation.

## Domain Toolchain Override (2026-03-12, Expansion Wave XXIV Addendum)

- Prioritize `tool_suite_id=ts-homeland-defense-pharma-biologics-cold-chain-assurance-v1` + `protocol_stack_id=ps-homeland-defense-pharma-biologics-cold-chain-assurance-stack-v1` when this mission set is the critical path for commander decision timelines.
- Add `packet_id=DPL-HOMELAND-PHARMA-BIOLOGICS-COLDCHAIN-001` for the primary course of action and `packet_id=DPL-HOMELAND-PHARMA-BIOLOGICS-COLDCHAIN-002` for degraded-mode fallback actions.
- Include `validation_owner`, `revalidation_utc`, and `ack_chain_status` for both packet paths before release.
