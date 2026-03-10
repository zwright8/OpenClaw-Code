---
name: coalition-deepfake-voice-command-spoofing-detection-cell
description: Support coalition planning for detection and containment of deepfake voice command spoofing targeting military command channels. Use when voice-authenticated workflows face synthetic media manipulation risk.
---

# Coalition Deepfake Voice Command Spoofing Detection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter missions.
- Confirm echelon, authorities, timeline, and decision owner before recommending options.
- Keep outputs unclassified by default unless user-provided handling guidance changes that.

## Workflow

1. Frame the mission problem with domain constraints, available resources, and threat indicators.
2. Identify assumptions, risk thresholds, and invalidation triggers.
3. Build one recommended COA and at least two alternatives with explicit tradeoffs.
4. Bind each recommendation to concrete tools, protocols, data freshness, and authority gates.
5. Produce commander summary plus staff action tracker with owners and suspense.

## Required Output Format

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points and branch triggers.
5. Staff tasking and suspense dates.

## Domain Products

Primary products for this skill: voice spoofing threat board, command-channel trust posture card, containment and re-authentication plan.

## U.S. Warfighter Employment Notes

- Prioritize command-channel trust restoration when synthetic voice attacks target coalition voice procedures and decision loops.

## External Tools and Protocol Integration

- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` to select a concrete `tool_suite_id` and `protocol_stack_id`.
- Include `interop_standard_set`, `endpoint_security_profile`, `primary_exchange_path`, and `degraded_exchange_method` for each critical recommendation.
- Include one `packet_id` from `../_shared/references/domain-tool-packet-library.md` for each critical recommendation.
- For this domain, prioritize `ts-deepfake-voice-command-detection-v1` with `ps-deepfake-voice-command-detection-stack-v1` and `DPL-DEEPFAKE-VOICE-COMMAND-DETECTION-001`.

## Deepfake Command-Trust Hardening Overrides (2026-03-10)

- Add cross-check packet references `DPL-DISINFORMATION-BANK-RUN-STABILITY-001` and `DPL-COALITION-LIQUIDITY-CONTINUITY-001` when synthetic-voice attacks coincide with financial panic or coercive messaging campaigns.
- Require explicit `voice_chain_integrity_state`, `authentication_fallback_method`, and `commander_reauth_decision_point` fields for each high-impact recommendation.
- If identity trust confidence is below threshold, publish advisory-only recommendations and route to immediate human command re-authentication.

## Guardrails

- Separate facts, assessments, and unknowns.
- Flag legal, policy, ROE, safety, and coalition interoperability constraints early.
- If authority or data provenance is uncertain, downgrade to advisory-only and require human command approval.
