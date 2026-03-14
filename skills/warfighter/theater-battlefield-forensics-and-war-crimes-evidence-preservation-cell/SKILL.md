---
name: theater-battlefield-forensics-and-war-crimes-evidence-preservation-cell
description: Coordinate battlefield forensics, protected-site handling, and legally defensible war-crimes evidence preservation for U.S. warfighter operations. Use when operational tempo and accountability requirements must be balanced without breaking custody integrity.
---

# Theater Battlefield Forensics And War Crimes Evidence Preservation Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm legal authorities, evidence-transfer rules, witness-protection constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with incident location, evidence fragility, threat-to-site, and legal transfer dependencies.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in evidence integrity, force protection, tempo, and civilian-harm risk.
3. Identify branch/sequel triggers, site-preservation thresholds, and command approval gates.
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

Primary products: evidence preservation board, custody handoff plan, and protected-site tasking matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-battlefield-forensics-war-crimes-preservation-v1` with `protocol_stack_id=ps-theater-battlefield-forensics-war-crimes-preservation-stack-v1`.
- Alternate: select a mission-adjacent battlefield forensics, legal attribution, or evidence-chain suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper custody log with delayed digital attestation, protected storage controls, and UTC witness confirmations.

## Domain Packet Defaults

- Default packet ID: `DPL-BATTLEFIELD-FORENSICS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: forensic custody ledger, geotagged evidence workflow, and legal handoff tracker.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed evidence manifests, `USMTF`, `NATO APP-11/ADatP-3 aligned`, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, evidence provenance, or witness integrity is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag LOAC, witness protection, detainee access, and contamination-control constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
