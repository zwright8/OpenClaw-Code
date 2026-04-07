---
name: joint-post-isolation-evasion-tradecraft-threat-refresh-cell
description: Convert recovered-personnel debriefs into updated threat, evasion, and recovery lessons for U.S. warfighters. Use when post-isolation reporting must rapidly refresh threat libraries, SERE assumptions, or rescue planning baselines.
---

# Joint Post Isolation Evasion Tradecraft Threat Refresh Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm debrief authority, classification or releasability boundaries, training-update ownership, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with recovered-personnel reporting, adversary TTP changes, escape or evasion observations, and current mission-planning assumptions.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, intelligence confidence, OPSEC risk, and training burden.
3. Identify branch or sequel triggers for urgent threat bulletins, mission-data updates, SERE curriculum changes, or withheld dissemination.
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

Primary products: threat refresh packet, evasion tradecraft delta board, and training-update task list.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-post-isolation-evasion-threat-refresh-v1` with `protocol_stack_id=ps-joint-post-isolation-evasion-threat-refresh-stack-v1`.
- Alternate: select a mission-adjacent personnel-recovery, intelligence-fusion, or training-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual lessons board with dual-review debrief extracts and commander-approved interim threat notes.

## Domain Packet Defaults

- Default packet ID: `DPL-POST-ISOLATION-THREAT-REFRESH-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: debrief insight board, threat TTP library, personnel-recovery lessons tracker, and mission-data update queue.
- Preferred protocol profiles for coordination and machine exchange: signed debrief manifests, `STIX/TAXII`, `NIEM`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If debrief provenance, releasability, or update authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Keep outputs at threat-refresh, training, and defensive planning level; do not generate covert escape methods, resistance tactics, or abuse guidance.
- Do not fabricate debrief content, threat shifts, or dissemination authority.
