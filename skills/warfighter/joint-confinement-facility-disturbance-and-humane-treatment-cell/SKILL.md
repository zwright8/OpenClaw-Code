---
name: joint-confinement-facility-disturbance-and-humane-treatment-cell
description: Stabilize military confinement or detention facilities during unrest while preserving humane-treatment standards, medical access, and legal defensibility. Use when staffing, conditions, or disturbance indicators threaten control and legitimacy.
---

# Joint Confinement Facility Disturbance And Humane Treatment Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter confinement-facility stability, humane-treatment, and disturbance-response decisions.
- Confirm facility population, staffing posture, segregation status, medical and legal access, use-of-force authority, and humanitarian obligations before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using facility conditions, staffing gaps, incident indicators, rights-access requirements, and command decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in control, safety, humane-treatment compliance, and evidentiary defensibility.
3. Identify branch triggers for hunger strike, coordinated disturbance, medical surge, legal-access interruption, and emergency transfer.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and confinement-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: facility disturbance branch plan, humane-treatment compliance board, and transfer or medical-access tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-confinement-facility-disturbance-humane-treatment-v1` with `protocol_stack_id=ps-joint-confinement-facility-disturbance-humane-treatment-stack-v1`.
- Alternate: select a mission-adjacent military-police, detainee-governance, or legal-observability suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: hold-essential-control posture only with manual welfare checks, medical triage log, and explicit human approval for any force escalation.

## Domain Packet Defaults

- Default packet ID: `DPL-CONFINEMENT-HUMANE-TREATMENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: facility population board, incident or grievance ledger, staffing and segregation tracker, and medical or legal access scheduler.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CJIS`, signed confinement manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If legal basis, welfare-monitoring integrity, or use-of-force authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and disturbance acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe overcrowding, denied medical access, unverified incident claims, and unsupported force options before recommending action.
- Do not fabricate welfare checks, legal review, humanitarian access, or use-of-force justification.
