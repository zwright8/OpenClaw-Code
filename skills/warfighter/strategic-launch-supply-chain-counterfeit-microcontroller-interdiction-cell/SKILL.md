---
name: strategic-launch-supply-chain-counterfeit-microcontroller-interdiction-cell
description: Identify and interdict counterfeit microcontrollers that threaten strategic launch and space-support systems. Use when commanders need trusted electronics pedigree before launch, reconstitution, or repair decisions.
---

# Strategic Launch Supply Chain Counterfeit Microcontroller Interdiction Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm system criticality, supplier path, test windows, and hold-or-release authority before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the affected launch or space-support systems, suspect component paths, and mission deadlines.
2. Build quarantine, substitution, recertification, and mission-delay branches with explicit readiness and schedule tradeoffs.
3. Bind each recommendation to provenance, test, and supply-chain tools plus required packetized outputs.
4. Publish commander decision points, engineering tasking, and degraded branches if trusted components cannot be certified in time.

## Required Output Format

1. Situation snapshot.
2. Recommended interdiction branch and rationale.
3. Alternative branches with release or quarantine triggers.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Component pedigree packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: counterfeit-risk disposition board, trusted-component release matrix, and launch schedule impact ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-launch-counterfeit-microelectronics-v1` with `protocol_stack_id=ps-strategic-launch-counterfeit-microelectronics-stack-v1`.
- Alternate: approved-vendor-only screening board plus lot-isolation worksheet.
- Degraded: quarantine-first posture with manual dual-control release review.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-LAUNCH-COUNTERFEIT-MICRO-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed supply manifests, `API/JSON`, `NIEM`, and `USMTF`.
- Include source system, refresh UTC, confidence, test evidence gaps, and supplier-trust caveats in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run provenance and release checks from `../_shared/references/mission-assurance-checklist.md`.
- If pedigree evidence, component test integrity, or launch authority is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate pedigree evidence, microelectronics test results, or release authority.
- Separate suspected counterfeit indicators from confirmed interdiction findings.
- Treat launch-critical electronics decisions as high-consequence and human-approved.
