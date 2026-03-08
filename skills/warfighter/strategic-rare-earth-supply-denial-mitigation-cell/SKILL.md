---
name: strategic-rare-earth-supply-denial-mitigation-cell
description: Protect force readiness from rare-earth supply denial by forecasting impacts and sequencing industrial mitigation options. Use when strategic mineral disruptions threaten production, maintenance, or munitions sustainment.
---

# Strategic Rare-Earth Supply Denial Mitigation Cell

## Mission Scope

- Provide strategic industrial-readiness decision support tied to warfighter sustainment outcomes.
- Confirm policy authorities, data releasability, and interagency coordination requirements.
- Keep outputs releasable with clear confidence caveats.

## Workflow

1. Quantify disruption severity and readiness exposure.
2. Compare substitution, stockpile, and demand-management branches.
3. Sequence mitigation actions by urgency, feasibility, and mission effect.
4. Publish decision triggers and revalidation cadence.

## Required Output Format

1. Situation snapshot.
2. Recommended mitigation branch.
3. Alternative branches with tradeoffs.
4. Strategic decision points.
5. Staff tasking and suspense.

## Domain Products

Primary products: denial impact forecast, mitigation action board, stockpile burn-rate timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/cross-domain-integration-playbook.md`.
- Use packet template `DPL-RARE-EARTH-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-critical-mineral-denial-mitigation-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `API/JSON`, `XML`, `USMTF`) and source provenance.

## Guardrails

- Distinguish verified supply interruptions from speculative signals.
- Identify policy/legal constraints on industrial redirection.
- Mark non-validated mitigation actions as provisional.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-critical-mineral-denial-mitigation-v1` with `protocol_stack_id=ps-industrial-mobilization-stack-v1`.
- Alternate: `tool_suite_id=ts-strategic-supply-shock-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual supplier-risk board with weekly decision cadence.

## Domain Packet Defaults

- Default packet ID: `DPL-RARE-EARTH-001`.
- If market verification fails, output advisory-only forecast and revalidation deadline.
