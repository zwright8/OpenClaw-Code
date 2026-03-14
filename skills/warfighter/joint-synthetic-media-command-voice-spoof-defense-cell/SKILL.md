---
name: joint-synthetic-media-command-voice-spoof-defense-cell
description: Defend command networks against synthetic voice and media spoofing that could trigger false orders. Use when commanders need rapid trust verification for voice, video, or multimodal command-path communications.
---

# Joint Synthetic Media Command Voice Spoof Defense Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm communication paths in scope, authentication standards, delegated authorities, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the suspect command-path event, affected nodes, authority implications, and mission impact.
2. Build authenticate, contain, countersign, isolate, and reissue branches with explicit tempo and trust tradeoffs.
3. Bind each recommendation to concrete authentication, media-forensics, and acknowledgment tools plus packetized outputs.
4. Publish degraded-mode branches when trusted communication paths or countersign mechanisms are unavailable.

## Required Output Format

1. Situation snapshot.
2. Recommended trust-restoration branch and rationale.
3. Alternative branches with authentication triggers.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Voice-auth packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: command-path trust matrix, spoof-indicator ledger, and countersign release sequence.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-command-voice-spoof-defense-v1` with `protocol_stack_id=ps-joint-command-voice-spoof-defense-stack-v1`.
- Alternate: commander-approved countersign board plus manual identity challenge sequence.
- Degraded: advisory-only order validation with dual-channel human confirmation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-COMMAND-VOICE-SPOOF-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed voice-auth manifests, `USMTF`, `API/JSON`, and `STIX/TAXII`.
- Include source system, refresh UTC, confidence, authentication status, and unresolved trust gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run protocol-conformance and acknowledgment checks from `../_shared/references/us-joint-protocol-assurance-drill.md`.
- If order-path authenticity, countersign authority, or acknowledgment integrity is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate authenticated identities, valid orders, or release authorities.
- Distinguish suspicious media artifacts from confirmed spoof events.
- Treat any branch that could alter force posture or fires release as high-consequence.
