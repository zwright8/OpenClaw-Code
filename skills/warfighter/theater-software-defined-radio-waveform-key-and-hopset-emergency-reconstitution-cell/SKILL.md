---
name: theater-software-defined-radio-waveform-key-and-hopset-emergency-reconstitution-cell
description: Coordinate emergency reconstitution of tactical radio waveform keys and hopsets. Use when compromised fills, expiring hopsets, or contested spectrum conditions threaten theater communications trust.
---

# Theater Software Defined Radio Waveform Key And Hopset Emergency Reconstitution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter tactical-radio trust and communications reconstitution decisions.
- Confirm compromise indicators, radio fleet status, COMSEC authority, hopset validity windows, and network priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using compromised keys, radio availability, network priority, spectrum threat cues, and time pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in trust restoration, comms continuity, distribution speed, and compromise risk.
3. Identify branch triggers for rekey, hopset refresh, degraded-voice fallback, and segmented-network operation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: waveform rekey plan, hopset restoration ledger, and degraded-network branch package.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-sdr-waveform-key-hopset-emergency-reconstitution-v1` with `protocol_stack_id=ps-theater-sdr-waveform-key-hopset-emergency-reconstitution-stack-v1`.
- Alternate: select a mission-adjacent CEMA, COMSEC, or mission-network suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Preferred `toolchain_id=TC-SDR-117` and `toolchain_profile_id=sdr-waveform-key-hopset-reconstitution-v1`.
- Degraded: narrowband authenticated voice only with manual COMSEC accounting and shortened rekey cycle.

## Domain Packet Defaults

- Default packet ID: `DPL-SDR-WAVEFORM-KEY-HOPSET-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: waveform-key custody board, hopset generation and distribution service, and spectrum trust monitor.
- Preferred protocol profiles for coordination and machine exchange: signed key manifests, `Link 16 J-series`, `VMF`, `STIX/TAXII`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, `../_shared/references/domain-toolchain-profiles.md`, `../_shared/references/joint-operations-external-toolchain-profiles.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If key custody, hopset validity, or COMSEC authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag key-custody breaks, distribution lag, network partition risk, and contested-spectrum ambiguity before recommending action.
- Do not fabricate COMSEC inventories, rekey acknowledgments, or authority releases.
