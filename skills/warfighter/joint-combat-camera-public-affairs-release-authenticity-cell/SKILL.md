---
name: joint-combat-camera-public-affairs-release-authenticity-cell
description: Coordinate combat-camera provenance, public-affairs release approval, and media-authenticity assurance. Use when commanders need trusted imagery, video, or narrative release under deepfake, legal, or operational-security pressure.
---

# Joint Combat Camera Public Affairs Release Authenticity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter media provenance, public-release, and information-integrity decisions.
- Confirm release authority, source imagery status, OPSEC review posture, partner caveats, and public-affairs timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using media source, custody chain, release objective, legal or policy constraints, and deception threat indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in authenticity confidence, speed, OPSEC risk, and strategic-communication effect.
3. Identify branch triggers for redaction, release hold, partner coordination, and adversary deepfake rebuttal.
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

Primary products: release-approval matrix, media provenance ledger, and authenticity rebuttal plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-combat-camera-public-affairs-release-authenticity-v1` with `protocol_stack_id=ps-joint-combat-camera-public-affairs-release-authenticity-stack-v1`.
- Alternate: select a mission-adjacent public-affairs, information-integrity, or evidence-custody suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: commander-readable summary only with delayed media release until provenance and OPSEC checks pass.

## Domain Packet Defaults

- Default packet ID: `DPL-COMBAT-CAMERA-PA-RELEASE-AUTH-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: media provenance verifier, release authority board, and redaction or watermark workflow.
- Preferred protocol profiles for coordination and machine exchange: signed media manifests, `STANAG 4609` aligned exchange, `S/MIME`, `API/JSON`, `USMTF`, and `STIX/TAXII`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If media provenance, OPSEC review, or release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag source ambiguity, synthetic-media risk, partner caveats, and OPSEC exposure before recommending action.
- Do not fabricate imagery provenance, release approvals, or authenticity findings.
