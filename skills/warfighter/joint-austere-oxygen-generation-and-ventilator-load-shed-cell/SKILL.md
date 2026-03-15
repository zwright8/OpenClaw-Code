---
name: joint-austere-oxygen-generation-and-ventilator-load-shed-cell
description: Coordinate oxygen generation, ventilator allocation, and clinical load shedding in austere medical networks. Use when oxygen production, storage, or power limits make life-support prioritization unavoidable.
---

# Joint Austere Oxygen Generation And Ventilator Load Shed Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm medical authority, clinical triage thresholds, biomedical maintenance ownership, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with oxygen output, ventilator status, patient categories, and backup-power constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lifesaving coverage, clinical risk, casualty flow, and equipment sustainability.
3. Identify branch or sequel triggers, treatment hold points, and release-approval gates.
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

Primary products: oxygen generation ladder, ventilator allocation board, and lifesaving load-shed packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-austere-oxygen-generation-ventilator-load-shed-v1` with `protocol_stack_id=ps-joint-austere-oxygen-generation-ventilator-load-shed-stack-v1`.
- Alternate: select a mission-adjacent medical-force-health, hospital-utility, or patient-movement suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: lifesaving-only ventilation with commander-approved clinical triage thresholds.

## Domain Packet Defaults

- Default packet ID: `DPL-OXYGEN-VENTILATOR-LOADSHED-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: oxygen plant controller, ventilator fleet tracker, and clinical load-shed board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `USMTF`, `API/JSON`, and signed biomedical maintenance manifests.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, oxygen purity, biomedical readiness, or medical-command approval is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag lifesaving triage, device readiness, oxygen-purity, and casualty-diversion risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
