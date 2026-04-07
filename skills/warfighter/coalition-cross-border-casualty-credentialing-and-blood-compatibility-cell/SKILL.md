---
name: coalition-cross-border-casualty-credentialing-and-blood-compatibility-cell
description: Harmonize coalition cross-border casualty transfer, clinician credentialing, and blood-product compatibility when multi-nation treatment routes and emergency authorizations are under time pressure.
---

# Coalition Cross Border Casualty Credentialing and Blood Compatibility Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm patient movement authorities, receiving-facility credentials, blood-product standards, coalition caveats, and legal constraints before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with casualty acuity, destination options, clinician credentialing status, blood compatibility constraints, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, transfer speed, legal confidence, and coalition interoperability.
3. Identify branch triggers for emergency privileging, blood-substitution approval, border-clearance delay, or alternate-route diversion.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and coalition decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: casualty transfer board, credentialing and blood-compatibility ladder, and coalition route-release matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-cross-border-casualty-credentialing-blood-compatibility-v1` with `protocol_stack_id=ps-coalition-cross-border-casualty-credentialing-blood-compatibility-stack-v1`.
- Alternate: select a mission-adjacent coalition medevac, role 3 medical, or legal-routing suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: lifesaving transfers only with paper credential packets, manual blood checks, and command-approved exception routing.

## Domain Packet Defaults

- Default packet ID: `DPL-CROSS-BORDER-CASUALTY-CREDENTIALING-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: clinician credential registry, blood compatibility ledger, patient movement tracker, and cross-border clearance board.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed blood manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If credential validity, blood compatibility, or border-clearance authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag incompatible blood standards, licensure gaps, sovereignty constraints, and delay-driven survivability risk before recommending action.
- Do not fabricate lab values, credential reciprocity, or transfer approvals.
