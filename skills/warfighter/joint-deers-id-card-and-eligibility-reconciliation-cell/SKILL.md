---
name: joint-deers-id-card-and-eligibility-reconciliation-cell
description: Restore DEERS, ID-card, and sponsor-dependent eligibility integrity when mismatches block healthcare, base access, pay, or family support. Use when eligibility drift begins to create readiness, retention, or casualty-assistance risk.
---

# Joint DEERS ID Card And Eligibility Reconciliation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter identity, eligibility, and entitlement-continuity decisions.
- Confirm affected sponsors or dependents, blocking symptom, authoritative record sources, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using eligibility drift, care or access denial, pay-impact signals, PCS or casualty context, and command urgency.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, privacy protection, benefits restoration, and staff burden.
3. Identify branch triggers for sponsor-record mismatch, dependency-proof gap, ID-card office outage, care-access denial, and casualty-linked entitlement hold.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and eligibility-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: eligibility reconciliation board, ID-card issuance ladder, and entitlement exception packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-DEERS-307`, `tool_suite_id=ts-joint-deers-id-card-eligibility-reconciliation-v1`, and `protocol_stack_id=ps-joint-deers-id-card-eligibility-reconciliation-stack-v1`.
- Alternate: select a mission-adjacent personnel-records, family-readiness, or medical-access suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual sponsor-dependent priority roster with advisory-only action until identity proof, dependency status, and release authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-DEERS-ID-ELIGIBILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: eligibility reconciliation board, ID-card issuance queue, dependency-verification ledger, and sponsor-record sync board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed eligibility notices, `API/JSON`, `S/MIME`, `OIDC/SAML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sponsor or dependent identity proof, legal dependency status, or eligibility authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag duplicate records, stale dependency evidence, blocked medical access, and uncompensated pay or benefit gaps before recommending action.
- Do not fabricate sponsor status, dependent eligibility, ID-card validity, or entitlement restoration.
