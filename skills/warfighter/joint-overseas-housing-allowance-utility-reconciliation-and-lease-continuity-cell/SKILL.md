---
name: joint-overseas-housing-allowance-utility-reconciliation-and-lease-continuity-cell
description: Preserve Overseas Housing Allowance (OHA), MIHA-style move-in cost recovery, utility reconciliation, and lease continuity when overseas housing friction destabilizes U.S. warfighter households and assignment execution.
---

# Joint Overseas Housing Allowance Utility Reconciliation And Lease Continuity Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter overseas-housing, lease, and allowance-continuity decisions.
- Confirm command-sponsorship posture, lease status, rent and utility evidence, host-nation housing-office constraints, and reporting or PCS deadlines before recommending action.
- Keep outputs unclassified by default and minimize personally identifiable information unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using lease status, rent or utility burden, OHA posture, move-in cost exposure, and household stability risk.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in lawful housing support, documentation burden, foreign-currency exposure, and assignment stability.
3. Identify branch triggers for lease non-renewal, utility arrears, rent-cap mismatch, host-nation documentation failure, and temporary-housing fallback.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and overseas-housing risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: overseas-housing allowance board, lease and utility reconciliation ladder, and assignment-stability packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-OHA-397`, `tool_suite_id=ts-joint-overseas-housing-allowance-utility-reconciliation-lease-continuity-v1`, and `protocol_stack_id=ps-joint-overseas-housing-allowance-utility-reconciliation-lease-continuity-stack-v1`.
- Alternate: select a mission-adjacent command-sponsorship, spouse-employment, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual overseas-housing case roster with advisory-only sequencing until lease evidence, utility posture, and location authority are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-OHA-LEASE-UTILITY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: overseas-housing lease board, rent and utility reconciliation ledger, move-in cost tracker, and command-sponsorship or housing-office liaison queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, `ISO 20022`, signed housing notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If lease legitimacy, OHA evidence, or host-nation housing acceptance is uncertain, downgrade to advisory-only and request human housing or legal review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and housing-evidence clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported lease promises, utility-account assumptions, currency-conversion blind spots, and unlawful host-nation housing shortcuts before recommending action.
- Do not fabricate lease validity, OHA approval, utility restoration, or landlord acceptance.
