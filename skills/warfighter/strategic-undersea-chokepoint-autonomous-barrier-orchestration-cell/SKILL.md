---
name: strategic-undersea-chokepoint-autonomous-barrier-orchestration-cell
description: Support strategic planning for autonomous undersea barrier posture at chokepoints with legal and safety controls. Use when commanders must synchronize detection, deterrence, and recovery branches.
---

# Strategic Undersea Chokepoint Autonomous Barrier Orchestration Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm echelon, authorities, coalition constraints, and decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval for high-consequence branches.

## Workflow

1. Frame the mission problem, dependencies, and failure modes.
2. Build primary and alternate branches with explicit tradeoffs in survivability, tempo, sustainment burden, and escalation risk.
3. Bind each recommendation to concrete external tools, protocol transports, and packetized outputs.
4. Run authority/assurance checks and publish degraded-mode branches when trust, timeliness, or releasability thresholds are missed.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternate branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Tool invocation packets, protocol bindings, and confidence annotations.

## Domain Products

Primary products for this skill: undersea barrier posture matrix, chokepoint denial options board, and recovery trigger ladder.

## External Tools and Protocol Integration

- Use integration and adapter guidance in ../_shared/references/external-tools-protocols.md and ../_shared/references/external-tool-endpoints-and-adapters.md.
- Bind recommendations to tool_suite_id=ts-strategic-undersea-chokepoint-autonomous-barrier-orchestration-cell-v1 and protocol_stack_id=ps-strategic-undersea-chokepoint-autonomous-barrier-orchestration-cell-stack-v1.
- Use packet templates in ../_shared/references/domain-tool-packet-library.md and include packet_id=DPL-UNDERSEA-BARRIER-AUTO-001 for critical recommendations.
- Prioritize these protocol families for this domain: USMTF, OGC, STIX/TAXII, API/JSON.
- Include source system, UTC refresh time, confidence, and known gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from ../_shared/references/human-agent-command-escalation-matrix.md and ../_shared/references/warfighter-tool-authority-gates.md.
- Run interoperability checks from ../_shared/references/mission-assurance-checklist.md.
- If authority, legal basis, acknowledgment integrity, or data provenance is uncertain, downgrade to advisory-only and assign remediation owners/suspense.

## Guardrails

- Separate facts, assessed judgments, assumptions, and unknowns.
- Flag legal, policy, ROE, coalition, and safety constraints early.
- Do not fabricate approvals, classified data access, or source provenance.
