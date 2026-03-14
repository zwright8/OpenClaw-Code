---
name: strategic-photonics-laser-optics-defense-allocation-cell
description: Prioritize scarce photonics, laser optics, and specialty electro-optical materials across defense demand. Use when sensors, seekers, directed-energy systems, and EO repair lines compete for limited trusted material flow.
---

# Strategic Photonics Laser Optics Defense Allocation Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm supported programs, material pedigree requirements, coating capacity, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the specialty-material network with optical lots, coating lines, EO demand, and critical mission dependencies.
2. Build allocate, defer, substitute, surge, and quarantine branches with explicit readiness and quality tradeoffs.
3. Bind each recommendation to concrete material-control, production, and quality-release tools plus packetized outputs.
4. Publish degraded-mode branches when pedigree evidence, quality release, or capacity confidence falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended allocation branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Photonics-allocation packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: photonics allocation board, specialty-material risk ledger, and release-priority ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-photonics-laser-optics-allocation-v1` with `protocol_stack_id=ps-strategic-photonics-laser-optics-allocation-stack-v1`.
- Alternate: manual optics allocation board plus specialty-material worksheet.
- Degraded: mission-essential sensor and laser lots only with conservative release thresholds.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-PHOTONICS-LASER-OPTICS-ALLOCATION-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed material-cert manifests, `API/JSON`, `USMTF`, and `OPC UA`.
- Include source system, refresh UTC, confidence, pedigree limits, and unresolved quality gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run quality-release and provenance checks from `../_shared/references/mission-assurance-checklist.md`.
- If pedigree, quality evidence, or substitution authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate material pedigree, quality-release evidence, or allocation authority.
- Separate observed shortages or defects from inferred sabotage.
- Surface export-control, safety, and certification consequences early.
