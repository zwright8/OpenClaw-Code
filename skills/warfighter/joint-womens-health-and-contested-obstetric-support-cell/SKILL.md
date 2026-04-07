---
name: joint-womens-health-and-contested-obstetric-support-cell
description: Coordinate women's health care, gynecologic emergencies, and contested obstetric support for U.S. warfighters and mission-essential dependents. Use when privacy, maternal-fetal safety, and transport decisions affect readiness and survivability.
---

# Joint Women's Health And Contested Obstetric Support Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter women's health, obstetric contingency, and privacy-sensitive care-routing decisions.
- Confirm patient categories, obstetric or gynecologic acuity, specialty capacity, privacy constraints, transport timelines, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with patient acuity, maternal-fetal risk, blood or surgical support, transport access, privacy requirements, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, readiness, transport burden, and care continuity.
3. Identify branch triggers for emergency delivery, hemorrhage control, gynecologic surgery, privacy-preserving relocation, and higher-echelon transfer.
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

Primary products: women's health care-routing plan, obstetric risk board, and maternal evacuation ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-womens-health-contested-obstetric-support-v1` with `protocol_stack_id=ps-joint-womens-health-contested-obstetric-support-stack-v1`.
- Alternate: select a mission-adjacent Role 3, surgical, or shelter-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper maternal-risk ledger, protected voice handoff, and manual transport-release board.

## Domain Packet Defaults

- Default packet ID: `DPL-WOMENS-HEALTH-OBSTETRIC-SUPPORT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: maternal-fetal risk board, gynecologic care-routing workflow, blood and ultrasound readiness ledger, and protected patient-movement queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `DICOM`, signed maternal-transfer manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If patient consent posture, maternal-fetal acuity, or specialty capability is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag hemorrhage risk, privacy or consent boundaries, maternal-fetal transport hazards, and protected-health-data exposure before recommending action.
- Do not fabricate patient status, pregnancy data, or medical approvals.
