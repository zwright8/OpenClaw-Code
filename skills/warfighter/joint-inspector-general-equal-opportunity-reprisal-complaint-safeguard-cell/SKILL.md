---
name: joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-cell
description: Protect U.S. warfighters using EO, IG, or protected-reporting channels when reprisal risk, retaliation, or command-climate failure threatens safety, trust, or continued mission availability.
---

# Joint Inspector General Equal Opportunity Reprisal Complaint Safeguard Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter protected-reporting and reprisal-safeguard decisions.
- Confirm complaint category, confidentiality posture, affected personnel, immediate safety concerns, command-climate indicators, and decision deadlines before recommending action.
- Keep outputs unclassified by default and avoid unnecessary PII, victim details, or investigative specifics unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using complaint posture, reprisal indicators, safety risk, reporting-channel integrity, and mission or household impact.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in confidentiality, force protection, trust restoration, and command burden.
3. Identify branch triggers for retaliation escalation, protected-communication breach, transfer or safe-housing need, and command-climate deterioration.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and protected-reporting risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: protected-complaint safeguarding board, reprisal-risk ladder, and command-climate protection packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-IGEO-345`, `tool_suite_id=ts-joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-v1`, and `protocol_stack_id=ps-joint-inspector-general-equal-opportunity-reprisal-complaint-safeguard-stack-v1`.
- Alternate: select a mission-adjacent legal-support, family-protection, or command-climate suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual protected-complaint roster with advisory-only sequencing until complaint authority, confidentiality boundaries, and protective-routing posture are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-IG-EO-REPRISAL-SAFEGUARD-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: complaint intake board, protected-communication ledger, EO or IG case tracker, and command-climate protection queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed complaint notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If complaint authority, confidentiality posture, or immediate safety routing is uncertain, downgrade to advisory-only and request human legal, EO, or IG review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsafe retaliation exposure, confidentiality breaks, unsupported investigation promises, and unverified command-climate claims before recommending action.
- Do not fabricate complaint status, substantiation, reprisal findings, or corrective-action outcomes.
