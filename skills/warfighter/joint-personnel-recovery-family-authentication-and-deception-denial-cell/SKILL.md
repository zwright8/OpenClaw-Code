---
name: joint-personnel-recovery-family-authentication-and-deception-denial-cell
description: Coordinate trusted personnel recovery updates, family notification authentication, and deception denial for U.S. warfighter operations. Use when isolated personnel reporting, next-of-kin contact, or adversary spoofing risk can distort rescue decisions or family assurance.
---

# Joint Personnel Recovery Family Authentication And Deception Denial Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm PR authorities, notification authorities, releasability limits, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with isolated personnel status, authentication confidence, family-contact risk, and adversary spoof indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in rescue tempo, trust, OPSEC, and family assurance.
3. Identify branch/sequel triggers, confirmation thresholds, and command approval gates.
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

Primary products: authentication-confidence matrix, family-notification integrity plan, and deception-denial branch package.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-personnel-recovery-family-auth-deception-denial-v1` with `protocol_stack_id=ps-joint-personnel-recovery-family-auth-deception-denial-stack-v1`.
- Alternate: select a mission-adjacent personnel-recovery or information-integrity suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: dual-channel human verification workflow with manual notification ledger and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-PR-FAMILY-AUTH-DECEPTION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: PR authentication boards, secure notification ledgers, and media-authenticity verification services.
- Preferred protocol profiles for coordination and machine exchange: signed notification manifests, `USMTF`, `STIX/TAXII`, `API/JSON`, and `CoT`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, identity confidence, or message provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, privacy, casualty-assistance, and OPSEC constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
