---
name: joint-uniform-replacement-clothing-allowance-and-serviceability-bridge-cell
description: Preserve uniform replacement, clothing-allowance legitimacy, insignia or tailoring correction, and serviceability evidence when damaged or missing uniforms threaten U.S. warfighter training, duty, inspection, or mobilization timelines.
---

# Joint Uniform Replacement Clothing Allowance And Serviceability Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter uniform-serviceability, clothing-allowance, and appearance-readiness continuity decisions.
- Confirm affected population, service-component policy, serviceability deficiency, inspection or reporting timeline, clothing-allowance posture, and supply authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using missing or unserviceable uniform items, clothing-allowance timing, insignia or tailoring needs, inspection or training deadline, and readiness impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, regulatory compliance, fiscal legitimacy, and supply burden.
3. Identify branch triggers for failed inspection risk, damaged field gear, allowance denial, tailoring backlog, and serviceability evidence mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and uniform-serviceability risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: uniform serviceability board, clothing-allowance decision ladder, and appearance-readiness continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-UNIFORM-377`, `tool_suite_id=ts-joint-uniform-replacement-clothing-allowance-serviceability-bridge-v1`, and `protocol_stack_id=ps-joint-uniform-replacement-clothing-allowance-serviceability-bridge-stack-v1`.
- Alternate: select a mission-adjacent supply, mobilization, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual uniform-deficiency roster with advisory-only sequencing until serviceability evidence, allowance posture, and human supply review are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-UNIFORM-REPLACEMENT-ALLOWANCE-SERVICEABILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: replacement-uniform request board, annual clothing-allowance ledger, serviceability inspection tracker, and insignia or tailoring queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed issue notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If serviceability evidence, allowance authority, or item-issue legitimacy is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and serviceability clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported issue promises, counterfeit items, failed-inspection risk, and allowance-legitimacy gaps before recommending action.
- Do not fabricate issue status, clothing-allowance approval, tailoring completion, or serviceability certification.
