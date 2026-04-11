---
name: joint-state-tax-domicile-residency-and-withholding-continuity-cell
description: Preserve state-tax domicile, residency, and withholding continuity when PCS, mobilization, remote work, or spouse-employment shifts create conflicting tax posture that can erode U.S. warfighter household stability.
---

# Joint State Tax Domicile Residency And Withholding Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter state-tax and domicile-legitimacy decisions.
- Confirm duty status, state of legal residence, withholding posture, spouse-employment nexus, and filing deadlines before recommending action.
- Keep outputs unclassified by default and minimize tax-sensitive data unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using domicile evidence, current withholding posture, PCS or mobilization timeline, remote-work exposure, and household financial risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in tax compliance, cash-flow stability, privacy, and administrative burden.
3. Identify branch triggers for conflicting state notices, double withholding, domicile-document mismatch, LES error, and spouse or remote-work nexus escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and state-tax risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: state-tax residency board, withholding correction ladder, and domicile-evidence packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-TAXDOM-363`, `tool_suite_id=ts-joint-state-tax-domicile-residency-withholding-continuity-v1`, and `protocol_stack_id=ps-joint-state-tax-domicile-residency-withholding-continuity-stack-v1`.
- Alternate: select a mission-adjacent tax-relief, compensation, or legal-assistance suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual tax-residency roster with advisory-only sequencing until domicile evidence, LES posture, and tax-notice authenticity are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-STATE-TAX-DOMICILE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: domicile-election board, state-tax notice tracker, withholding correction queue, and residency-evidence ledger.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `AAMVA DL/ID`, signed tax notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If domicile evidence, withholding authority, or tax-notice legitimacy is uncertain, downgrade to advisory-only and request human fiscal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and residency-proof clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported state-tax promises, legal-residence shortcuts, spouse-tax assumptions, and double-withholding exposure before recommending action.
- Do not fabricate domicile status, tax authority, withholding corrections, or filing outcomes.
