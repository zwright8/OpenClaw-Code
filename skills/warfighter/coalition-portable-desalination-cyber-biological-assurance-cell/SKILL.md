---
name: coalition-portable-desalination-cyber-biological-assurance-cell
description: Support U.S. warfighter and coalition planning for portable desalination system cyber-biological assurance, contamination response, and distributed water continuity in contested environments.
---

# Coalition Portable Desalination Cyber-Biological Assurance Cell

## Mission Scope

- Treat this skill as planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm coalition caveats, biosecurity authorities, and water quality release thresholds.
- Keep products unclassified by default unless handling guidance is explicitly provided.

## Workflow

1. Frame the mission problem using contamination indicators, cyber threat posture, and coalition sustainment priorities.
2. Define risk thresholds and branch triggers for isolate, continue, and reroute actions.
3. Build one recommended option plus at least two alternatives with explicit tradeoffs in water output, confidence, and force health risk.
4. Integrate dependencies across medical, logistics, cyber, and coalition interoperability domains.
5. Convert recommendations into execution-ready products with owners and deadlines.

## Required Output Format

1. Situation snapshot.
2. Recommended option and rationale.
3. Alternative options and trigger conditions.
4. Decision points now/later/pre-delegated.
5. Staff tasking with owner and deadline.

## Domain Products

Primary products for this skill: portable desalination trust scorecard, contamination isolation branch map, coalition water continuity packet.

## Domain Tool Stack

Use these tool categories as the default stack for this skill: water quality telemetry systems, ICS/SCADA anomaly monitors, bio-surveillance diagnostics, coalition logistics sync boards.

## External Tools and Protocol Integration

- Use ../_shared/references/external-tools-protocols.md and ../_shared/references/tool-protocol-playbooks.md for packetized tool execution.
- Use at least one primary source and one cross-check source before final recommendations.
- Prefer protocol families: HL7/FHIR, NIMS/ICS, NATO APP-11/ADatP-3 aligned, USMTF, API/JSON.
- Include source provenance, refresh time (UTC), assumptions, and confidence.

## Guardrails

- Flag assumptions that exceed available evidence.
- Separate facts, assessments, and unknowns.
- Do not fabricate authorities, sources, or tool outputs.
- Require explicit human command approval for posture-changing recommendations.

## Domain Toolchain Defaults

- Primary: tool_suite_id=ts-coalition-portable-desalination-cyber-biological-assurance-v1 with protocol_stack_id=ps-coalition-portable-desalination-cyber-biological-assurance-stack-v1.
- Alternate: tool_suite_id=ts-water-treatment-cyber-physical-protection-v1 with protocol_stack_id=ps-water-treatment-cyber-physical-protection-stack-v1.
- Degraded: life-support water classes only with strict contamination confidence thresholds.

## Domain Packet Defaults

- Default packet IDs: DPL-PORTABLE-DESAL-CYBER-BIO-001, DPL-PORTABLE-DESAL-CYBER-BIO-002.
