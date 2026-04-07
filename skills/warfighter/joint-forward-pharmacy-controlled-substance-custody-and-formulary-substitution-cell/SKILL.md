---
name: joint-forward-pharmacy-controlled-substance-custody-and-formulary-substitution-cell
description: Sustain forward pharmacy custody, medication cold-chain integrity, and therapeutically safe formulary substitutions for U.S. warfighters when supply, security, or evacuation stress disrupts standard access.
---

# Joint Forward Pharmacy Controlled Substance Custody And Formulary Substitution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter medication-custody, substitution, and diversion-control decisions.
- Confirm prescribing authorities, patient-priority classes, cold-chain posture, controlled-substance accountability, and resupply timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using medication demand, controlled-substance balances, cold-chain status, formulary gaps, and clinical risk thresholds.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in treatment continuity, diversion risk, storage burden, and legal defensibility.
3. Identify branch triggers for substitution, quarantine, escorted resupply, destruction, or emergency reissue.
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

Primary products: pharmacy custody ledger, formulary substitution board, and medication-risk branch tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-forward-pharmacy-controlled-substance-formulary-substitution-v1` with `protocol_stack_id=ps-joint-forward-pharmacy-controlled-substance-formulary-substitution-stack-v1`.
- Alternate: select a mission-adjacent surgical, medical-logistics, or patient-movement suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper custody ledger with dual-signature issue logs and physician-approved substitution board only.

## Domain Packet Defaults

- Default packet ID: `DPL-FORWARD-PHARMACY-CONTROLLED-SUBSTANCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: pharmacy inventory ledger, controlled-substance custody tracker, cold-chain monitor, and formulary substitution board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed controlled-substance manifests, `NIEM`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If prescribing authority, patient identity, custody provenance, or substitution safety is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag diversion exposure, counterfeit risk, cold-chain breaks, allergy or interaction hazards, and patient-privacy concerns before recommending action.
- Do not fabricate prescriptions, inventory balances, or controlled-substance release authority.
