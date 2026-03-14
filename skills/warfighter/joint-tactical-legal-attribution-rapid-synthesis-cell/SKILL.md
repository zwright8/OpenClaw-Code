---
name: joint-tactical-legal-attribution-rapid-synthesis-cell
description: Fuse tactical evidence into legally usable attribution assessments for U.S. and coalition commanders. Use when cyber, electromagnetic, information, or kinetic incidents require fast evidentiary synthesis before action.
---

# Joint Tactical Legal Attribution Rapid Synthesis Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm incident scope, authorities, releasability, evidentiary standard, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the incident with timeline, suspected actor set, legal questions, commander intent, and branch triggers.
2. Separate observed facts, forensic indicators, assessed judgments, and unknowns across cyber, EW, OSINT, HUMINT, and physical evidence.
3. Build a recommended attribution posture plus alternates with explicit tradeoffs in confidence, response latitude, escalation risk, and coalition releasability.
4. Bind each recommendation to concrete tool invocations, message formats, packet outputs, and human approval gates.

## Required Output Format

1. Situation snapshot.
2. Recommended attribution posture and rationale.
3. Alternative hypotheses and invalidation triggers.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Evidence packet summary, protocol bindings, and confidence annotations.

## Domain Products

Primary products for this skill: attribution confidence ledger, evidentiary sufficiency matrix, and commander release-authority prompt.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-tactical-legal-attribution-synthesis-v1` with `protocol_stack_id=ps-joint-tactical-legal-attribution-synthesis-stack-v1`.
- Alternate: independent legal review cell plus signed evidence-custody export bundle.
- Degraded: advisory-only attribution note with UTC witness ledger and manual acknowledgment chain.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-TACTICAL-LEGAL-ATTRIB-001` for critical recommendations.
- Prioritize these protocol families for this domain: `STIX/TAXII`, `USMTF`, `API/JSON`, and `NIEM`.
- Include source system, refresh UTC, confidence, evidentiary gaps, and releasability caveats in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run interoperability and provenance checks from `../_shared/references/mission-assurance-checklist.md`.
- If legal basis, source provenance, or acknowledgment integrity is uncertain, downgrade to advisory-only and assign remediation owners with suspense.

## Guardrails

- Do not fabricate authorities, evidence chains, classified accesses, or certainty levels.
- Surface legal, policy, ROE, and coalition sharing constraints early.
- Distinguish attribution confidence from recommended response authority at all times.
