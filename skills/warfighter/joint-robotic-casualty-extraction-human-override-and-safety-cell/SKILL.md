---
name: joint-robotic-casualty-extraction-human-override-and-safety-cell
description: Govern robotic casualty extraction, human override, and medic handoff safety when terrain, fire, or contamination blocks conventional recovery. Use when commanders need autonomous extraction options without losing human judgment or patient safety.
---

# Joint Robotic Casualty Extraction Human Override And Safety Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm casualty conditions, autonomy limits, override authorities, contamination or fires risk, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval before recommending branches that materially change casualty-movement posture.

## Workflow

1. Frame the extraction geometry, autonomy constraints, casualty acuity, and failure modes most exposed to override delay or unsafe movement.
2. Build primary and alternate robotic, mixed, and manual extraction branches with explicit tradeoffs in speed, survivability, patient safety, and control.
3. Bind each recommendation to concrete robotics, casualty-regulation, and override-assurance tools plus packetized outputs.
4. Run authority, override-timing, and handoff-integrity checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended extraction branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Extraction packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: robotic extraction safety matrix, override and medic handoff ledger, and casualty extraction route board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-robotic-casualty-extraction-human-override-safety-v1` with `protocol_stack_id=ps-joint-robotic-casualty-extraction-human-override-safety-stack-v1`.
- Alternate: manual casualty drag or litter board plus robotics observer worksheet.
- Degraded: human-only extraction or hold-in-place stabilization until override and route risks are cleared.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-ROBOTIC-CASUALTY-EXTRACTION-001` for critical recommendations.
- Prioritize these protocol families for this domain: `CoT`, `VMF`, `HL7/FHIR`, signed autonomy manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, override status, and unresolved handoff or autonomy gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If override timing, casualty stability, or control authority is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate autonomy confidence, casualty status, or human override acknowledgment.
- Separate observed sensor or route facts from inferred survivability outcomes.
- Surface medical, legal, and blue-force fratricide consequences of autonomous casualty movement early.
