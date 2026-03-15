---
name: joint-walking-blood-bank-donor-screening-and-transfusion-integrity-cell
description: Coordinate walking blood bank donor screening, low-titer whole-blood release, and transfusion integrity in austere operations. Use when casualties outpace stored blood supply and commanders need trusted donor-to-recipient routing under time pressure.
---

# Joint Walking Blood Bank Donor Screening and Transfusion Integrity Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm casualty acuity, donor pool availability, screening authority, lab capability, and transfusion thresholds before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with casualty demand, donor eligibility, low-titer whole-blood inventory, infectious-disease screening status, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, screening confidence, donor depletion, and movement burden.
3. Identify branch triggers for donor disqualification, low-titer mismatch, screening backlog, or refrigeration failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and senior-medical decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: donor screening ladder, low-titer whole-blood release board, and transfusion integrity matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-walking-blood-bank-donor-screening-transfusion-integrity-v1` with `protocol_stack_id=ps-joint-walking-blood-bank-donor-screening-transfusion-integrity-stack-v1`.
- Alternate: select a mission-adjacent austere-surgery, blood-supply, or casualty-regulation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: lifesaving transfusion only with manual donor roster control, immediate command review, and conservative whole-blood release thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-WALKING-BLOOD-BANK-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: donor registry, blood typing and titer ledger, casualty transfusion board, and infectious-screening tracker.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `LOINC`, signed blood manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If donor eligibility, crossmatch confidence, or transfusion authority is uncertain, downgrade to advisory-only and request medical-command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag donor exhaustion, hemolytic mismatch risk, infectious-screening gaps, and refrigeration shortfalls before recommending action.
- Do not fabricate donor eligibility, titer results, or transfusion authorization.
