---
name: battlefield-grave-registration-and-interment-site-integrity-cell
description: Preserve dignified battlefield grave registration, temporary interment-site integrity, and future recovery confidence under combat conditions. Use when remains must be documented, protected, or revisited before permanent evacuation is possible.
---

# Battlefield Grave Registration And Interment Site Integrity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter battlefield grave registration, temporary interment, and future recovery-confidence decisions.
- Confirm site security, identification confidence, cultural or religious constraints, and mortuary authority before recommending action.
- Keep outputs unclassified by default unless remains-identification details, site coordinates, or evidentiary concerns require protected handling.

## Workflow

1. Frame the mission problem with remains status, site security, identification evidence, environmental exposure, and future recovery options.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in dignity, accountability, site survivability, and recovery speed.
3. Identify branch triggers for temporary interment, guarded hold, site relocation, or protected recovery revisit.
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

Primary products: grave registration ledger, site integrity matrix, and recovery revisit packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-battlefield-grave-registration-interment-site-integrity-v1` with `protocol_stack_id=ps-battlefield-grave-registration-interment-site-integrity-stack-v1`.
- Alternate: select a mission-adjacent mortuary-affairs, battlefield-forensics, or coalition-remains-custody suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: protect the site, use a manual grave ledger with dual-witness notes, and defer disturbance until human authority and security conditions improve.

## Domain Packet Defaults

- Default packet ID: `DPL-BATTLEFIELD-GRAVE-REGISTRATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: remains accountability board, site-coordinate ledger, imagery or survey service, and custody or revisit scheduler.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `OGC`, signed custody manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If site security, identification confidence, or interment authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend site disturbance, disinterment, or public release of imagery without proper mortuary, legal, and command authority.
- Flag flood, looting, fire, and indirect-fire exposure risks that can destroy future recovery confidence.
