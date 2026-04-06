---
name: theater-disconnected-additive-repair-intent-validation-cell
description: Validate disconnected additive-repair intent, approved part substitutions, and digital work-order trust. Use when field maintenance teams must manufacture or repair from partially disconnected data in contested theaters.
---

# Theater Disconnected Additive Repair Intent Validation Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter disconnected maintenance, additive repair governance, and digital work-order trust decisions.
- Confirm platform type, repair authority, available technical data, machine state, and inspection standards before recommending action.
- Keep outputs unclassified by default unless platform vulnerabilities, controlled drawings, or mission-specific damage patterns require protected handling.

## Workflow

1. Frame the mission problem using damage state, authorized repair intent, file pedigree, machine readiness, and operational urgency.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in repair speed, airworthiness or safety confidence, material availability, and mission impact.
3. Identify branch triggers for signature mismatch, substitution rejection, machine drift, and post-print inspection failure.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and maintenance-lead decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: repair-intent validation packet, approved substitution matrix, and print-and-install release board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-disconnected-additive-repair-intent-validation-v1` with `protocol_stack_id=ps-theater-disconnected-additive-repair-intent-validation-stack-v1`.
- Alternate: select a mission-adjacent additive-manufacturing, sustainment, or cyber-assurance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual technical-order review with commander-approved no-print list and limited substitution authority.

## Domain Packet Defaults

- Default packet ID: `DPL-ADDITIVE-INTENT-VALIDATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: additive work-order ledger, CAD or hash verifier, machine health board, and parts pedigree tracker.
- Preferred protocol profiles for coordination and machine exchange: signed build manifests, `API/JSON`, `STIX/TAXII`, `USMTF`, and `OPC UA`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If digital pedigree, engineering authority, or inspection release confidence is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag signature mismatch, hidden-fracture risk, material substitution drift, and machine-calibration gaps before recommending action.
- Do not fabricate engineering release, part pedigree, or post-repair airworthiness claims.
