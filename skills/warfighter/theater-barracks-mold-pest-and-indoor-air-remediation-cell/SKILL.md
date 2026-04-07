---
name: theater-barracks-mold-pest-and-indoor-air-remediation-cell
description: Restore safe barracks and temporary-quarters habitability by triaging mold, pests, and indoor-air contamination before they degrade force health, sleep, and readiness.
---

# Theater Barracks Mold Pest And Indoor Air Remediation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter barracks-habitability, remediation, and reoccupation decisions.
- Confirm affected facilities, occupancy load, environmental test posture, work-order authorities, and relocation capacity before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using occupancy density, air-quality data, mold or pest indicators, maintenance backlog, and health complaints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in health risk, remediation speed, relocation burden, and readiness impact.
3. Identify branch triggers for room closure, phased remediation, quarantine cleaning, pest-treatment surges, or mass relocation.
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

Primary products: barracks habitability board, remediation ladder, and room-reoccupancy tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-barracks-mold-pest-indoor-air-remediation-v1` with `protocol_stack_id=ps-theater-barracks-mold-pest-indoor-air-remediation-stack-v1`.
- Alternate: select a mission-adjacent housing, public-works, or preventive-medicine suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual room-status ledger with commander-approved relocation actions and no reoccupation until environmental review completes.

## Domain Packet Defaults

- Default packet ID: `DPL-BARRACKS-INDOOR-AIR-REMEDIATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: barracks habitability tracker, spore and IAQ assay board, pest-surveillance queue, and remediation work-order manager.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OPC UA`, environmental assay exchange, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If environmental-test validity, occupancy accountability, or reoccupation authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag asthma or allergy risk, vulnerable-occupant exposure, pest-borne disease indicators, and false-clearance pressure before recommending action.
- Do not fabricate test results, work completion, or habitability approvals.
