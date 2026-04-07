---
name: joint-emissions-window-and-decoy-synchronization-cell
description: Synchronize emissions windows, decoy activations, and signature discipline across joint forces. Use when brief electromagnetic exposure must be timed precisely to preserve survivability, fires timing, or deception effectiveness.
---

# Joint Emissions Window And Decoy Synchronization Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm emissions authorities, decoy inventory, target effects, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the emissions-control plan, decoy assets, adversary collection risk, and mission timing windows.
2. Build one recommended synchronization branch plus alternatives to compress, offset, mask, or abort emission events.
3. Bind each recommendation to spectrum-management, decoy-control, and fires-timing tools with explicit protocolized outputs.
4. Publish degraded-mode branches when acknowledgment integrity, spectrum clearance, or decoy health falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended synchronization branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Emissions-window packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: emissions timing ladder, decoy release matrix, adversary collection-risk board.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-emissions-window-decoy-synchronization-v1` with `protocol_stack_id=ps-joint-emissions-window-decoy-synchronization-stack-v1`.
- Alternate: spectrum governance board plus manual decoy release worksheet.
- Degraded: brief, commander-approved emissions bursts only with manual decoy confirmation and UTC readback logging.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-EMISSIONS-DECOY-WINDOW-001` for critical recommendations.
- Prioritize these protocol families for this domain: `Link 16 J-series`, `VMF`, `CoT`, `USMTF`, and `API/JSON`.
- Include source system, refresh UTC, confidence, decoy inventory, and unresolved collection-risk gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If emissions authority, deconfliction status, or decoy-control acknowledgment is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate EMCON authority, decoy availability, or timing precision.
- Separate confirmed collection threats from modeled adversary reaction windows.
- Flag civilian spectrum, coalition fratricide, and protected infrastructure constraints early.
