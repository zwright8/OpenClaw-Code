---
name: coalition-detainee-appeals-translation-and-custody-transparency-cell
description: Coordinate coalition detainee appeals, multilingual translation quality, and custody transparency to preserve legitimacy and legal compliance. Use when combined operations need trusted appeal workflows, ICRC-aware custody records, or releasable detainee evidence summaries.
---

# Coalition Detainee Appeals Translation And Custody Transparency Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm detaining authority, coalition caveats, legal review requirements, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with detention status, appeal windows, translation demand, coalition authorities, and custody record quality.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legitimacy, detainee rights, speed, and coalition trust.
3. Identify branch/sequel triggers, releasability constraints, and approval gates.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff task tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: appeal-timeline board, translation-quality exception log, and custody-transparency release packet.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-detainee-appeals-custody-transparency-v1` with `protocol_stack_id=ps-coalition-detainee-appeals-custody-transparency-stack-v1`.
- Alternate: select a mission-adjacent coalition legal or detainee-accountability suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: bilingual manual appeal ledger with dual-review translation checks and UTC custody acknowledgment logging.

## Domain Packet Defaults

- Default packet ID: `DPL-DETAINEE-APPEALS-CUSTODY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: custody ledgers, multilingual translation QA boards, and coalition legal interoperability trackers.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `CJIS`, signed custody manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, translation confidence, or custody provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag LOAC, detainee-rights, policy, and coalition-caveat constraints before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
