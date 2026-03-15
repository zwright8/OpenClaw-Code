---
name: strategic-cable-landing-station-sanctions-bypass-hunt-cell
description: Hunt sanctions-bypass activity and cyber or physical threats against strategic cable landing stations. Use when adversaries or gray-zone actors use telecom infrastructure to evade controls or degrade mission connectivity.
---

# Strategic Cable Landing Station Sanctions Bypass Hunt Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter cable-landing resilience, sanctions-evasion detection, and telecom continuity decisions.
- Confirm landing-station ownership, cyber posture, shipping or logistics context, legal authorities, and mission-critical dependencies before recommending action.
- Keep outputs unclassified by default unless law-enforcement equities, sensitive telecom routes, or counterintelligence details require protected handling.

## Workflow

1. Frame the mission problem using landing-station health, suspicious traffic or logistics patterns, cyber events, and sanctions-evasion indicators.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in continuity, legal defensibility, exposure risk, and interdiction speed.
3. Identify branch triggers for OT compromise, bypass-network confirmation, maritime tamper indicators, and alternate-route exhaustion.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and interagency decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: cable landing threat board, bypass network map, and countermeasure action matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-cable-landing-station-sanctions-bypass-hunt-v1` with `protocol_stack_id=ps-strategic-cable-landing-station-sanctions-bypass-hunt-stack-v1`.
- Alternate: select a mission-adjacent maritime, cyber-defense, or strategic-infrastructure suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual watchstanding with route-critical protection, fixed reporting windows, and advisory-only sanctions leads.

## Domain Packet Defaults

- Default packet ID: `DPL-CABLE-LANDING-SANCTIONS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: cable landing OT monitor, shipping and sanctions analytics board, identity or provenance ledger, and cyber threat timeline.
- Preferred protocol profiles for coordination and machine exchange: `STIX/TAXII`, `AIS/NMEA`, `NIEM`, signed maintenance manifests, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If sanctions-evasion confidence, landing-station authority, or cyber attribution is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag commercial-civil impact, legal evidence gaps, OT fragility, and maritime tamper ambiguity before recommending action.
- Do not fabricate sanctions violations, attribution confidence, or network restoration success.
