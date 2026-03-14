---
name: coalition-maritime-insurance-sanctions-and-convoy-underwriting-cell
description: Support coalition maritime continuity by adjudicating sanctions-compliant convoy underwriting, insurer posture, and escort risk. Use when maritime force flow or commercial lift depends on insurance, legal, and convoy decisions.
---

# Coalition Maritime Insurance Sanctions And Convoy Underwriting Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for coalition warfighter missions in this domain.
- Confirm releasability, sanctions authorities, partner caveats, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with convoy routes, insurer posture, sanctions exposure, escort availability, and political constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, compliance, escalatory risk, and coalition burden-sharing.
3. Identify branch/sequel triggers, underwriting failure thresholds, and command approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: underwriting matrix, sanctions decision ladder, and convoy assurance brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-maritime-insurance-sanctions-and-convoy-underwriting-cell-v1` with `protocol_stack_id=ps-coalition-maritime-insurance-sanctions-and-convoy-underwriting-cell-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: manual underwriting board with legal-review checkpoints, escort release logging, and UTC readback confirmation.

## Domain Packet Defaults

- Default packet ID: `DPL-MARITIME-INSURANCE-UNDERWRITE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: insurance risk engines, sanctions-evasion anomaly boards, and convoy liability planners.
- Preferred protocol profiles for coordination and machine exchange: NATO APP-11/ADatP-3 aligned exchange, `AIS/NMEA`, `STIX/TAXII`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, or provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag legal, policy, sanctions, and coalition caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
