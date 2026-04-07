---
name: homeland-emergency-manager-common-operating-picture-fusion-cell
description: Fuse state, county, municipal, and military incident data into a coherent common operating picture for domestic response. Use when commanders need trusted domestic COP updates despite fragmented reporting, stale feeds, or conflicting local priorities.
---

# Homeland Emergency Manager Common Operating Picture Fusion Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter domestic COP fusion, incident prioritization, and emergency-manager coordination.
- Confirm supported jurisdictions, incident systems, reporting cadence, data-confidence thresholds, and commander decision timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using incident reports, affected jurisdictions, local priorities, data-quality gaps, and required decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, fidelity, workload, and public-risk visibility.
3. Identify branch triggers for stale data rejection, duplicate-report suppression, rumor escalation, and manual COP fallback.
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

Primary products: incident-priority map, data-confidence board, and emergency-manager COP synchronization tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-homeland-emergency-manager-cop-fusion-v1` with `protocol_stack_id=ps-homeland-emergency-manager-cop-fusion-stack-v1`.
- Alternate: select a mission-adjacent DSCA, public-warning, or civil-infrastructure suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual COP board with time-bounded local check-ins and no machine-fused risk score beyond confirmed reporting.

## Domain Packet Defaults

- Default packet ID: `DPL-EMERGENCY-MANAGER-COP-FUSION-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: emergency-operations dashboard, incident-status board, geospatial fusion layer, and report-validation queue.
- Preferred protocol profiles for coordination and machine exchange: `EDXL-DE/CAP`, `NIEM`, `OGC`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If local data provenance, incident ownership, or warning implications are uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag stale feeds, duplicate incident inflation, rumor contamination, and hidden local-priority conflicts before recommending action.
- Do not fabricate county or municipal reporting, state confirmation, or COP reconciliation status.
