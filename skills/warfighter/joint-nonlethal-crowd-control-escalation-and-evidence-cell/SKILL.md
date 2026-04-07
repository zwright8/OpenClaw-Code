---
name: joint-nonlethal-crowd-control-escalation-and-evidence-cell
description: Coordinate nonlethal crowd-control posture, escalation-of-force decisions, and evidentiary accountability. Use when commanders must balance force protection, civil legitimacy, and documented use-of-force under stress.
---

# Joint Nonlethal Crowd Control Escalation And Evidence Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter crowd-control, use-of-force, and legitimacy decisions.
- Confirm mission authority, crowd composition, protected-site risk, medical coverage, nonlethal inventory, and evidence-capture coverage before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using crowd behavior, protected assets, current posture, escalation thresholds, and command decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in force protection, civilian harm reduction, evidence sufficiency, and mission access.
3. Identify branch triggers for barrier breach, projectile escalation, nonlethal ammunition depletion, detainee overflow, and media scrutiny.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and crowd-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: escalation-of-force ladder, nonlethal employment matrix, and evidence custody board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-nonlethal-crowd-control-evidence-v1` with `protocol_stack_id=ps-joint-nonlethal-crowd-control-evidence-stack-v1`.
- Alternate: select a mission-adjacent military-police, civil-affairs, or public-affairs suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: physical barrier and voice-command posture only with manual incident logging and explicit human release authority.

## Domain Packet Defaults

- Default packet ID: `DPL-NONLETHAL-CROWD-EOF-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: crowd-density map, nonlethal munitions ledger, incident-evidence sync board, and casualty or detainee monitor.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CJIS`, signed evidence manifests, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If legal basis, munition release authority, or evidence-capture integrity is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and chain-of-custody acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unconfirmed legal authority, inadequate medical support, opaque evidence capture, and nonlethal depletion before recommending action.
- Do not fabricate crowd behavior, injury counts, approvals, or evidentiary sufficiency.
