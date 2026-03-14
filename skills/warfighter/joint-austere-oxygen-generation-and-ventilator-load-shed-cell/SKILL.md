---
name: joint-austere-oxygen-generation-and-ventilator-load-shed-cell
description: Support U.S. warfighter planning for austere oxygen generation, ventilator prioritization, and lifesaving load-shed decisions when damaged medical networks cannot sustain total demand.
---

# Joint Austere Oxygen Generation And Ventilator Load Shed Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm medical command authority, oxygen production state, casualty load, and clinical thresholds before recommending action.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Establish oxygen generation, storage, ventilator demand, backup power, and biomedical maintenance posture.
2. Identify the bottlenecks and failure branches most likely to force harmful clinical tradeoffs.
3. Build primary, alternate, and degraded medical branches with explicit survivability, purity, and staffing tradeoffs.
4. Bind recommendations to oxygen packets, ventilator allocation decisions, and medical approval gates.

## Required Output Format

1. Situation snapshot.
2. Recommended oxygen-support path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking, clinical actions, and revalidation triggers.

## Domain Products

Primary products: oxygen generation ladder, ventilator allocation board, lifesaving load-shed packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-OXYGEN-VENTILATOR-LOADSHED-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-joint-austere-oxygen-generation-ventilator-load-shed-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `HL7/FHIR`, `USMTF`, `API/JSON`, and signed biomedical maintenance manifests.

## Guardrails

- Separate validated patient data and equipment state from assumptions and unknowns.
- Flag any plan that outruns oxygen purity limits, power availability, or safe staffing thresholds.
- Keep human approval explicit for clinical load shedding, ventilator reallocation, or lifesaving-only posture changes.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-austere-oxygen-generation-ventilator-load-shed-v1` with `protocol_stack_id=ps-joint-austere-oxygen-generation-ventilator-load-shed-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-joint-austere-oxygen-generation-ventilator-load-shed-stack-v1`.
- Degraded: lifesaving-only ventilation with commander-approved clinical triage thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-OXYGEN-VENTILATOR-LOADSHED-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
