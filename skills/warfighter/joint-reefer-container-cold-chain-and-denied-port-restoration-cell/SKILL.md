---
name: joint-reefer-container-cold-chain-and-denied-port-restoration-cell
description: Coordinate reefer-container cold-chain recovery and denied-port restoration. Use when food, blood, biologics, or temperature-sensitive munitions support are threatened by shore-power loss, berth denial, or cold-chain telemetry gaps.
---

# Joint Reefer Container Cold Chain and Denied Port Restoration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm cargo class, thermal tolerances, berth status, generator or shore-power availability, and movement priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with reefer telemetry, berth or yard availability, power restoration status, cargo priority, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in spoilage risk, throughput, labor burden, and distribution tempo.
3. Identify branch triggers for power loss, generator depletion, telemetry blackout, berth denial, or cargo temperature excursion.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and port-operations decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: reefer priority board, cold-chain restoration ladder, and denied-port recovery matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-reefer-container-cold-chain-denied-port-restoration-v1` with `protocol_stack_id=ps-joint-reefer-container-cold-chain-denied-port-restoration-stack-v1`.
- Alternate: select a mission-adjacent port-opening, cold-chain, or contested-logistics suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: protect only mission-essential reefers with manual temperature logging, restricted berth movement, and command-approved spoilage triage.

## Domain Packet Defaults

- Default packet ID: `DPL-REEFER-COLD-CHAIN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: reefer telemetry board, shore-power dispatch console, berth queue manager, and cargo-temperature manifest ledger.
- Preferred protocol profiles for coordination and machine exchange: `AIS/NMEA`, `EDI X12`, `OPC UA`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If cargo integrity, berth authority, or restoration sequencing is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag silent telemetry, generator overload, mixed-cargo incompatibility, and temperature-excursion uncertainty before recommending action.
- Do not fabricate cargo temperature compliance, port readiness, or cargo-release approval.
