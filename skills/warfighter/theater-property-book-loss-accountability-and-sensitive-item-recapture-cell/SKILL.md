---
name: theater-property-book-loss-accountability-and-sensitive-item-recapture-cell
description: Coordinate theater property-book accountability, serial control, and sensitive-item recapture decisions. Use when losses, battlefield damage, abandonment, or theft put weapons, optics, crypto, or high-risk materiel at risk of compromise.
---

# Theater Property Book Loss Accountability And Sensitive Item Recapture Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter accountable-property, compromise-denial, and recovery decisions.
- Confirm accountable-officer authority, item sensitivity, serial visibility, recovery windows, and compromise indicators before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using missing-item reports, serial data, location confidence, compromise impact, and commander timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in recovery probability, force exposure, accountability integrity, and compromise risk.
3. Identify branch triggers for recapture, destruction, rekeying, replacement, and investigation handoff.
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

Primary products: sensitive-item recovery board, serial-accountability ledger, and compromise-denial action matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-property-book-sensitive-item-recapture-v1` with `protocol_stack_id=ps-theater-property-book-sensitive-item-recapture-stack-v1`.
- Alternate: select a mission-adjacent logistics, MP, or cyber-compromise suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: dual-control manual accountability only with immediate compromise notification and restricted reissue.

## Domain Packet Defaults

- Default packet ID: `DPL-PROPERTY-BOOK-SENSITIVE-ITEM-RECAPTURE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: property-book ledger, serial and custody tracker, and sensitive-item alert board.
- Preferred protocol profiles for coordination and machine exchange: signed serial manifests, `NIEM`, `API/JSON`, `USMTF`, `S/MIME`, and `STIX/TAXII`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If serial confidence, compromise assessment, or destruction authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag crypto-fill exposure, weapon or optic diversion, insider-theft indicators, and accountability breaks before recommending action.
- Do not fabricate serial data, custody records, or approvals.
