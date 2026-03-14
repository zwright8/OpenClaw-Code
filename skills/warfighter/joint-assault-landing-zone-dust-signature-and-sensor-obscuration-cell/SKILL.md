---
name: joint-assault-landing-zone-dust-signature-and-sensor-obscuration-cell
description: Assess dust, brownout, and sensor-obscuration risk at assault landing zones. Use when aviation and ground forces need landing-zone viability decisions under degraded visibility and rotorwash.
---

# Joint Assault Landing Zone Dust Signature and Sensor Obscuration Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm lift force, landing-zone authority, weather and soil state, and visibility minima before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the landing-zone problem, sortie sequence, and obscuration constraints.
2. Pull weather, soil, dust forecast, and sensor obscuration data from the selected toolchain.
3. Build primary, alternate, and degraded landing or diversion paths with explicit brownout and cue-loss triggers.
4. Bind recommendations to air-mission approval, ground-force acknowledgment, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: landing-zone viability matrix, brownout risk ladder, sortie and lift sequencing board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-ASSAULT-LZ-DUST-OBSCURATION-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-assault-landing-zone-dust-obscuration-control-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `OGC`, `AIXM/FIXM`, `VMF`, `API/JSON`, and `USMTF` for machine-to-machine exchanges.

## Guardrails

- Separate observed environmental data, assessed obscuration risk, and unknowns.
- Flag stale weather feeds, unverified soil assumptions, and any landing recommendation that outruns minima or crew currency.
- Keep human approval explicit before changing landing profiles, routing casualties, or downgrading visibility controls.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-assault-landing-zone-dust-obscuration-control-v1` with `protocol_stack_id=ps-joint-assault-landing-zone-dust-obscuration-control-stack-v1`.
- Alternate: `tool_suite_id=ts-airfield-recovery-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Degraded: daylight or marked landing-zone operations only with manual dust observation and voice control.

## Domain Packet Defaults

- Default packet ID: `DPL-ASSAULT-LZ-DUST-OBSCURATION-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
