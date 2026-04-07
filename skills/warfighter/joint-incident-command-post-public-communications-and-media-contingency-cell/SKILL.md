---
name: joint-incident-command-post-public-communications-and-media-contingency-cell
description: Manage life-safety messaging, media contingencies, and incident-command public communications when operational tempo and information attacks collide.
---

# Joint Incident Command Post Public Communications And Media Contingency Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter public-communications and media-contingency decisions around incident-command posts.
- Confirm release authorities, warning obligations, media pressure, adversary-information threat, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using incident status, life-safety message demand, release authorities, media pressure, and narrative risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, credibility, operational security, and public trust.
3. Identify branch triggers for holding statements, alert release, multilingual updates, rumor rebuttal, and media-ground-rule changes.
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

Primary products: message-approval ladder, public-warning release matrix, media contingency card, and rumor-response decision log.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PUBCOMMS-244`, `tool_suite_id=ts-joint-incident-command-post-public-communications-and-media-contingency-v1`, and `protocol_stack_id=ps-joint-incident-command-post-public-communications-and-media-contingency-stack-v1`.
- Alternate: select a mission-adjacent public-affairs, civil-warning, or information-integrity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: commander-approved holding statement, manual warning call tree, and no external release beyond essential life-safety messaging.

## Domain Packet Defaults

- Default packet IDs: `DPL-ICP-PUBLIC-COMMS-001` and `DPL-MEDIA-CONTINGENCY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: message-approval board, public-warning gateway, media query tracker, and adversary-narrative monitor.
- Preferred protocol profiles for coordination and machine exchange: `CAP`, `NIEM`, `S/MIME`, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If release authority, message authenticity, or civil-warning coordination is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported public assurances, rumor-amplification risk, OPSEC conflicts, and release-authority gaps before recommending action.
- Do not fabricate incident status, warning authority, media commitments, or narrative effects.
