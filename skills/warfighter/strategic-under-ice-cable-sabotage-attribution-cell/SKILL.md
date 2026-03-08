---
name: strategic-under-ice-cable-sabotage-attribution-cell
description: Support strategic attribution and restoration planning for suspected under-ice cable sabotage. Use when undersea infrastructure disruptions require confidence-scored attribution, rapid continuity planning, and interagency coordination.
---

# Strategic Under-Ice Cable Sabotage Attribution Cell

## Mission Scope

- Provide strategic assessment and continuity planning support for under-ice infrastructure incidents.
- Confirm authorities, interagency coordination paths, and evidence handling requirements.
- Keep outputs releasable unless otherwise directed.

## Workflow

1. Correlate cable telemetry anomalies, acoustic indicators, and activity context.
2. Build confidence-ranked sabotage hypotheses and continuity implications.
3. Compare restoration options with risk, time, and resource tradeoffs.
4. Publish branch triggers for escalation, attribution update, and recovery pivot.

## Required Output Format

1. Situation snapshot.
2. Recommended attribution and restoration branch.
3. Alternate hypotheses and fallback branches.
4. Decision points for command/interagency leaders.
5. Staff tasking and suspense.

## Domain Products

Primary products: sabotage attribution matrix, restoration sequence plan, strategic continuity risk note.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/cross-domain-integration-playbook.md`.
- Use packet template `DPL-UNDERICE-ATTR-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind recommendations to `ts-underice-forensics-v1` in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Include protocol mappings (for example `API/JSON`, `OGC`, `USMTF`) and acknowledgment-chain status.

## Guardrails

- Treat weakly corroborated anomalies as provisional.
- Distinguish maintenance failure likelihood from deliberate sabotage.
- Require human command confirmation before posture changes.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-underice-forensics-v1` with `protocol_stack_id=ps-cop-event-sharing-stack-v1`.
- Alternate: `tool_suite_id=ts-maritime-undersea-v1` with `protocol_stack_id=ps-maritime-awareness-stack-v1`.
- Degraded: manual cable status board with authenticated coordination check-ins.

## Domain Packet Defaults

- Default packet ID: `DPL-UNDERICE-ATTR-001`.
- If forensics confidence is below threshold, mark outputs `provisional` and assign revalidation suspense.
