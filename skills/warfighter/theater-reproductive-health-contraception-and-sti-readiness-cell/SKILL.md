---
name: theater-reproductive-health-contraception-and-sti-readiness-cell
description: Coordinate reproductive-health readiness, contraception continuity, and STI screening or treatment support for U.S. warfighters. Use when protected care access, pharmacy flow, and privacy-sensitive diagnostics affect force readiness.
---

# Theater Reproductive Health, Contraception, And STI Readiness Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter reproductive-health readiness, protected pharmacy continuity, and privacy-sensitive diagnostic decisions.
- Confirm force composition, diagnostic capacity, pharmacy inventory, host-nation constraints, privacy requirements, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with medication stocks, test throughput, symptomatic case load, privacy constraints, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, confidentiality, pharmacy burden, and diagnostic speed.
3. Identify branch triggers for pharmacy redistribution, protected testing expansion, exposure notification, and higher-echelon referral.
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

Primary products: reproductive-health readiness board, pharmacy and diagnostics allocation plan, and privacy-safe care-routing matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-reproductive-health-contraception-sti-readiness-v1` with `protocol_stack_id=ps-theater-reproductive-health-contraception-sti-readiness-stack-v1`.
- Alternate: select a mission-adjacent preventive-medicine, pharmacy, or Role 3 suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: paper pharmacy ledger, protected appointment roster, and dual-review diagnostic release board.

## Domain Packet Defaults

- Default packet ID: `DPL-REPRODUCTIVE-HEALTH-STI-READINESS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: protected pharmacy ledger, STI screening workflow, contraception supply tracker, and privacy-safe referral queue.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, signed pharmacy manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If confidentiality boundaries, pharmacy pedigree, or diagnostic confirmation is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag confidentiality breaches, coercion risk, medication expiration, partner-notification mishandling, and protected-health-data exposure before recommending action.
- Do not fabricate test results, prescription authority, or patient consent.
