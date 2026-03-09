---
name: joint-denied-environment-medevac-blood-substitute-allocation-cell
description: Prioritize blood and oxygen-carrier substitute allocation when medevac lanes are degraded or denied.
---

# Joint Denied Environment Medevac Blood Substitute Allocation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm echelon, mission timeline, authorities, and commander decision points before analysis.
- Keep outputs unclassified by default unless handling instructions are provided.

## Workflow

1. Frame the mission problem with current conditions, assumptions, constraints, and required outcomes.
2. Build a primary option and at least two alternates with explicit risk, tempo, and sustainment tradeoffs.
3. Bind each option to external tool invocations, protocol pathways, and degraded-mode branches.
4. Define commander decision gates, branch triggers, and staff actions with owners and suspense.
5. Publish both a machine-ingestible packet and a commander-facing summary.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended option with rationale.
3. Alternatives with trigger conditions.
4. Decision points and timing.
5. Staff task tracker (owner, suspense, status).
6. Confidence, gaps, and revalidation time.

## Domain Products

Primary products for this skill: medical scarcity priority board, casualty transport branch tree, blood-substitute release authority matrix.

## Tool Suite and Protocol Binding

- Bind tool selection to `ts-denied-medevac-blood-substitute-v1` and `ps-denied-medevac-blood-substitute-stack-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Recommended external tools for this domain: theater medevac regulation systems, blood inventory ledgers, role 2/3 bed status dashboards, and tactical convoy trackers.
- Required protocol families for implementation: HL7 FHIR, STANAG 2132, USMTF, and CoT.
- Include `tool_suite_id`, `protocol_stack_id`, `primary_exchange_path`, `degraded_exchange_method`, `latency_budget_seconds`, and `ack_timeout_seconds` for each critical recommendation.

## Tool Invocation Contract

- For each external tool call include objective, required inputs, action/query template, expected output schema, transport protocol, fallback path, and validation owner.
- Map each tool output to a concrete decision point so operators can quickly validate mission relevance.
- If a tool is unavailable or stale, publish a degraded-mode branch with confidence impact and timing impact.

## Guardrails

- Treat this skill as advisory and planning support only.
- Require human command approval before recommendations that can change force posture, targeting, escalation, or weapons employment.
- Separate confirmed facts, assessed judgments, and unknowns.
- Flag legal/ROE/policy constraints and coalition interoperability risks explicitly.

## Required Shared References

- `../_shared/references/mission-assurance-checklist.md`
- `../_shared/references/external-tools-protocols.md`
- `../_shared/references/tool-protocol-playbooks.md`
- `../_shared/references/human-agent-command-escalation-matrix.md`
- `../_shared/references/warfighter-tool-authority-gates.md`
- `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`
