---
name: joint-civilian-sensor-report-veracity-and-rumor-control-cell
description: Fuse civilian reports, sensor tips, and rumor indicators to support trustworthy military and civil-protection decisions. Use when commanders need to corroborate crowdsourced reporting, counter harmful rumors, or protect public warning credibility.
---

# Joint Civilian Sensor Report Veracity And Rumor Control Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations that depend on civilian reporting, public trust, or hybrid civil-military warning paths.
- Confirm operating authorities, privacy constraints, protected audiences, and public-affairs or civil-affairs roles before recommending action.
- Keep outputs unclassified by default and avoid collecting unnecessary personal data.

## Workflow

1. Frame the problem with reported incidents, sensor tips, rumor narratives, affected populations, and required decision timelines.
2. Build one recommended COA and at least two alternatives with tradeoffs in speed, credibility, civil trust, and misallocation risk.
3. Identify branch triggers for warning release, rumor rebuttal, collection retask, and manual corroboration.
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

Primary products: rumor risk board, civilian report corroboration ladder, and counter-message task tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-civilian-sensor-report-veracity-rumor-control-v1` with `protocol_stack_id=ps-joint-civilian-sensor-report-veracity-rumor-control-stack-v1`.
- Alternate: select a mission-adjacent civil-support, intelligence, or disinformation suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: human-only corroboration with delayed release, manual rumor log, and command-approved warning language.

## Domain Packet Defaults

- Default packet ID: `DPL-CIVILIAN-SENSOR-RUMOR-CONTROL-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: crowdsourced incident fusion board, media authenticity verifier, and civil warning rumor tracker.
- Preferred protocol profiles for coordination and machine exchange: `CAP`, `NIEM`, `OGC`, `STIX/TAXII`, `API/JSON`, and `S/MIME`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for warning-release or movement-changing actions.
- If corroboration quality, civil-liberties basis, or protected-population implications are uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Distinguish verified reporting, assessed manipulation, assumptions, and unknowns.
- Do not recommend censorship, bulk surveillance, or constitutional overreach without explicit authority and necessity.
- Flag warning-credibility risk, panic amplification risk, and collection bias before recommending action.
- Do not fabricate civil reports, forensic findings, or approvals.
