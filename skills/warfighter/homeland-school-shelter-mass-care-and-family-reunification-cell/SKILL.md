---
name: homeland-school-shelter-mass-care-and-family-reunification-cell
description: Support military assistance to school-based shelters, mass-care operations, and trusted family reunification for U.S. warfighters. Use when DSCA staffs must stabilize displaced families, child accountability, feeding and transport flows, or shelter security around schools used during domestic crises.
---

# Homeland School Shelter Mass Care And Family Reunification Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm shelter load, child-accountability requirements, reunification authorities, feeding and transport constraints, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the shelter problem with occupancy, age mix, special-needs demand, accountability gaps, and security posture.
2. Build one recommended COA and at least two alternatives with tradeoffs in family reunification speed, shelter safety, transport load, and civil-military coordination burden.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for shelter expansion, child release verification, feeding or bus support, and law-enforcement or NG support.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and shelter posture.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: shelter occupancy board, child-accountability ledger, reunification decision matrix, and mass-care support brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-school-shelter-mass-care-family-reunification-v1` with `protocol_stack_id=ps-homeland-school-shelter-mass-care-family-reunification-stack-v1`.
- Alternate: independent emergency-operations-board review with manual child release worksheet and shelter-logistics cross-check.
- Degraded: commander-approved shelter branch using paper accountability rosters, wristband or badge controls, and UTC acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-SCHOOL-SHELTER-FAMILY-REUNIFICATION-001`.
- Preferred `toolchain_id=TC-SHELTER-133` and `toolchain_profile_id=school-shelter-mass-care-family-reunification-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: shelter occupancy board, student and child accountability ledger, reunification verification system, and bus or feeding logistics board.
- Preferred protocol profiles for coordination and machine exchange: `NIMS/ICS`, `EDXL-DE/CAP`, `NIEM`, signed custody manifests, and `API/JSON`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter child release, mass-care posture, or DSCA support allocation.
- If authority, identity verification, or custody-chain evidence is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, child-accountability assumptions, and release-authorization acknowledgment integrity.
- If checks fail, provide a degraded shelter branch with explicit safety and reunification risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unaccompanied minors, identity-fraud indicators, shelter security gaps, and feeding or transport bottlenecks early.
- Protect personally identifiable information and do not imply custody-release authority the operator does not hold.
- Do not fabricate sources, approvals, or accountability evidence.
