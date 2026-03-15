---
name: joint-sensitive-imagery-next-of-kin-hold-and-release-cell
description: Control hold, redaction, and staged release of sensitive operational imagery when next-of-kin notification, evidence integrity, or adversary exploitation risk must be synchronized for U.S. warfighter missions.
---

# Joint Sensitive Imagery Next Of Kin Hold And Release Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm imagery-custody authority, casualty or incident status, next-of-kin notification posture, and legal review deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with imagery provenance, redaction requirements, notification status, evidentiary holds, and narrative-exploitation risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in transparency, privacy, evidentiary value, and release timing.
3. Identify branch or sequel triggers for hold extension, redaction escalation, release by exception, or permanent withholding.
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

Primary products: imagery hold ledger, redaction and release matrix, and next-of-kin synchronization tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-sensitive-imagery-next-of-kin-hold-release-v1` with `protocol_stack_id=ps-joint-sensitive-imagery-next-of-kin-hold-release-stack-v1`.
- Alternate: select a mission-adjacent combat-camera, public-affairs, or evidentiary-custody suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual hold ledger with commander-approved redaction notes and dual-review release confirmation.

## Domain Packet Defaults

- Default packet ID: `DPL-SENSITIVE-IMAGERY-NOK-HOLD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: imagery provenance verifier, casualty-notification status board, redaction workflow, and release-hold ledger.
- Preferred protocol profiles for coordination and machine exchange: signed media manifests, `STANAG 4609` aligned exchange, `S/MIME`, `NIEM`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If provenance, next-of-kin status, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend public release before next-of-kin confirmation, legal review, and evidentiary-hold checks are complete.
- Flag privacy, graphic-content, partner-releasability, and adversary-amplification risks before recommending action.
