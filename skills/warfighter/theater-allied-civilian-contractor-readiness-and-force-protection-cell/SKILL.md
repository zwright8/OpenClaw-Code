---
name: theater-allied-civilian-contractor-readiness-and-force-protection-cell
description: Coordinate readiness, vetting, protection, and continuity for allied or civilian contractors performing mission-essential services in contested theaters. Use when commanders need auditable contractor risk decisions with explicit tool and protocol bindings.
---

# Theater Allied Civilian Contractor Readiness And Force Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter contractor-continuity, access-control, and force-protection decisions.
- Confirm contractor roles, nationality mix, force-protection posture, badging or vetting status, and mission-essential service dependencies before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using contractor rosters, mission dependencies, threat posture, access constraints, and protection gaps.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in throughput, security, legitimacy, and workforce retention.
3. Identify branch triggers for convoy escort, shelter-in-place, badge suspension, replacement sourcing, and service degradation.
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

Primary products: contractor readiness matrix, protected-movement ladder, and service-continuity risk board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-allied-civilian-contractor-readiness-force-protection-v1` with `protocol_stack_id=ps-theater-allied-civilian-contractor-readiness-force-protection-stack-v1`.
- Alternate: select a mission-adjacent contractor, base-defense, or coalition-access suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential contractor roster with manual check-in, dual-review access control, and command-approved movement windows only.

## Domain Packet Defaults

- Default packet ID: `DPL-CONTRACTOR-READINESS-FP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: contractor roster ledger, badging and vetting tracker, protected-route scheduler, and service-dependency board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed workforce manifests, `API/JSON`, `S/MIME`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If vetting validity, route protection, or contractor-employment authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag insider-risk exposure, nationality-based caveats, insurance gaps, and mission-service single points of failure before recommending action.
- Do not fabricate vetting status, force-protection guarantees, or contractor consent.
