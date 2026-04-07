---
name: homeland-medical-countermeasure-pod-security-and-cold-chain-cell
description: Coordinate medical-countermeasure point-of-dispensing security, cold-chain assurance, and throughput decisions during domestic emergencies. Use when U.S. warfighters need POD recommendations that align life safety, public trust, and secure distribution.
---

# Homeland Medical Countermeasure POD Security And Cold Chain Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter POD security, medical-countermeasure distribution, and cold-chain continuity decisions.
- Confirm threat posture, countermeasure inventory, POD throughput targets, refrigeration constraints, and approval timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using population demand, POD layout, inventory status, escort requirements, and cold-chain risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, security burden, spoilage risk, and public confidence.
3. Identify branch triggers for queue instability, refrigeration failure, security incidents, and product-substitution constraints.
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

Primary products: POD protection plan, cold-chain assurance board, and countermeasure distribution packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-medical-countermeasure-pod-security-cold-chain-v1` with `protocol_stack_id=ps-homeland-medical-countermeasure-pod-security-cold-chain-stack-v1`.
- Alternate: select a mission-adjacent medical-logistics, mass-care, or casualty-regulation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: command-approved life-safety distribution only with manual queue control and no unsupported cold-chain claims.

## Domain Packet Defaults

- Default packet ID: `DPL-MCM-POD-COLDCHAIN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: POD throughput dashboard, refrigerated-inventory tracker, perimeter-security board, and patient-information release queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `CAP`, `NIEM`, signed custody manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If inventory status, cold-chain integrity, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported dose availability, insecure queue assumptions, cold-chain breaks, and inequitable release timing before recommending action.
- Do not fabricate stock levels, release authorization, or cold-chain compliance.
