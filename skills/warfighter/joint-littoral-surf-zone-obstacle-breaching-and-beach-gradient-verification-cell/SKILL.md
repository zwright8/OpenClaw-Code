---
name: joint-littoral-surf-zone-obstacle-breaching-and-beach-gradient-verification-cell
description: Verify surf-zone breach lanes, underwater obstacles, and beach gradients before amphibious or logistics shore entry. Use when littoral access depends on fast but trustworthy lane-release decisions.
---

# Joint Littoral Surf Zone Obstacle Breaching And Beach Gradient Verification Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm landing-craft mix, breach authorities, hydrographic conditions, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the shoreline geometry, obstacle fields, breach assets, and surf or tide conditions.
2. Build one recommended lane-release branch plus alternatives to breach, bypass, delay, or re-survey.
3. Bind each recommendation to hydrographic survey, obstacle-recognition, and lane-release tools with explicit protocolized outputs.
4. Publish degraded-mode branches when gradient confidence, mine or obstacle classification, or sea-state stability falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended breach and release branch with rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Surf-zone breach packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: surf-lane release matrix, beach-gradient confidence board, obstacle reduction task ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-littoral-surf-zone-breach-gradient-verification-v1` with `protocol_stack_id=ps-joint-littoral-surf-zone-breach-gradient-verification-stack-v1`.
- Alternate: amphibious engineer lane board plus manual hydrographic survey worksheet.
- Degraded: daylight or limited-craft lane release only with commander-approved conservative beach gradients.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-SURF-ZONE-BREACH-GRADIENT-001` for critical recommendations.
- Prioritize these protocol families for this domain: `OGC`, `VMF`, `USMTF`, `API/JSON`, and `CoT`.
- Include source system, refresh UTC, confidence, tide assumptions, and unresolved obstacle-classification gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If breach authority, hydrographic confidence, or obstacle discrimination is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate beach gradients, surf conditions, or mine-clearance status.
- Separate confirmed obstacle reduction from modeled landing-craft tolerance.
- Flag civilian vessel, protected-site, and no-strike shoreline constraints early.
