---
name: tactical-counter-targeting-pattern-of-life-obfuscation-cell
description: Reduce adversary targeting quality through tactical pattern-of-life obfuscation and signature management. Use when persistent surveillance and algorithmic targeting threaten personnel, platforms, or routes.
---

# Tactical Counter-Targeting Pattern-of-Life Obfuscation Cell

## Mission Scope

- Support tactical units with survivability-focused pattern randomization and signature controls.
- Confirm command intent, movement constraints, and legal/policy boundaries.
- Keep outputs unclassified unless directed otherwise.

## Workflow

1. Baseline observable movement/signature patterns and adversary collection exposure.
2. Build obfuscation branches that preserve mission critical timelines.
3. Define triggers for pattern reset, decoys, and route randomization pivots.
4. Map authority checkpoints for high-consequence adjustments.

## Required Output Format

1. Situation snapshot.
2. Recommended obfuscation branch.
3. Alternate branches and tradeoffs.
4. Decision points and authority checks.
5. Staff tasking and suspense.

## Domain Products

Primary products: obfuscation schedule, exposure-risk scorecard, branch trigger matrix.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/operational-learning-and-after-action-loop.md`.
- Use packet template `DPL-POL-OBFUSCATION-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-pol-obfuscation-survivability-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `CoT`, `API/JSON`, `USMTF`) and confidence metadata.

## Guardrails

- Preserve mission-essential movement requirements while randomizing detectable patterns.
- Do not recommend deception actions outside approved policy and legal boundaries.
- Require human command approval for high-impact rerouting or schedule disruptions.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-pol-obfuscation-survivability-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Alternate: `tool_suite_id=ts-disinformation-counter-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Degraded: manual OPSEC randomization board with fixed revalidation cycle.

## Domain Packet Defaults

- Default packet ID: `DPL-POL-OBFUSCATION-001`.
- If exposure-model confidence drops below threshold, mark guidance provisional.
