---
name: theater-cultural-property-protection-and-no-strike-governance-cell
description: Coordinate cultural-property protection, heritage-site geofencing, and no-strike governance for theater operations. Use when commanders need to preserve protected sites while sustaining maneuver, fires, and legitimacy.
---

# Theater Cultural Property Protection And No-Strike Governance Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter targeting-governance, civil-legitimacy, and protected-site preservation decisions.
- Confirm theater authority, target-development status, partner caveats, protected-site registries, and legal review timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem using heritage-site data, no-strike lists, target-development timelines, civil-effects concerns, and commander decision points.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in operational freedom, protected-site risk, adversary exploitation, and legitimacy.
3. Identify branch triggers for no-strike boundary updates, restricted-target release, site-forensic access, and civil-affairs engagement.
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

Primary products: protected-site geofence board, no-strike exception ladder, and cultural-property risk matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-cultural-property-no-strike-governance-v1` with `protocol_stack_id=ps-theater-cultural-property-no-strike-governance-stack-v1`.
- Alternate: select a mission-adjacent targeting, civil-affairs, or legal-governance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: no-strike-by-default with manual geofence confirmation and legal review for any exception.

## Domain Packet Defaults

- Default packet ID: `DPL-CULTURAL-PROPERTY-NO-STRIKE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: heritage-site registry, no-strike geofence board, and collateral-effects review workbench.
- Preferred protocol profiles for coordination and machine exchange: `OGC`, `NIEM`, `USMTF`, `API/JSON`, signed geofence manifests, and NATO APP-11/ADatP-3 aligned exchange.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If protected-site status, legal basis, or no-strike integrity is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag protected-site misidentification, adversary misuse, geofence drift, and legitimacy-risk before recommending action.
- Do not fabricate protected-site status, legal authorities, or approvals.
