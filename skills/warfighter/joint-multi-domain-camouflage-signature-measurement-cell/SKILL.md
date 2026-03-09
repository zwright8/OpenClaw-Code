---
name: joint-multi-domain-camouflage-signature-measurement-cell
description: Measure and improve visual, thermal, radar, and electromagnetic signature management across joint forces. Use when survivability depends on quantifying detectability across multiple sensor regimes.
---

# Joint Multi Domain Camouflage Signature Measurement Cell

## Mission Scope

- Support signature management planning across land, air, maritime, and expeditionary nodes.
- Confirm mission phase, adversary sensor threat model, and acceptable signature risk.
- Keep recommendations tied to practical controls.

## Workflow

1. Build baseline detectability by platform, environment, and sensor type.
2. Model signature-reduction interventions and tradeoffs.
3. Recommend one prioritized mitigation package with alternates.
4. Define test/validation loops and trigger thresholds.
5. Publish implementation tasking and remeasurement cadence.

## Required Output Format

1. Signature baseline snapshot.
2. Recommended mitigation package.
3. Alternative packages.
4. Decision thresholds.
5. Staff tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: hyperspectral imagery, thermal sensors, RCS measurement data, EW emission logs, meteorological models.
- Protocol/message bindings: STANAG 4609 metadata, MISB tags, EW event schemas, CoT/JSON mission updates.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not produce autonomous deception or attack execution orders.
- Require human commander approval before recommending force-posture changes.
- If measurement quality is weak, publish advisory-only confidence-banded options.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-multi-spectrum-signature-management-v1` with `protocol_stack_id=ps-imagery-ew-fusion-stack-v1`.
- Alternate: `tool_suite_id=ts-survivability-signature-assessment-v1` with `protocol_stack_id=ps-stanag4609-cot-stack-v1`.
- Degraded: manual detectability scorecard and field validation drills.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Bind IDs using `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Run authority checks with `../_shared/references/warfighter-tool-authority-gates.md`.
