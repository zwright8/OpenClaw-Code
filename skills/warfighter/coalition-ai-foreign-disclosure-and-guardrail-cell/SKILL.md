---
name: coalition-ai-foreign-disclosure-and-guardrail-cell
description: Decide what mission AI models, outputs, and guardrails can be disclosed to coalition partners without violating releasability, data rights, or operational-security limits. Use when U.S. warfighters want coalition AI interoperability, shared models, or partner access to AI-generated recommendations.
---

# Coalition Ai Foreign Disclosure And Guardrail Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter coalition AI releasability, guardrail enforcement, and partner-access decisions.
- Confirm classification boundaries, data-rights posture, coalition caveats, model provenance, and mission urgency before recommending action.
- Keep outputs unclassified by default unless model internals, training data, or release authorities require protected handling.

## Workflow

1. Frame the mission problem with requested model or output scope, coalition participants, releasability limits, guardrail requirements, and operational dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in partner speed, operational value, disclosure risk, and model assurance.
3. Identify branch triggers for partial-output release, model-withholding, policy override request, or fallback to non-AI workflow.
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

Primary products: releasability decision matrix, guardrail enforcement plan, and coalition AI release packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-ai-foreign-disclosure-guardrail-v1` with `protocol_stack_id=ps-coalition-ai-foreign-disclosure-guardrail-stack-v1`.
- Alternate: select a mission-adjacent coalition-interoperability, mission-AI assurance, or special-access governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: provide advisory-only outputs with no model transfer, sanitized rationale, and human release approval for every coalition-facing product.

## Domain Packet Defaults

- Default packet ID: `DPL-COALITION-AI-GUARDRAILS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: foreign-disclosure review board, model provenance ledger, guardrail policy registry, and coalition-access audit queue.
- Preferred protocol profiles for coordination and machine exchange: signed model manifests, `X.509`, `NIEM`, `API/JSON`, `S/MIME`, and `STIX/TAXII`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If disclosure authority, model provenance, or guardrail completeness is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend coalition release that bypasses foreign-disclosure, export-control, or model-safety requirements.
- Flag training-data sensitivity, prompt-injection exposure, and partner auditability gaps before approving any AI-enabled exchange.
