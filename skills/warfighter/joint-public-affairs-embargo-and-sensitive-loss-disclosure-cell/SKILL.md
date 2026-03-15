---
name: joint-public-affairs-embargo-and-sensitive-loss-disclosure-cell
description: Sequence embargoes, commander statements, and sensitive loss disclosure for U.S. warfighter operations when release timing affects family notification, OPSEC, and adversary exploitation risk.
---

# Joint Public Affairs Embargo And Sensitive Loss Disclosure Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm public-affairs authority, casualty or incident disclosure posture, legal review status, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with incident facts, notification status, embargo constraints, media demand, and narrative-exploitation risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in trust, speed, OPSEC, and family-assurance timing.
3. Identify branch or sequel triggers for release hold, staged disclosure, partner coordination, or immediate rebuttal.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: disclosure timing matrix, embargo decision ladder, and media response branch card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-public-affairs-embargo-sensitive-loss-disclosure-v1` with `protocol_stack_id=ps-joint-public-affairs-embargo-sensitive-loss-disclosure-stack-v1`.
- Alternate: select a mission-adjacent public-affairs, information-integrity, or casualty-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual release-hold board with command-approved holding statements and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-PA-EMBARGO-SENSITIVE-LOSS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: public-affairs release board, next-of-kin notification status tracker, media query queue, and narrative risk monitor.
- Preferred protocol profiles for coordination and machine exchange: signed release manifests, `NIEM`, `S/MIME`, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If casualty status, next-of-kin notification status, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not fabricate casualty status, approved talking points, or public-release authority.
- Flag next-of-kin timing, adversary amplification risk, partner-release dependencies, and OPSEC constraints before recommending action.
