---
name: theater-spectrum-dependent-autonomy-convoy-integrity-cell
description: Protect convoy autonomy when jamming, spoofing, or degraded control links threaten navigation and human override. Use when spectrum trust directly affects convoy safety, throughput, and release decisions.
---

# Theater Spectrum Dependent Autonomy Convoy Integrity Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm convoy routes, autonomy modes, control-link dependencies, EW threat posture, and release authorities before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame convoy autonomy dependencies, route risk, spectrum threats, and human-override requirements.
2. Build continue, degrade, reroute, re-man, and hold branches with explicit safety, tempo, and exposure tradeoffs.
3. Bind each recommendation to concrete telemetry, spectrum-monitoring, and fallback-control tools plus packetized outputs.
4. Publish degraded-mode branches when navigation confidence, control-link integrity, or human-override readiness falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended convoy-integrity branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Convoy-autonomy packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: autonomy integrity board, fallback-control ladder, and convoy risk-control matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-spectrum-autonomy-convoy-integrity-v1` with `protocol_stack_id=ps-theater-spectrum-autonomy-convoy-integrity-stack-v1`.
- Alternate: manual convoy control board plus route-integrity worksheet.
- Degraded: human-led convoy operations with restricted autonomy assist functions only.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-SPECTRUM-AUTONOMY-CONVOY-INTEGRITY-001` for critical recommendations.
- Prioritize these protocol families for this domain: `CoT`, `VMF`, signed autonomy attestations, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, spectrum constraints, and unresolved autonomy gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run mission-assurance and autonomy-safety checks from `../_shared/references/mission-assurance-checklist.md`.
- If navigation confidence, override authority, or telemetry integrity is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not provide tactics for degrading friendly autonomy controls or bypassing human overrides.
- Separate observed control-link degradation from inferred adversary intent.
- Surface force-protection, convoy safety, and civilian-risk constraints early.
