---
name: joint-specially-adapted-housing-automobile-allowance-and-home-accessibility-benefit-bridge-cell
description: Preserve Specially Adapted Housing (SAH or SHA), automobile allowance, and home-accessibility benefit continuity for catastrophically injured U.S. warfighters when discharge, mobility, or caregiver viability depends on rapid adaptive-benefit execution.
---

# Joint Specially Adapted Housing Automobile Allowance And Home Accessibility Benefit Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter adaptive-housing, mobility-benefit, and home-accessibility continuity decisions.
- Confirm injury severity, home-accessibility barriers, vehicle-mobility demand, grant posture, contractor or inspection backlog, and decision deadlines before recommending action.
- Keep outputs unclassified by default and minimize PHI or PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using grant eligibility, housing barriers, vehicle-adaptation needs, inspection status, and discharge or transition timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, mobility, caregiver burden, and administrative speed.
3. Identify branch triggers for grant denial, inspection delay, contractor shortfall, automobile-adaptation gap, and temporary-housing fallback.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and adaptive-benefit risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: adaptive-benefit board, housing or mobility grant ladder, and home-access continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SAHAA-335`, `tool_suite_id=ts-joint-specially-adapted-housing-automobile-allowance-home-accessibility-benefit-bridge-v1`, and `protocol_stack_id=ps-joint-specially-adapted-housing-automobile-allowance-home-accessibility-benefit-bridge-stack-v1`.
- Alternate: select a mission-adjacent wounded-warrior, housing-stability, or rehabilitation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual adaptive-benefit roster with advisory-only sequencing until eligibility, inspection evidence, and contractor capacity are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SAH-AUTOMOBILE-HOME-ACCESS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: housing-adaptation case board, grant or allowance queue, vehicle-modification tracker, and contractor or inspection ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed benefit determinations, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If eligibility evidence, inspection legitimacy, or contractor viability is uncertain, downgrade to advisory-only and request human rehabilitation or benefits review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe accessibility assumptions, unsupported grant promises, vehicle-mobility shortfalls, and contractor overcommitment before recommending action.
- Do not fabricate eligibility, award status, inspection outcomes, or home-modification completion.
