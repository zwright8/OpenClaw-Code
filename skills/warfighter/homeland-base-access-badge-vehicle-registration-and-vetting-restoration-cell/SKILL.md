---
name: homeland-base-access-badge-vehicle-registration-and-vetting-restoration-cell
description: Restore installation access, badge issuance, vehicle registration, and vetting continuity after domestic disruption. Use when base defense and family sustainment depend on getting trusted people and vehicles back through the gate without losing force-protection discipline.
---

# Homeland Base Access Badge Vehicle Registration And Vetting Restoration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter installation-access restoration during domestic crisis response and recovery.
- Confirm affected installation, access-control outage or backlog, vetting authorities, vehicle-control posture, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using gate throughput, badge-system status, vehicle-registration backlog, trusted-population priorities, and threat or protest indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force protection, family access, mission throughput, and fraud risk.
3. Identify branch triggers for manual-entry fallback, emergency badge issuance, visitor-control restriction, and vehicle-search posture changes.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: access-restoration ladder, badge and vetting exception board, and vehicle-registration recovery packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-BASEACCESS-290`, `tool_suite_id=ts-homeland-base-access-badge-vehicle-registration-vetting-restoration-v1`, and `protocol_stack_id=ps-homeland-base-access-badge-vehicle-registration-vetting-restoration-stack-v1`.
- Alternate: select a mission-adjacent force-protection, identity-continuity, or law-enforcement coordination suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual gate roster and vehicle pass board with advisory-only exception handling until vetting and badge provenance are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-BASE-ACCESS-VETTING-RESTORE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: access-control dashboard, badge-print and revocation ledger, vehicle-registration queue, and vetting exception board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OIDC/SAML`, signed access notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity evidence, vetting status, or force-protection posture is uncertain, downgrade to advisory-only and request command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag insider-risk exposure, forged-credential risk, vehicle-control gaps, and family-access inequity before recommending action.
- Do not fabricate badge status, vetting approvals, vehicle permissions, or gate-capacity claims.
