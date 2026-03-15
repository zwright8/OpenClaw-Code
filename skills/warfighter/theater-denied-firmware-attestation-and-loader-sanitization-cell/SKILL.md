---
name: theater-denied-firmware-attestation-and-loader-sanitization-cell
description: Validate firmware pedigree, sanitize field loaders, and decide return-to-service or quarantine for cyber-electromagnetic systems in denied environments. Use when U.S. forces must trust mission software, patches, or removable media without full enterprise reachback.
---

# Theater Denied Firmware Attestation And Loader Sanitization Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter firmware-trust, field-loader sanitization, and return-to-service decisions in contested conditions.
- Confirm affected platforms, signing or pedigree evidence, removable-media exposure, operational deadlines, and cyber authority before recommending action.
- Keep outputs unclassified by default unless platform vulnerabilities, signing material, or exploitation details require protected handling.

## Workflow

1. Frame the mission problem with affected systems, firmware baselines, loader custody, compromise indicators, and mission deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in mission speed, cyber trust, airworthiness or safety risk, and recovery burden.
3. Identify branch triggers for quarantine, clean reload, cryptographic re-attestation, or manual degraded operation.
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

Primary products: firmware trust matrix, loader sanitization ladder, and return-to-service packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-denied-firmware-attestation-loader-sanitization-v1` with `protocol_stack_id=ps-theater-denied-firmware-attestation-loader-sanitization-stack-v1`.
- Alternate: select a mission-adjacent software-factory, zero-trust, or mission-network failover suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: keep systems in the most conservative approved mode, use a manual loader-custody ledger, and require command-approved release before reconnecting any affected node.

## Domain Packet Defaults

- Default packet ID: `DPL-DENIED-FIRMWARE-ATTESTATION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: firmware provenance ledger, hash or SBOM attestation board, loader sanitization queue, and return-to-service status board.
- Preferred protocol profiles for coordination and machine exchange: signed firmware manifests, `X.509`, `STIX/TAXII`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If signing trust, loader custody, or cyber-release authority is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Do not recommend bypassing code-signing, safety interlocks, or integrity controls merely to restore speed.
- Flag removable-media compromise, counterfeit firmware, and uncertain rollback baselines before recommending return to service.
