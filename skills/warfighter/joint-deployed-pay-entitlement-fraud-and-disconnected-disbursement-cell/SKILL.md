---
name: joint-deployed-pay-entitlement-fraud-and-disconnected-disbursement-cell
description: Coordinate pay continuity, entitlement reconciliation, and anti-fraud disbursement controls for deployed U.S. forces. Use when cyber disruption, banking outages, or disconnected operations threaten trusted pay delivery.
---

# Joint Deployed Pay Entitlement Fraud And Disconnected Disbursement Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm finance authority, disconnected cash controls, hardship or special-pay rules, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with affected personnel counts, entitlement disruptions, fraud indicators, and disbursement-path status.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in pay timeliness, fraud exposure, morale, and administrative burden.
3. Identify branch or sequel triggers, disbursement hold points, and approval gates.
4. Bind each critical recommendation to concrete external tools, protocols, and staff handoffs.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: pay continuity ladder, disbursement fraud exception board, and entitlement backlog tracker.

## External Tool Stack and Protocols

- Primary toolsets: pay and entitlements system, disbursement reconciliation service, and disconnected transaction integrity tracker.
- Alternate toolsets: treasury disbursement mirror, protected commander support ledger, and finance fraud review board.
- Degraded mode: dual-signature manual disbursement ledger with daily UTC fraud reconciliation and commander-approved hardship prioritization.
- Preferred protocol profiles: `NIEM`, `API/JSON`, `USMTF`, `S/MIME`, and signed finance manifests.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, disbursement custody, or fraud confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag fraud, privacy, morale, and statutory-entitlement risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
