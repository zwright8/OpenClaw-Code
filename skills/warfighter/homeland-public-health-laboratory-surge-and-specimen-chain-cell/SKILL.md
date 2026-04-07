---
name: homeland-public-health-laboratory-surge-and-specimen-chain-cell
description: Coordinate public-health laboratory surge, specimen-chain integrity, and diagnostic-priority decisions during domestic response. Use when U.S. warfighters need trusted lab throughput recommendations tied to force protection, public health, and civil-authority coordination.
---

# Homeland Public Health Laboratory Surge And Specimen Chain Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter public-health laboratory surge and specimen-chain decisions during domestic operations.
- Confirm incident type, specimen backlog, laboratory capacity, reporting timelines, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using specimen demand, laboratory capacity, courier constraints, force-health risk, and public-health reporting timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in diagnostic speed, specimen integrity, public confidence, and military support burden.
3. Identify branch triggers for lab saturation, sample spoilage, courier disruption, and conflicting reporting authorities.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and civil-authority decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: lab-surge prioritization board, specimen-chain integrity tracker, and diagnostic-release decision packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-public-health-laboratory-surge-specimen-chain-v1` with `protocol_stack_id=ps-homeland-public-health-laboratory-surge-specimen-chain-stack-v1`.
- Alternate: select a mission-adjacent public-health, medical-regulation, or biosurveillance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual specimen board with advisory-only prioritization until chain-of-custody and reporting integrity are revalidated.

## Domain Packet Defaults

- Default packet ID: `DPL-PUBLIC-HEALTH-LAB-CHAIN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: specimen-chain dashboard, lab-capacity queue, courier tracker, and force-health reporting board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed specimen manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If specimen legitimacy, lab provenance, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported positivity claims, broken specimen custody, dual-reporting conflicts, and laboratory overmatch risk before recommending action.
- Do not fabricate laboratory results, custody records, or public-health approvals.
