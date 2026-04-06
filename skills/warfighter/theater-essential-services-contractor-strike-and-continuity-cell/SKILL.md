---
name: theater-essential-services-contractor-strike-and-continuity-cell
description: Preserve essential services when contractor labor actions or walkouts threaten base operations, utilities, transport, sanitation, or life support. Use when commanders need continuity decisions tied to explicit tool and protocol bindings.
---

# Theater Essential Services Contractor Strike And Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter essential-services continuity during contractor labor disruption.
- Confirm affected services, labor posture, contract authorities, minimum safe staffing, and mission-critical dependencies before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using service dependencies, labor-action status, replacement options, backlogs, and commander decision timelines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in legality, service loss, workforce trust, and operational risk.
3. Identify branch triggers for service shedding, emergency replacement contracts, troop substitution, and public-health escalation.
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

Primary products: service-continuity ladder, labor-action impact board, and emergency replacement task tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-essential-services-contractor-strike-continuity-v1` with `protocol_stack_id=ps-theater-essential-services-contractor-strike-continuity-stack-v1`.
- Alternate: select a mission-adjacent utility, logistics, or contracting suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual service-rationing board with command-approved minimum safe service levels and no unsupported system restart.

## Domain Packet Defaults

- Default packet ID: `DPL-ESSENTIAL-SERVICES-STRIKE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: service-status dashboard, labor-action monitor, contingency-contract queue, and public-health risk tracker.
- Preferred protocol profiles for coordination and machine exchange: `OPC UA`, `NIEM`, `CAP`, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If labor authority, minimum-safe-service thresholds, or replacement-contract posture is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe manning, water or power loss, sanitation collapse, and unlawful labor-response assumptions before recommending action.
- Do not fabricate contract authority, service status, or workforce availability.
