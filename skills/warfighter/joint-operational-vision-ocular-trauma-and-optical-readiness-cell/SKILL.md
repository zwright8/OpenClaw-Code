---
name: joint-operational-vision-ocular-trauma-and-optical-readiness-cell
description: Coordinate ocular trauma triage, protective eyewear, and optical-device readiness for U.S. warfighters. Use when commanders need to preserve vision, laser safety, and mission-essential optics in austere or high-threat conditions.
---

# Joint Operational Vision, Ocular Trauma, And Optical Readiness Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter vision protection, eye-injury response, and optical-readiness decisions.
- Confirm echelon, casualty load, laser or particulate exposure risk, optical-device shortages, evacuation timelines, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with ocular casualty reports, protective-eyewear posture, optical-device readiness, laser or dust exposure indicators, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in vision salvage, sortie or patrol continuity, evacuation burden, and sustainment demand.
3. Identify branch triggers for eye-shielding posture, optical-device redistribution, ophthalmic evacuation, and laser-safety restrictions.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: ocular readiness dashboard, ocular trauma and evacuation plan, and optical-device allocation board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-operational-vision-ocular-trauma-optical-readiness-v1` with `protocol_stack_id=ps-joint-operational-vision-ocular-trauma-optical-readiness-stack-v1`.
- Alternate: select a mission-adjacent medical, aviation-safety, or sensor-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper eye-injury ledger, manual eyewear accountability, and UTC evacuation readback.

## Domain Packet Defaults

- Default packet ID: `DPL-OCULAR-TRAUMA-OPTICAL-READINESS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: ophthalmic exam workflow, optical-device readiness ledger, laser-exposure incident tracker, and ocular evacuation board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `DICOM`, signed optical-device manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If vision-salvage timing, optical pedigree, or medical authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag globe-rupture risk, retinal injury, laser-safety violations, contaminated optics, and protected-health-data boundaries before recommending action.
- Do not fabricate casualty status, device pedigree, or medical approvals.
