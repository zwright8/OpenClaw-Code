---
name: coalition-mission-digital-twin-configuration-baseline-reconciliation-cell
description: Reconcile coalition mission digital twins and configuration baselines when planning models drift from real systems or allied data diverges. Use when combined forces need a release-safe common technical picture before acting.
---

# Coalition Mission Digital Twin Configuration Baseline Reconciliation Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm coalition release rules, baseline authorities, system-of-record ownership, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval before recommending branches that change shared technical baselines.

## Workflow

1. Frame the coalition digital-twin landscape, authoritative baselines, and failure modes most exposed to stale or divergent model state.
2. Build primary and alternate reconcile, quarantine, rollback, and releasability branches with explicit tradeoffs in tempo, trust, and interoperability.
3. Bind each recommendation to concrete digital-engineering, configuration-control, and release-assurance tools plus packetized outputs.
4. Run authority, releasability, and acknowledgment checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended baseline-reconciliation branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Baseline packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: configuration drift adjudication board, coalition digital-twin delta ledger, and release-safe baseline package.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-mission-digital-twin-baseline-reconciliation-v1` with `protocol_stack_id=ps-coalition-mission-digital-twin-baseline-reconciliation-stack-v1`.
- Alternate: manual baseline board plus coalition change-control spreadsheet and readback log.
- Degraded: advisory-only delta reporting with frozen release until authoritative baseline confirmation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-DIGITAL-TWIN-BASELINE-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed configuration manifests, `API/JSON`, `OGC`, `NIEM`, `USMTF`, and NATO APP-11/ADatP-3 aligned exchange.
- Include source system, refresh UTC, confidence, releasability status, and unresolved model or baseline gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If baseline authority, partner release basis, or model fidelity is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate baseline approvals, system fidelity, or coalition concurrence.
- Separate observed configuration drift from inferred cyber compromise or partner intent.
- Surface cross-domain safety, export-control, and release-traceability consequences early.
