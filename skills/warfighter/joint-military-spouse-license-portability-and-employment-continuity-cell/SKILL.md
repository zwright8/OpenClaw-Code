---
name: joint-military-spouse-license-portability-and-employment-continuity-cell
description: Preserve military-spouse professional license portability, employer continuity, and household income stability during PCS, mobilization, evacuation, or prolonged disruption. Use when family income and spouse credential delays can degrade U.S. warfighter readiness or retention.
---

# Joint Military Spouse License Portability And Employment Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter spouse-license, employment, and household-income continuity decisions.
- Confirm affected installations or states, spouse profession, licensing deadlines, employer posture, childcare constraints, and command decision timelines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using PCS or activation timeline, license reciprocity status, employer continuity risk, household cash-flow pressure, and retention impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, legal sufficiency, privacy exposure, and spouse-employment resilience.
3. Identify branch triggers for temporary practice authority, employer separation, childcare breakdown, interstate licensing delay, and emergency hardship escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and spouse-employment risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: spouse-license portability matrix, employer continuity board, and household income risk tracker.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SPOUSE-LICENSE-318`, `tool_suite_id=ts-joint-military-spouse-license-portability-employment-continuity-v1`, and `protocol_stack_id=ps-joint-military-spouse-license-portability-employment-continuity-stack-v1`.
- Alternate: select a mission-adjacent family-readiness, reserve-mobilization, or legal-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs. Prefer `ts-workforce-license-transition-v1` when reciprocity, CEU, or employer-continuity issues need a shared baseline profile.
- Degraded: manual spouse-employment risk board with advisory-only guidance until licensing and employer constraints are human-validated.

## Domain Packet Defaults

- Default packet ID: `DPL-SPOUSE-LICENSE-EMPLOYMENT-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: license reciprocity tracker, state-board requirement matrix, employer continuity queue, and household income risk board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed verification letters, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Use the `Workforce License Portability and Employment Continuity` playbook when interstate reciprocity, CEU deadlines, or employer transitions must be synchronized with command timelines.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If licensing authority, employer commitments, or privacy controls are uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag licensing dead ends, employer retaliation risk, childcare-linked work gaps, and unsupported retention assumptions before recommending action.
- Do not fabricate reciprocity authority, employer agreements, or financial relief approvals.
