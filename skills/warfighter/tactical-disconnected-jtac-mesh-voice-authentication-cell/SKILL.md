---
name: tactical-disconnected-jtac-mesh-voice-authentication-cell
description: Authenticate JTAC voice traffic and deconflict terminal-control timelines in disconnected mesh environments. Use when spoofed voice or delayed links could cause fratricide or release errors.
---

# Tactical Disconnected JTAC Mesh Voice Authentication Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm command echelon, authorities, operational constraints, data handling boundaries, and required decision timeline.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using current threat picture, mission objectives, and force constraints.
2. Identify assumptions, invalidation indicators, and branch trigger criteria.
3. Build one primary option plus at least one alternate with explicit tradeoffs in tempo, survivability, interoperability, and escalation risk.
4. Bind recommendations to cross-domain dependencies across C2, intelligence, fires/effects, protection, sustainment, and information.
5. Produce commander-facing and staff-facing outputs with owners, suspense, and acknowledgment requirements.

## Required Output Format

Deliver in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternatives and branch triggers.
4. Decision points and timing.
5. Staff tasking with owners/suspense.
6. Tool invocation packet summary with protocol details.

## Domain Products

Primary products for this skill: authenticated terminal-control ledger, voice trust exception report, fires release branch plan.

## Domain Tool Stack

Use these tool categories as the baseline stack: voice identity scoring services, terminal-control timeline reconcilers, fire-support conflict monitors.

## Protocol Profile

Preferred protocol families for this skill: VMF, ACP 127, signed voice-confidence manifests.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-disconnected-jtac-voice-auth-v1` with `protocol_stack_id=ps-disconnected-jtac-voice-auth-stack-v1`.
- Alternate: `tool_suite_id=ts-jadc2-data-contract-drift-auditor-v1` with `protocol_stack_id=ps-jadc2-data-contract-drift-auditor-stack-v1`.
- Degraded: command-approved manual workflow with UTC acknowledgment logging and confidence downgrade.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select mission-fit tool and protocol bindings.
- Use `../_shared/references/joint-operations-external-toolchain-profiles.md` and bind each critical recommendation to primary and cross-check systems.
- Use `../_shared/references/external-tool-endpoints-and-adapters.md` to define endpoint contracts, transport modes, timeout/retry behavior, and degraded fallback.
- Include `tool_suite_id`, `protocol_stack_id`, `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.

## Interoperability and Assurance Gates

- Run `../_shared/references/mission-assurance-checklist.md` before release.
- Run `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Apply authority controls from `../_shared/references/warfighter-tool-authority-gates.md` and `../_shared/references/human-agent-command-escalation-matrix.md`.
- If data freshness, authority, or protocol acknowledgment is uncertain, downgrade to advisory-only and require human command review.

## Tool Invocation Contract

For each critical external dependency include:

- Objective and decision linkage.
- Required input schema and validation checks.
- Query or action template.
- Expected output schema and freshness SLA.
- Transport protocol and acknowledgment timeout.
- Degraded-mode fallback path and confidence impact.

## Domain Packet Defaults

- Default packet IDs: DPL-DISCONNECTED-JTAC-VOICE-AUTH-001, DPL-MULTI-DOMAIN-BATTLE-RHYTHM-FRAGMENT-RECOVERY-001.
- If no packet fully matches, define a provisional packet and assign a validation owner before release.

## Guardrails

- Distinguish facts, assessments, and unknowns.
- Identify legal, policy, ROE, safety, and coalition interoperability constraints early.
- Do not fabricate intelligence, authorities, approvals, or system connectivity.
- Require explicit commander/legal review for recommendations that can materially alter force posture or escalation risk.
