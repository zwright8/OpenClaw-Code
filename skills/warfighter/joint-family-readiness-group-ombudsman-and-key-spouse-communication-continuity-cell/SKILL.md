---
name: joint-family-readiness-group-ombudsman-and-key-spouse-communication-continuity-cell
description: Preserve trusted family-network communications, volunteer notification, rumor control, and resource-referral continuity across family readiness group, ombudsman, and key spouse channels when crisis messaging failure degrades U.S. warfighter household trust and readiness.
---

# Joint Family Readiness Group Ombudsman And Key Spouse Communication Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter family-network communication, volunteer-routing, and rumor-control decisions.
- Confirm command relationship, volunteer authorities, contact-roster integrity, casualty or privacy restrictions, and notification urgency before recommending action.
- Keep outputs unclassified by default and minimize family PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using contact-roster health, volunteer coverage, message backlog, rumor indicators, and household support demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in trust, speed, privacy, and volunteer burden.
3. Identify branch triggers for stale contact data, misinformation spread, casualty-sensitive messaging, volunteer burnout, and referral dead ends.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and family-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and communication-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: family-network contact board, rumor-control escalation ladder, and volunteer-notification continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-FAMNET-335`, `tool_suite_id=ts-joint-family-readiness-group-ombudsman-key-spouse-communication-v1`, and `protocol_stack_id=ps-joint-family-readiness-group-ombudsman-key-spouse-communication-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, emergency-leave, or public-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual contact roster and advisory-only notification triage until roster integrity and command release authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-FRG-OMBUDSMAN-KEY-SPOUSE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: family-network contact roster, volunteer notification board, rumor-control escalation ledger, and resource-referral queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CAP`, signed community notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If contact consent, casualty-notification authority, or command-message legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and roster integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale contact rosters, unsupported volunteer commitments, rumor amplification risk, and casualty-sensitive messaging gaps before recommending action.
- Do not fabricate contact opt-in status, volunteer availability, casualty information, or command endorsement.
