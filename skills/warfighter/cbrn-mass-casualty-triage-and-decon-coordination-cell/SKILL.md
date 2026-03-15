---
name: cbrn-mass-casualty-triage-and-decon-coordination-cell
description: Coordinate triage, decontamination throughput, and care routing after chemical, biological, radiological, or nuclear incidents.
---

# CBRN Mass Casualty Triage and Decon Coordination Cell

## Mission Scope

- Treat this skill as planning and decision-support for U.S. and coalition warfighter teams in this domain.
- Confirm echelon, operating environment, legal authorities, releasability constraints, casualty estimates, and decision timeline before generating recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Frame the mission problem with contamination vectors, casualty volumes, medical capacity, and protected-movement constraints.
2. Build a recommended option and at least two alternates with explicit tradeoffs in casualty survival, decon throughput, force protection, and civil impact.
3. Bind each recommendation to a concrete toolchain, packet, protocol path, and degraded-mode fallback.
4. Map every tool output to triage, decon, routing, and command approval decisions with owners and suspense.
5. Publish commander-facing recommendations and a staff execution matrix for treatment and decon sequencing.

## Required Output Format

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and approval gates.
5. Staff tasking with suspense.
6. Tool and protocol execution matrix.

## Domain Products

Primary products for this skill: triage and decon throughput plan, casualty routing board, contamination-control timeline.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-cbrn-urban-plume-evac-v1` with `protocol_stack_id=ps-cbrn-urban-plume-evac-stack-v1`.
- Alternate: `tool_suite_id=ts-joint-c2-fusion-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Degraded: static exclusion zones, manual triage tags, paper casualty cards, and fixed reassessment windows.

## External Tool Stack and Protocols

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and `../_shared/references/joint-operations-external-toolchain-profiles.md`.
- Prefer `toolchain_profile_id=medical-casualty-regulation-v1` when patient routing dominates; elevate `toolchain_profile_id=civil-support-consequence-management-v1` when life-safety restoration and public warning dominate.
- Preferred tools: CBRN sensor fusion boards, plume and hazard modelers, hospital bed or casualty-regulation feeds, EMS or incident dashboards, decon capacity planners.
- Preferred protocol families: `USMTF`, `OGC`, `NIMS/ICS`, `EDXL-DE/CAP`, `HL7/FHIR`, `API/JSON`.
- Include `tool_suite_id`, `protocol_stack_id`, `packet_id`, `refresh_utc`, `confidence`, `authority_tier`, and `fallback_path` for every critical recommendation.

## Domain Packet Defaults

- Default packet ID: `DPL-CBRN-URBAN-001`.
- If casualty-routing synchronization requires a distinct collection or movement packet, define a provisional packet using the shared schema and assign a validation owner.

## Tool Invocation Contract

- For each critical dependency include: objective, required inputs, query or action template, expected output schema, transport protocol, timeout, retry, and fallback path.
- Map every tool output to triage category changes, corridor openings or closures, and patient movement decisions with explicit medical and command owners.
- If contamination confidence, bed-state trust, or legal authority is incomplete, mark the recommendation `provisional` and shift to a constrained branch.

## Authority and Assurance Gates

- Apply approval and escalation requirements from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before publishing high-consequence recommendations.
- Separate facts, assessed judgments, assumptions, and unknowns.
- Require human command and medical review before recommending branches that materially alter protected movement, medical prioritization, or force posture.
