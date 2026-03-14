---
name: coalition-munitions-end-use-diversion-and-serial-trace-cell
description: Preserve coalition munitions accountability through serial tracing and diversion detection. Use when transfers, replenishment, and end-use controls must remain trusted across partners without stalling approved support.
---

# Coalition Munitions End Use Diversion And Serial Trace Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm transfer authorities, coalition caveats, serial-registry coverage, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the transfer network with sender and receiver units, serial coverage, custody breaks, and diversion indicators.
2. Build release, hold, re-verify, reroute, and audit branches with explicit readiness and accountability tradeoffs.
3. Bind each recommendation to concrete serial-trace, transfer-control, and anomaly-detection tools plus packetized outputs.
4. Publish degraded-mode branches when serial integrity, receipt confirmation, or coalition authority falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended accountability branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Serial-trace packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: serial-trace exception board, end-use confidence ladder, and release-or-hold decision matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-munitions-end-use-serial-trace-v1` with `protocol_stack_id=ps-coalition-munitions-end-use-serial-trace-stack-v1`.
- Alternate: manual serial ledger plus coalition transfer worksheet.
- Degraded: highest-priority munitions only with dual-control receipt confirmation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MUNITIONS-END-USE-SERIAL-TRACE-001` for critical recommendations.
- Prioritize these protocol families for this domain: `NIEM`, `USMTF`, signed custody manifests, `API/JSON`, and NATO APP-11/ADatP-3 aligned exchange.
- Include source system, refresh UTC, confidence, coalition caveats, and unresolved custody gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run transfer-accountability and releasability checks from `../_shared/references/mission-assurance-checklist.md`.
- If serial evidence, transfer authority, or receiving-unit confirmation is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not provide instructions to evade end-use monitoring, serial tracing, or custody controls.
- Separate observed accountability gaps from inferred intent or culpability.
- Surface legal, coalition-policy, and explosive-safety constraints early.
