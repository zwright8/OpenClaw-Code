---
name: joint-sexual-assault-response-restricted-reporting-and-unit-safety-cell
description: Support joint sexual-assault response, restricted-reporting protection, survivor care routing, and unit-safety decisions. Use when commanders or staff must synchronize trauma-informed support, confidentiality boundaries, retaliation prevention, and force-readiness actions.
---

# Joint Sexual Assault Response Restricted Reporting And Unit Safety Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter survivor-support, protection, and command-accountability decisions.
- Confirm command authority, reporting posture, confidentiality limits, medical availability, victim-advocate coverage, and immediate safety threats before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the case using survivor support requirements, reporting posture, unit-safety concerns, evidence-preservation needs, and command-decision deadlines.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivor safety, confidentiality, readiness impact, and legal risk.
3. Identify branch triggers for restricted-to-unrestricted transitions, emergency relocation, expedited medical care, and command-climate intervention.
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

Primary products: survivor support matrix, restricted-reporting safeguard board, and unit-safety action tracker.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-sexual-assault-restricted-reporting-unit-safety-v1` with `protocol_stack_id=ps-joint-sexual-assault-restricted-reporting-unit-safety-stack-v1`.
- Alternate: select a mission-adjacent medical, legal, or command-climate suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: survivor-safety-first manual routing only with restricted PII exposure and dual-review confidentiality checks.

## Domain Packet Defaults

- Default packet ID: `DPL-SAPR-RESTRICTED-REPORTING-UNIT-SAFETY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: restricted case-management ledger, survivor care-routing board, and unit-safety retaliation monitor.
- Preferred protocol profiles for coordination and machine exchange: `HL7/FHIR`, `NIEM`, signed case manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If confidentiality, survivor consent, reporting posture, or retaliatory-risk assumptions are uncertain, downgrade to advisory-only and request human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Use trauma-informed language and protect survivor autonomy, safety, and confidentiality.
- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag retaliation risk, care delays, privacy breaches, and command-climate hazards before recommending action.
- Do not fabricate survivor statements, medical findings, authorities, or approvals.
