---
name: joint-skillbridge-career-skills-apprenticeship-and-employer-fellowship-continuity-cell
description: Preserve SkillBridge, Career Skills Program, apprenticeship, credentialing, and employer-fellowship continuity for U.S. warfighters during separation, medical recovery, retirement, or PCS disruption. Use when transition-system friction is starting to degrade readiness, retention, or lawful separation.
---

# Joint SkillBridge Career Skills Apprenticeship And Employer Fellowship Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter transition-program and career-bridge continuity decisions.
- Confirm affected personnel, separation or recovery timeline, command constraints, employer commitment posture, and credential dependencies before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using SkillBridge or CSP status, apprenticeship or fellowship continuity, command-approval windows, and transition timing.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, placement legitimacy, credential timing, and staff burden.
3. Identify branch triggers for employer withdrawal, command disapproval, delayed DD214 or separation status, credential gap, and internship-start slippage.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and transition-program risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: SkillBridge continuity board, employer-fellowship ladder, and transition-placement packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-SKILLBRIDGE-316`, `tool_suite_id=ts-joint-skillbridge-career-skills-apprenticeship-employer-fellowship-continuity-v1`, and `protocol_stack_id=ps-joint-skillbridge-career-skills-apprenticeship-employer-fellowship-continuity-stack-v1`.
- Alternate: select a mission-adjacent retirement, education-benefits, or personnel-records suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual transition-priority roster with advisory-only action until eligibility, employer commitment, and command approval are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-SKILLBRIDGE-CSP-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: transition-program case board, employer-fellowship approval queue, internship or apprenticeship tracker, and credential handoff ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed transition notices, `API/JSON`, `S/MIME`, `HR-XML`, `PESC XML`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If program eligibility, employer acceptance, or command authority is uncertain, downgrade to advisory-only and request human transition-services review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and acknowledgment integrity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported placement promises, missing approvals, delayed credential transfer, and transition-timing fragility before recommending action.
- Do not fabricate SkillBridge approval, employer commitment, credential reciprocity, or separation authority.
