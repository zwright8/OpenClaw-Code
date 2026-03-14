---
name: strategic-composite-prepreg-resin-defense-allocation-cell
description: Govern allocation of carbon fiber, prepreg, resin, and cure capacity across defense production and repair. Use when aircraft, missiles, radomes, or uncrewed systems depend on scarce composite materials and autoclave throughput.
---

# Strategic Composite Prepreg Resin Defense Allocation Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm production lines, material shelf-life, cure capacity, substitution rules, and decision timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the composite supply chain, freezer inventory, autoclave capacity, and defense-priority demand.
2. Detect shelf-life, contamination, resin shortage, or cure-capacity constraints that can degrade production or repair readiness.
3. Build allocate, substitute, defer, redistribute, and surge-cure branches with explicit readiness and certification tradeoffs.
4. Bind each recommendation to concrete material-control tools, production telemetry, and packetized outputs.

## Required Output Format

1. Situation snapshot.
2. Recommended allocation branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Composite-material packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: composite allocation board, shelf-life and cure-capacity ledger, and substitution risk ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-composite-prepreg-resin-defense-allocation-v1` with `protocol_stack_id=ps-strategic-composite-prepreg-resin-defense-allocation-stack-v1`.
- Alternate: manual freezer-inventory board plus autoclave-slot worksheet.
- Degraded: mission-essential composite lots only with conservative release thresholds.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-COMPOSITE-PREPREG-RESIN-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed material-cert manifests, `API/JSON`, `USMTF`, and `OPC UA`.
- Include source system, refresh UTC, confidence, shelf-life exposure, and unresolved certification gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run quality and release checks from `../_shared/references/mission-assurance-checklist.md`.
- If pedigree, cure validation, or substitution authority is uncertain, downgrade to advisory-only and assign remediation owners.

## Guardrails

- Do not fabricate freezer stock, material pedigree, cure readiness, or substitution approval.
- Separate measured shelf-life facts from inferred downstream readiness impact.
- Surface certification, transport-temperature, and safety implications early.
