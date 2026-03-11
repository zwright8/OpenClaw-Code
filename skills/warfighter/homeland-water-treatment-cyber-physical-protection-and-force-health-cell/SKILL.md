---
name: homeland-water-treatment-cyber-physical-protection-and-force-health-cell
description: Protect homeland water-treatment continuity against cyber-physical disruption while preserving force-health safety. Use when contamination risk, infrastructure attacks, or outage cascades threaten military readiness and civil stability.
---

# Homeland Water Treatment Cyber-Physical Protection and Force Health Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter and civil-support missions.
- Confirm authorities for DSCA, public-health coordination, and utility incident response.
- Keep outputs unclassified by default unless handling guidance is provided.

## Workflow

1. Build a contamination and infrastructure risk picture across treatment, distribution, and dependent missions.
2. Prioritize protective actions by life safety, force readiness impact, and restoration speed.
3. Coordinate cyber containment, physical isolation, and public-health advisory sequencing.
4. Publish restoration branches with monitoring triggers and escalation thresholds.

## Required Output Format

1. Situation snapshot.
2. Recommended protection/restoration branch.
3. Alternate/degraded branches.
4. Decision points with authority tier.
5. Staff tasking and suspense.

## Domain Products

Primary products: contamination risk map, protection priority matrix, restoration branch timeline.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/mission-assurance-checklist.md`.
- Bind dependencies to packet mappings in `../_shared/references/domain-tool-packet-library.md`.
- Use concrete tool/protocol IDs from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-civil-support-v1` with `protocol_stack_id=ps-civil-emergency-stack-v1`.
- Alternate: `tool_suite_id=ts-cyber-defense-v1` with `protocol_stack_id=ps-cyber-threat-stack-v1`.
- Degraded: manual utility status board + authenticated health advisory workflow.

## Guardrails

- Separate confirmed contamination, suspected indicators, and unknowns.
- Require human approval for decisions that alter civil warning posture.
- If provenance or legality is uncertain, publish `NO-GO` with escalation path.
