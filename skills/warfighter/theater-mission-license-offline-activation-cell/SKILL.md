---
name: theater-mission-license-offline-activation-cell
description: Preserve mission software availability when licenses, tokens, or offline activation paths fail. Use when disconnected operations, cyber disruption, or vendor dependency threaten mission-system uptime.
---

# Theater Mission License Offline Activation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter mission-software entitlement, licensing, and trusted activation decisions.
- Confirm affected systems, token or license state, offline-entitlement options, cyber posture, and release authority before recommending action.
- Keep outputs unclassified by default unless software pedigree, keys, or platform mappings require protected handling.

## Workflow

1. Frame the mission problem using impacted services, entitlement expiry windows, disconnected nodes, rollback options, and operator workload.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mission uptime, cyber exposure, vendor dependency, and technical debt.
3. Identify branch triggers for offline activation, cached-license release, vendor escalation, and manual mission fallback.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and technical-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: license continuity ledger, offline activation fallback plan, and trusted-release exception board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-mission-license-offline-activation-v1` with `protocol_stack_id=ps-theater-mission-license-offline-activation-stack-v1`.
- Alternate: select a mission-adjacent cyber-defense, PKI, or mission-software suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential services only with manual entitlement ledger and preapproved binary allowlist.

## Domain Packet Defaults

- Default packet ID: `DPL-MISSION-LICENSE-OFFLINE-ACTIVATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: license-server health board, entitlement vault or escrow tracker, offline activation ledger, and trusted build-release board.
- Preferred protocol profiles for coordination and machine exchange: signed entitlement manifests, `X.509`, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If entitlement provenance, offline activation authority, or rollback safety is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag vendor reachback dependence, token compromise risk, stale allowlists, and unsupported offline paths before recommending action.
- Do not fabricate entitlements, key custody, or release authority.
