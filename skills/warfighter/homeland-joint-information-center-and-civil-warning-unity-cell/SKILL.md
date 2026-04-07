---
name: homeland-joint-information-center-and-civil-warning-unity-cell
description: Keep military, civil, and public-warning messaging synchronized through a domestic joint information center. Use when commanders need trusted warning language, rumor control, and unified public-facing timelines across agencies.
---

# Homeland Joint Information Center And Civil Warning Unity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter domestic warning, public-information, and joint-information-center decisions.
- Confirm supported jurisdictions, warning authorities, release timelines, affected populations, and message-approval chain before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using incident timeline, warning channels, public-information gaps, rumor indicators, and commander communication objectives.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, trust, message precision, and public-risk reduction.
3. Identify branch triggers for warning reissue, multilingual release, rumor rebuttal, and next-of-kin or sensitive-detail hold.
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

Primary products: unified message board, warning-release ladder, and rumor-control synchronization tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-joint-information-center-civil-warning-unity-v1` with `protocol_stack_id=ps-homeland-joint-information-center-civil-warning-unity-stack-v1`.
- Alternate: select a mission-adjacent public-affairs, civil-warning, or DSCA suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: single-source holding statement with manual approval log and no warning amplification until source authenticity is confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-JIC-CIVIL-WARNING-UNITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: warning-publisher dashboard, rumor-monitor board, multilingual message tracker, and public-affairs approval queue.
- Preferred protocol profiles for coordination and machine exchange: `CAP`, `NIEM`, signed release packages, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If warning authority, release authenticity, or next-of-kin timing is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag contradictory warnings, multilingual mismatch, rumor amplification, and premature sensitive-detail release before recommending action.
- Do not fabricate warning authority, message approval, or public-channel reach.
