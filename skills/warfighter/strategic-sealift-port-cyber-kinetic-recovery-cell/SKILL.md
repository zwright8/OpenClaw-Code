---
name: strategic-sealift-port-cyber-kinetic-recovery-cell
description: Coordinate strategic sealift and port recovery when cyber and kinetic disruptions combine. Use when theater opening depends on restoring throughput under active sabotage or attack pressure.
---

# Strategic Sealift Port Cyber Kinetic Recovery Cell

## Mission Scope

- Provide planning support for contested port and sealift recovery operations.
- Confirm force-flow priorities, berth/crane constraints, cyber authority, and host-nation governance.
- Tie recommendations to measurable throughput and security effects.

## Workflow

1. Build a port-system dependency map (OT, IT, physical nodes, labor, movement lanes).
2. Quantify throughput loss and backlog risk.
3. Recommend one recovery sequence with two alternates.
4. Map cyber containment, physical security, and repair dependencies.
5. Publish commander decisions and port action tasking.

## Required Output Format

1. Throughput disruption snapshot.
2. Recommended recovery sequence.
3. Alternative sequences.
4. Decision points and authority gates.
5. Joint port tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: terminal operating systems, crane/SCADA telemetry, vessel schedules, cyber incident dashboards, convoy routing systems.
- Protocol/message bindings: EDI shipment messages, AIS/NMEA, IEC 62443 artifacts, USMTF movement updates, JSON/REST APIs.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Decision support only; do not execute cyber containment or movement commands autonomously.
- Require human command and port authority approval for major reprioritization.
- If cyber attribution or safety status is uncertain, downgrade to advisory-only.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-port-recovery-v1` with `protocol_stack_id=ps-port-cyber-kinetic-response-stack-v1`.
- Alternate: `tool_suite_id=ts-theater-opening-port-restoration-v1` with `protocol_stack_id=ps-edi-ais-usmtf-stack-v1`.
- Degraded: manual berth/crane board with controlled voice reports.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Select tool/protocol IDs from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Apply release gates in `../_shared/references/warfighter-tool-authority-gates.md`.
