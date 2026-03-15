---
name: joint-deployed-finance-cash-payroll-and-disbursing-continuity-cell
description: Sustain deployed cash, payroll, and disbursing controls when banking rails, connectivity, or local-currency access degrade in theater. Use when commanders need financial continuity without losing accountability or fraud controls.
---

# Joint Deployed Finance Cash Payroll And Disbursing Continuity Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm disbursing authorities, banking dependencies, currency exposure, fraud thresholds, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval before recommending branches that materially change cash or payroll release controls.

## Workflow

1. Frame the deployed finance architecture, cash points, payroll dependencies, and failure modes most exposed to outage or fraud.
2. Build primary and alternate cash, payroll, emergency-pay, and ledger-recovery branches with explicit tradeoffs in speed, fraud risk, and mission assurance.
3. Bind each recommendation to concrete disbursing, payment, and accountability tools plus packetized outputs.
4. Run authority, custody, and reconciliation checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended finance-continuity branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Finance packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: disbursing continuity plan, cash and payroll risk ledger, and local-currency prioritization board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-deployed-finance-cash-payroll-disbursing-continuity-v1` with `protocol_stack_id=ps-joint-deployed-finance-cash-payroll-disbursing-continuity-stack-v1`.
- Alternate: manual ledger board plus courier-backed cash custody tracker.
- Degraded: mission-essential pay and cash advances only with daily dual-control reconciliation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-DEPLOYED-FINANCE-DISBURSING-001` for critical recommendations.
- Prioritize these protocol families for this domain: `ISO 20022`, signed disbursing manifests, `NIEM`, `API/JSON`, `S/MIME`, and `USMTF`.
- Include source system, refresh UTC, confidence, custody status, and unresolved fraud or reconciliation gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If custody, reconciliation status, or disbursing authority is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate cash balances, payroll status, or fiscal authority.
- Separate observed ledger or banking facts from inferred fraud or market behavior.
- Surface local-political, anti-corruption, and force-protection effects of cash-distribution changes early.
