---
name: joint-recovered-personnel-family-messaging-and-media-protection-cell
description: Protect recovered personnel, families, and ongoing debriefs by sequencing notification, information release, and media containment after high-visibility recoveries.
---

# Joint Recovered Personnel Family Messaging And Media Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter recovered-personnel information-protection, family-notification, and media-control decisions.
- Confirm recovery status, family-contact posture, debrief sensitivity, public visibility, and approval authorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using recovery facts, notification status, debrief restrictions, media pressure, and adversary narrative indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in family care, OPSEC, rumor control, and public-trust cost.
3. Identify branch triggers for embargo release, family hold, coordinated statement, deceptive narrative rebuttal, or legal review.
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

Primary products: family-contact sequence board, media-hold matrix, and recovered-personnel information-protection packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-recovered-personnel-family-messaging-media-protection-v1` with `protocol_stack_id=ps-joint-recovered-personnel-family-messaging-media-protection-stack-v1`.
- Alternate: select a mission-adjacent personnel-recovery, casualty-notification, or public-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual notification call tree with command-approved media hold and no public detail beyond life-safety essentials.

## Domain Packet Defaults

- Default packet ID: `DPL-RECOVERED-PERSONNEL-MEDIA-PROTECTION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: recovered-personnel release board, family-notification tracker, media-hold matrix, and narrative-monitoring board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed release manifests, `S/MIME`, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If notification status, identity confirmation, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect family privacy, debrief secrecy, medical confidentiality, and misinformation exposure before recommending action.
- Do not fabricate notification completion, family consent, or public-release approval.
