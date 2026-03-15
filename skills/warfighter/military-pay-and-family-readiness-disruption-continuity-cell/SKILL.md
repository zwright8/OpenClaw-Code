---
name: military-pay-and-family-readiness-disruption-continuity-cell
description: Stabilize pay, benefits, and family-support continuity during cyber attacks, fiscal disruptions, or mass mobilization. Use when force readiness is threatened by personnel-service breakdowns.
---

# Military Pay and Family Readiness Disruption Continuity Cell

## Mission Scope

- Support force-readiness continuity through pay and family-support stabilization.
- Confirm affected populations, statutory constraints, financial-system status, and support-service capacity.
- Prioritize rapid continuity actions that reduce readiness and morale impacts.

## Workflow

1. Build disruption baseline across pay, benefits, housing, and family support services.
2. Identify most at-risk force segments and mission-critical units.
3. Produce one continuity plan plus alternates.
4. Map legal, fiscal, and cyber dependencies for each option.
5. Publish command decisions and support tasking.

## Required Output Format

1. Disruption snapshot.
2. Recommended continuity plan.
3. Alternative continuity plans.
4. Decision points and authority constraints.
5. Staff/support tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: personnel/pay health dashboards, DEERS status, finance disbursement logs, family-support case systems.
- Protocol/message bindings: NIEM personnel exchanges, secure SFTP batch reconciliation, JSON/REST case APIs, USMTF personnel messages.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not execute disbursement or account changes autonomously.
- Require authorized finance/personnel leadership approval before policy-impacting recommendations.
- If legal basis or identity integrity is uncertain, issue advisory-only options.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-military-pay-family-continuity-v1` with `protocol_stack_id=ps-personnel-finance-resilience-stack-v1`.
- Alternate: `tool_suite_id=ts-force-readiness-support-continuity-v1` with `protocol_stack_id=ps-niem-usmtf-personnel-stack-v1`.
- Degraded: manual case-priority board with verified callback loops.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Bind profiles via `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Enforce authority gates with `../_shared/references/warfighter-tool-authority-gates.md`.
