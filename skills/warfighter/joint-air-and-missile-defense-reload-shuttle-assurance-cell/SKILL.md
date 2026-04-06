---
name: joint-air-and-missile-defense-reload-shuttle-assurance-cell
description: Protect and time launcher reload shuttles, magazine transfers, and reload-site release decisions under missile and drone threat. Use when integrated air and missile defense capacity depends on contested rearm speed.
---

# Joint Air And Missile Defense Reload Shuttle Assurance Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm defended asset priorities, launcher status, reload-site authorities, explosive-safety constraints, and expected threat windows.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame current launcher depletion, reload inventory posture, route threats, and timing constraints.
2. Separate verified magazine availability, transportation assumptions, enemy ISR pressure, and explosive-safety limits.
3. Build reload, disperse, cross-level, decoy, and hold-fire branches with explicit tradeoffs in engagement depth and survivability.
4. Bind each branch to IAMD battle-management, missile inventory, convoy-risk, and explosive-safety tools.
5. Publish commander decision points, release authorities, and reload-failure branch triggers.

## Required Output Format

1. Situation snapshot.
2. Recommended reload branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Reload shuttle packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: launcher reload ladder, shuttle survivability matrix, missile-depth recovery timeline.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-iamd-reload-shuttle-assurance-v1` with `protocol_stack_id=ps-joint-iamd-reload-shuttle-assurance-stack-v1`.
- Alternate: `tool_suite_id=ts-fires-airspace-v1` with `protocol_stack_id=ps-air-defense-ammo-economy-stack-v1`.
- Packet default: `packet_id=DPL-IAMD-RELOAD-SHUTTLE-001`.
- Degraded: command-approved reload strip map and voice-acknowledged launcher sequence.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `Link 16 J-series`, `VMF`, signed explosive manifests, `API/JSON`, and `USMTF`.
- Include launcher state freshness, reload-site status, explosive-weight assumptions, and route-threat confidence in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- If launcher location confidence, explosive-safety status, or release authority is uncertain, downgrade to advisory-only.

## Guardrails

- Do not fabricate missile inventory, launcher health, or explosive-safety approval.
- Distinguish engagement urgency from reload urgency when capacity and survivability goals conflict.
- Surface fratricide, backblast, and convoy-signature risks before recommending rapid reload.
