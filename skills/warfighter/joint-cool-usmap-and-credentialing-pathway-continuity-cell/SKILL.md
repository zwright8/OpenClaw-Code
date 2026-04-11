---
name: joint-cool-usmap-and-credentialing-pathway-continuity-cell
description: Preserve COOL voucher use, USMAP apprenticeship-hour capture, credential exam scheduling, and civilian-license crosswalk continuity when deployment, PCS, or medical recovery threatens U.S. warfighter credential progress and transition readiness.
---

# Joint COOL USMAP And Credentialing Pathway Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter credentialing-pathway, apprenticeship, and funded-exam continuity decisions.
- Confirm affected population, service-credential status, voucher deadlines, apprenticeship-hour posture, exam availability, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize personal credential or training detail unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using voucher windows, apprenticeship-hour capture risk, exam backlog, license-crosswalk needs, and deployment or transition timeline.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in credential legitimacy, timing, administrative burden, and transition value.
3. Identify branch triggers for expiring vouchers, missing apprenticeship hours, failed exam scheduling, crosswalk disputes, and personnel-record mismatch.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and credential-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and credential-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: credential-pathway board, voucher-and-hour recovery ladder, and civilian-crosswalk continuity packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-COOLMAP-337`, `tool_suite_id=ts-joint-cool-usmap-credentialing-pathway-continuity-v1`, and `protocol_stack_id=ps-joint-cool-usmap-credentialing-pathway-continuity-stack-v1`.
- Alternate: select a mission-adjacent professional-license, transition-assistance, or SkillBridge suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual credential-priority roster with advisory-only sequencing until voucher status, hour capture, and exam availability are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-COOL-USMAP-CREDPATH-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: COOL voucher tracker, USMAP apprenticeship-hour ledger, credential exam queue, and civilian-license crosswalk board.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `HR-XML`, signed credential notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If credential authority, voucher legitimacy, or exam evidence is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and credential-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported voucher promises, missing apprenticeship evidence, exam-seat uncertainty, and false credential-completion confidence before recommending action.
- Do not fabricate voucher approval, apprenticeship-hour credit, exam outcomes, or civilian-license equivalency.
