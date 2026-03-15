---
name: strategic-semiconductor-packaging-assurance-and-priority-allocation-cell
description: Assure strategic semiconductor packaging integrity and prioritize allocation under defense demand shocks. Use when military mission systems depend on constrained advanced packaging capacity and tamper-risk controls.
---

# Strategic Semiconductor Packaging Assurance and Priority Allocation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter strategic readiness.
- Confirm authority for allocation priorities, export-control constraints, and anti-tamper policy.
- Keep outputs advisory unless approved by designated command and policy authorities.

## Workflow

1. Build packaging-capacity and dependency map for mission-critical programs.
2. Detect integrity risk, counterfeit risk, and throughput bottlenecks.
3. Compare allocation branches by readiness impact, deterrence impact, and recovery speed.
4. Produce a commander/policy decision package with transparent tradeoffs.

## Required Output Format

1. Situation snapshot.
2. Recommended allocation branch.
3. Alternate/degraded branches.
4. Decision authorities and timing.
5. Staff actions and suspense.

## Domain Products

Primary products: packaging integrity risk ledger, allocation priority matrix, strategic recovery timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/joint-mission-data-contracts.md`.
- Include mission-assurance and trust checks from `../_shared/references/tool-health-and-trust-monitoring.md`.
- Bind tool/protocol selection to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-supply-shock-v1` with `protocol_stack_id=ps-semiconductor-fab-contingency-stack-v1`.
- Alternate: `tool_suite_id=ts-cyber-defense-v1` with `protocol_stack_id=ps-cyber-threat-stack-v1`.
- Degraded: manual priority board + signed custody ledger with daily revalidation.

## Guardrails

- Never bypass hardware integrity verification for schedule pressure.
- Clearly mark allocation assumptions and consequences of unmet demand.
- Escalate recommendations that alter strategic deterrence posture.
