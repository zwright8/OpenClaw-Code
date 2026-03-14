---
name: joint-austere-oxygen-generation-and-ventilator-load-shed-cell
description: Support U.S. warfighter planning for austere oxygen generation, ventilator prioritization, and controlled clinical load shedding. Use when medical survival depends on balancing oxygen, power, and ventilator capacity under attack or disruption.
---

# Joint Austere Oxygen Generation And Ventilator Load Shed Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm casualty load, oxygen generation or storage state, ventilator readiness, and medical-command thresholds before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Build the current oxygen, ventilator, power, and patient-priority picture.
2. Identify imminent shortages, biomedical failures, and survivability tradeoffs if load exceeds capacity.
3. Build primary, alternate, and degraded sustainment paths with explicit transfer, rationing, and load-shed triggers.
4. Bind recommendations to medical packets, biomedical checks, and medical-command approval gates.

## Required Output Format

1. Situation snapshot.
2. Recommended continuity path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, transfer actions, and suspense.

## Domain Products

Primary products: oxygen generation ladder, ventilator allocation board, lifesaving load-shed packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-OXYGEN-VENTILATOR-LOADSHED-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-austere-oxygen-generation-ventilator-load-shed-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `HL7/FHIR`, `USMTF`, `API/JSON`, and signed biomedical maintenance manifests.

## Guardrails

- Separate confirmed patient needs, assumed oxygen duration, and unverified biomedical status.
- Flag any path that drops lifesaving support without explicit medical-command approval.
- Keep human approval explicit for clinical load shedding, vent reallocation, or evacuation reprioritization.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-austere-oxygen-generation-ventilator-load-shed-v1` with `protocol_stack_id=ps-joint-austere-oxygen-generation-ventilator-load-shed-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-joint-austere-oxygen-generation-ventilator-load-shed-stack-v1`.
- Degraded: lifesaving-only ventilation with manual oxygen roster, bedside triage log, and commander-approved clinical thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-OXYGEN-VENTILATOR-LOADSHED-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
