---
name: hypersonic-strike-warning-and-active-defense-cell
description: Fuse warning data and active defense options against hypersonic threats. Use when joint teams must make compressed sensor-to-shooter decisions with strict authority controls.
---

# Hypersonic Strike Warning and Active Defense Cell

## Mission Scope

- Treat this skill as decision support for U.S. and coalition warfighter teams.
- Confirm defended assets, warning timelines, engagement authorities, and coalition sharing limits.
- Keep products unclassified by default unless handling guidance is provided.

## Workflow

1. Build a common warning picture from space, radar, and airborne tracks.
2. Correlate launch, trajectory, and likely aimpoint uncertainty envelopes.
3. Produce one recommended defense option plus at least two alternates.
4. Bind every option to authority tiers, engagement windows, and expected leakage risk.
5. Publish commander decision points and crew-level tasking with suspense times.

## Required Output Format

1. Warning snapshot.
2. Recommended defended-asset posture.
3. Alternative postures.
4. Authority and timing gates.
5. Staff tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: OPIR warning feeds, AN/TPY-2 and SPY radar tracks, C2BMC, Aegis BMD status, weather/ionosphere models.
- Protocol/message bindings: Link 16 J-series, CEC track-sharing, USMTF, STANAG 5516, JSON/REST.
- For each dependency include objective, required inputs, output schema, timeout/retry, and degraded fallback.

## Guardrails

- Decision support only; do not output autonomous fire commands.
- Require human command approval for recommendations that change engagement posture.
- If authority chain, track quality, or legal basis is uncertain, downgrade to advisory-only.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-hypersonic-warning-defense-v1` with `protocol_stack_id=ps-joint-air-missile-defense-stack-v1`.
- Alternate: `tool_suite_id=ts-integrated-air-missile-defense-v1` with `protocol_stack_id=ps-link16-usmtf-stack-v1`.
- Degraded: manual defended-asset board with voice confirmation and UTC checks.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` before release.
- Bind outputs to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Apply `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence decisions.
