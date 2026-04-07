---
name: expeditionary-seabed-landing-zone-survey-and-causeway-placement-cell
description: Survey littoral seabed load class, surf hazards, and landing approaches for expeditionary landing zones and causeway placement. Use when joint or coalition shore-entry depends on fast, trusted hydrographic and engineer decisions.
---

# Expeditionary Seabed Landing Zone Survey And Causeway Placement Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm landing force requirements, causeway inventory, hydrographic authorities, surf conditions, and civil-military shoreline constraints.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the shore-entry requirement, seabed uncertainty, approach lanes, and offload demand.
2. Separate verified survey data, load-class assumptions, mine or obstacle concerns, and unknowns.
3. Build survey, clear, emplace, shift, and abort branches with explicit tradeoffs in throughput, exposure, and engineer effort.
4. Bind each branch to hydrographic survey, load-class modeling, causeway inventory, and surf-zone hazard tools.
5. Publish decision points, emplacement triggers, and route recertification conditions.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Causeway placement packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: littoral load-class board, landing lane viability matrix, causeway emplacement sequence.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-seabed-landing-zone-causeway-placement-v1` with `protocol_stack_id=ps-expeditionary-seabed-landing-zone-causeway-placement-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-amphibious-shore-entry-control-stack-v1`.
- Packet default: `packet_id=DPL-CAUSEWAY-LANDING-ZONE-001`.
- Degraded: manual beach sketch, sounding log, and conservative causeway-release card.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `OGC`, `AIS/NMEA`, signed engineer manifests, `API/JSON`, and `USMTF`.
- Include survey freshness, load-class confidence, hazard assumptions, and throughput targets in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If survey pedigree, obstacle status, or emplacement authority is uncertain, downgrade to advisory-only.

## Guardrails

- Do not fabricate seabed load class, surf risk, or mine-clearance confidence.
- Distinguish hydrographic uncertainty from deliberate denial or obstacle action.
- Surface civil-shipping, environmental, and engineer-safety consequences before recommending rapid emplacement.
