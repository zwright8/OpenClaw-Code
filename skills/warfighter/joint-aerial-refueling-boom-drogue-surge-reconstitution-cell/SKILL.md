---
name: joint-aerial-refueling-boom-drogue-surge-reconstitution-cell
description: Restore boom, drogue, hose-drum, and tanker sortie capacity when aerial refueling hardware or crews become the pacing item. Use when surge operations need refueling continuity under attrition or maintenance stress.
---

# Joint Aerial Refueling Boom Drogue Surge Reconstitution Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm tanker force laydown, receiver demand, maintenance status, and refueling-control authority before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the receiver demand, tanker availability, boom and drogue failures, crew readiness, and commander priorities.
2. Build repair, crossdeck, cannibalize, divert, and sortie-constrain branches with explicit fuel-delivery and risk tradeoffs.
3. Bind each recommendation to tanker health, maintenance, and ATO tools plus protocolized outputs.
4. Publish degraded-mode branches when boom, drogue, or crew recovery cannot keep pace with demand.

## Required Output Format

1. Situation snapshot.
2. Recommended refueling-restoration branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Aerial-refueling restoration packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: tanker restoration matrix, boom-drogue bottleneck board, and receiver-fuel-risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-aerial-refueling-boom-drogue-reconstitution-v1` with `protocol_stack_id=ps-joint-aerial-refueling-boom-drogue-reconstitution-stack-v1`.
- Alternate: tanker maintenance board plus receiver-priority adjudication cell.
- Degraded: manual tanker-availability board with commander-approved receiver rationing.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-AERIAL-REFUELING-BOOM-DROGUE-001` for critical recommendations.
- Prioritize these protocol families for this domain: `USMTF`, `Link 16 J-series`, `AIXM/FIXM`, signed maintenance manifests, and `API/JSON`.
- Include source system, refresh UTC, confidence, receiver backlog, and unresolved airworthiness gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run protocol-conformance and readiness checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/readiness-certification-evidence-pack.md`.
- If airworthiness release, boom or drogue status, or tanker-tasking authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate tanker availability, repair completion, or receiver priority approval.
- Separate confirmed hardware failures from inferred causal chains.
- Flag combat search and rescue, nuclear support, and personnel-recovery dependencies early.
