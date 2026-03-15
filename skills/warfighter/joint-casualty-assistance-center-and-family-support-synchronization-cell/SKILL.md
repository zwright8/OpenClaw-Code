---
name: joint-casualty-assistance-center-and-family-support-synchronization-cell
description: Coordinate casualty assistance center workload, survivor support, and family case synchronization for U.S. warfighters after loss or serious injury. Use when notification accuracy, benefits action timing, and family-support continuity affect trust and readiness.
---

# Joint Casualty Assistance Center And Family Support Synchronization Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm casualty-assistance authority, family-support posture, legal or privacy limits, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with casualty case status, survivor support demand, document-release posture, and family-risk indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in trust, speed, administrative burden, and family-support continuity.
3. Identify branch/sequel triggers, case-escalation thresholds, and authority or release gates.
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

Primary products: casualty-assistance center battle rhythm board, survivor support action ledger, and family-case synchronization matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-casualty-assistance-center-family-support-sync-v1` with `protocol_stack_id=ps-joint-casualty-assistance-center-family-support-sync-stack-v1`.
- Alternate: select a mission-adjacent casualty-information or family-support suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: dual-review manual case board with paper action packets, UTC acknowledgment logging, and commander-approved release thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-CASUALTY-ASSISTANCE-FAMILY-SUPPORT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: casualty case tracker, survivor-benefits action board, family-support appointment scheduler, and document-integrity ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed custody manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, casualty identity confidence, or family-contact release status is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag privacy, survivor-benefits fraud, family distress, casualty-notification timing, and cultural or religious accommodation constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.

## Domain Toolchain Override (2026-03-15, Expansion Wave LXV Addendum)

- Add `tool_suite_id=ts-joint-public-affairs-embargo-sensitive-loss-disclosure-v1` + `protocol_stack_id=ps-joint-public-affairs-embargo-sensitive-loss-disclosure-stack-v1` when family-support actions depend on synchronized next-of-kin notification, casualty disclosure timing, or adversary narrative pressure.
- Add `tool_suite_id=ts-joint-sensitive-imagery-next-of-kin-hold-release-v1` + `protocol_stack_id=ps-joint-sensitive-imagery-next-of-kin-hold-release-stack-v1` when imagery release, redaction, or evidentiary holds can affect family trust, privacy, or public-awareness timing.
- Add `packet_id=DPL-PA-EMBARGO-SENSITIVE-LOSS-001` and `packet_id=DPL-SENSITIVE-IMAGERY-NOK-HOLD-001` for branches that materially alter next-of-kin timing, survivor-support confidence, or approved public-release posture.
