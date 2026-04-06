---
name: expeditionary-snow-ice-water-harvest-and-contaminant-mitigation-cell
description: Produce safe water from snow and ice sources in cold regions while mitigating fuel, metal, and biological contamination. Use when expeditionary units must convert frozen sources into reliable water under austere conditions.
---

# Expeditionary Snow Ice Water Harvest And Contaminant Mitigation Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm source locations, contamination hazards, purification capacity, force-health thresholds, and resupply timelines.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the water shortfall, source quality, ambient conditions, and unit demand profile.
2. Separate sampled contaminants, suspected contamination pathways, equipment constraints, and unknowns.
3. Build harvest, melt, purify, ration, relocate, and resupply branches with explicit tradeoffs in labor, fuel, and medical risk.
4. Bind each branch to environmental sensing, assay, purification, and force-health tools.
5. Publish staff actions, testing cadence, and no-go thresholds for unsafe water release.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Frozen-water harvest packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: frozen-source viability board, contaminant mitigation matrix, daily safe-water production plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-expeditionary-snow-ice-water-harvest-mitigation-v1` with `protocol_stack_id=ps-expeditionary-snow-ice-water-harvest-mitigation-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-waterborne-outbreak-response-stack-v1`.
- Packet default: `packet_id=DPL-SNOW-ICE-WATER-HARVEST-001`.
- Degraded: manual melt and chlorination worksheet with command-rationing controls.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `HL7/FHIR`, `OGC`, `API/JSON`, water-lab result exchange, and `USMTF`.
- Include sample-source chain, refresh UTC, contaminant confidence, and purification throughput assumptions in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If contamination evidence, purification effectiveness, or medical release authority is uncertain, downgrade to advisory-only.

## Guardrails

- Do not fabricate potability, assay results, or purification capacity.
- Distinguish chemical, fuel, particulate, and biological contamination pathways.
- Surface force-health consequences before recommending extended rationing or untreated-source use.
