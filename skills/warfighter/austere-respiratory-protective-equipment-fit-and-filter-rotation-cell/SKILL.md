---
name: austere-respiratory-protective-equipment-fit-and-filter-rotation-cell
description: Manage respiratory PPE fit status, filter burn rates, and exposure-based resupply. Use when CBRN, wildfire, dust, smoke, or toxic-industrial threats make respirator readiness a pacing constraint.
---

# Austere Respiratory Protective Equipment Fit and Filter Rotation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm threat type, protection standard, force exposure, and medical authority before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the respiratory-protection problem, exposed force elements, and duration of risk.
2. Pull fit-test status, filter inventory, exposure indicators, and resupply constraints from the selected toolchain.
3. Build primary, alternate, and degraded issue or rotation paths with explicit protection and contamination triggers.
4. Bind recommendations to medical authority, commander risk acceptance, and staff ownership.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: fit and issue matrix, filter rotation ladder, exposure-based resupply board.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-RESPIRATORY-PROTECTION-FILTER-ROTATION-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-austere-respiratory-protection-fit-filter-rotation-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `HL7/FHIR`, CBRN `USMTF`, `API/JSON`, and signed inventory manifests for machine-to-machine exchanges.

## Guardrails

- Separate observed fit status and exposure data, assessed protection confidence, and unknowns.
- Flag expired fit tests, unverified exposure assumptions, and any recommendation that reduces protection without commander and medical approval.
- Keep human approval explicit before reusing filters outside approved limits or downgrading respiratory posture.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-austere-respiratory-protection-fit-filter-rotation-v1` with `protocol_stack_id=ps-austere-respiratory-protection-fit-filter-rotation-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-medical-readiness-stack-v1`.
- Degraded: mission-essential mask issue only with manual fit roster, exposure log, and commander-approved conservation measures.

## Domain Packet Defaults

- Default packet ID: `DPL-RESPIRATORY-PROTECTION-FILTER-ROTATION-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
