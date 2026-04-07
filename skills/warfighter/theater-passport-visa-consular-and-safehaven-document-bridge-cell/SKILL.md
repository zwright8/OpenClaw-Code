---
name: theater-passport-visa-consular-and-safehaven-document-bridge-cell
description: Bridge passports, visas, consular actions, and safehaven documentation for warfighters and dependents during theater disruption. Use when evacuation, onward movement, or protective relocation is blocked by travel-document or host-nation paperwork failure.
---

# Theater Passport Visa Consular And Safehaven Document Bridge Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter theater evacuation, dependent movement, and safehaven routing when travel-document continuity is degraded.
- Confirm affected population, document-loss categories, embassy or consular posture, host-nation constraints, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using passport and visa status, consular-access posture, safehaven capacity, dependent movement demand, and border-control constraints.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in movement speed, diplomatic friction, family protection, and document fraud risk.
3. Identify branch triggers for emergency travel documents, visa waivers, manifest mismatch, and safehaven routing failure.
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

Primary products: travel-document recovery board, consular action ladder, and safehaven clearance packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CONSULAR-293`, `tool_suite_id=ts-theater-passport-visa-consular-safehaven-document-bridge-v1`, and `protocol_stack_id=ps-theater-passport-visa-consular-safehaven-document-bridge-stack-v1`.
- Alternate: select a mission-adjacent family-evacuation, legal-assistance, or host-nation access suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual manifest and document ledger with advisory-only movement sequencing until identity and border-acceptance are confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PASSPORT-VISA-SAFEHAVEN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: passport or visa status board, consular action tracker, dependent manifest ledger, and safehaven clearance queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `ICAO Doc 9303`, signed consular notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If identity evidence, consular authority, or border-clearance status is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Protect PII, movement security, asylum or refuge sensitivities, and diplomatic legitimacy before recommending action.
- Do not fabricate document status, embassy approvals, visa waivers, or border acceptance.
