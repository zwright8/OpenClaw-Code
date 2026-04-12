---
name: joint-overseas-cola-post-allowance-and-currency-shock-continuity-cell
description: Preserve overseas COLA, post allowance, and exchange-rate shock continuity when station-economy changes or admin lag destabilize U.S. warfighter households abroad.
---

# Joint Overseas COLA Post Allowance And Currency Shock Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter overseas cost-of-living and allowance-continuity decisions.
- Confirm duty location, dependent posture, locality rate changes, exchange-rate movement, and command decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using overseas station, COLA or post-allowance posture, exchange-rate movement, household purchasing-power loss, and readiness or retention risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in compensation legitimacy, household stability, speed, and administrative burden.
3. Identify branch triggers for locality-rate changes, sponsor-status drift, currency shock, dependent-status mismatch, and prolonged underpayment.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and overseas-cost risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: overseas-cost index board, allowance correction ladder, and currency-shock mitigation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-OCOLA-398`, `tool_suite_id=ts-joint-overseas-cola-post-allowance-currency-shock-continuity-v1`, and `protocol_stack_id=ps-joint-overseas-cola-post-allowance-currency-shock-continuity-stack-v1`.
- Alternate: select a mission-adjacent compensation, command-sponsorship, or household-stability suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual overseas-cost risk board with advisory-only sequencing until locality status, dependent posture, and pay evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-OCOLA-POST-CURRENCY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: overseas locality-rate board, exchange-rate monitor, dependent-location verification ledger, and pay-adjustment escalation queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `ISO 20022`, signed pay notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If station eligibility, locality-rate evidence, or dependent-location status is uncertain, downgrade to advisory-only and request human finance review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and exchange-rate evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported compensation promises, stale exchange-rate assumptions, sponsor-location mismatch, and household underpayment risk before recommending action.
- Do not fabricate COLA rates, post-allowance authority, dependent presence, or correction approval.
