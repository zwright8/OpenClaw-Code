---
name: coalition-partner-force-insider-threat-and-advisor-protection-cell
description: Coordinate partner-force vetting, insider-threat indicators, and advisor protection decisions for U.S. teams. Use when advisors, SFAB elements, or liaison cells need counterpart trust assessments, guardian-angel posture, or movement-risk branches.
---

# Coalition Partner Force Insider Threat And Advisor Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter advisor missions with coalition or partner forces.
- Confirm advisor authorities, partner-force relationships, movement windows, intelligence confidence, and host-nation caveats before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem with counterpart roster, insider-risk indicators, advisor movement plan, and required engagements.
2. Build one recommended COA and at least two alternatives with tradeoffs in partner trust, advisor survivability, mission access, and escalation risk.
3. Identify branch triggers for guardian-angel changes, counterpart decertification, venue changes, route shifts, or mission pause.
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

Primary products: advisor protection matrix, counterpart reliability watchboard, and green-on-blue prevention branch plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-coalition-partner-force-insider-threat-advisor-protection-v1` with `protocol_stack_id=ps-coalition-partner-force-insider-threat-advisor-protection-stack-v1`.
- Alternate: select a mission-adjacent coalition, intelligence, or force-protection suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: essential engagements only with dual-review counterpart screening, hardened guardian-angel posture, and reduced movement profile.

## Domain Packet Defaults

- Default packet ID: `DPL-PARTNER-FORCE-INSIDER-ADVISOR-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: partner vetting ledger, advisor movement protection board, and behavioral indicator monitor.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `USMTF`, `STIX/TAXII`, `S/MIME`, `API/JSON`, and `CoT`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If vetting confidence, intelligence provenance, or host-nation consent is uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified behavior, assessed risk, assumptions, and unknowns.
- Do not turn weak indicators into guilt or recommend collective punishment against partner formations.
- Flag advisor-force protection gaps, guardian-angel shortfalls, and retaliation risk before recommending action.
- Do not fabricate source reporting, authorities, or partner approvals.
