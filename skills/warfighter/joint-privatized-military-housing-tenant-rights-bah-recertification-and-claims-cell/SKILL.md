---
name: joint-privatized-military-housing-tenant-rights-bah-recertification-and-claims-cell
description: Protect tenant-rights, habitability escalation, BAH recertification, and damage or displacement claims continuity in privatized military housing when housing instability starts eroding warfighter readiness.
---

# Joint Privatized Military Housing Tenant Rights BAH Recertification And Claims Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter housing-continuity decisions where privatized housing disputes or habitability failures affect readiness and household stability.
- Confirm affected households, housing condition, BAH posture, claims status, and decision authority before recommending action.
- Keep outputs unclassified by default and minimize PII unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using habitability status, tenant-rights exposure, BAH recertification risk, claims backlog, and command or housing-office pressure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in safety, legal sufficiency, cost recovery, and force availability.
3. Identify branch triggers for unsafe housing, disputed charges, denied claims, BAH mismatch, and temporary-lodging escalation.
4. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
5. Publish commander and housing-support decision prompts plus a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and housing-risk trend.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: housing-dispute board, BAH-and-claims recovery ladder, and tenant-rights escalation packet.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-PMHOUS-360`, `tool_suite_id=ts-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-v1`, and `protocol_stack_id=ps-joint-privatized-military-housing-tenant-rights-bah-recertification-claims-stack-v1`.
- Alternate: select a mission-adjacent housing-stability, legal-assistance, or family-readiness suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: manual housing-priority roster with advisory-only sequencing until habitability, BAH posture, and claims evidence are human-confirmed.

## Domain Packet Defaults

- Default packet ID: `DPL-PRIVATIZED-HOUSING-BAH-CLAIMS-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: privatized-housing case board, habitability claims tracker, BAH recertification ledger, and displacement-support queue.
- Preferred protocol profiles for coordination and machine exchange: `NIEM`, signed housing notices, `API/JSON`, `S/MIME`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If housing evidence, lease posture, or BAH authority is uncertain, downgrade to advisory-only and request human review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and housing-escalation clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported habitability claims, BAH promises, reimbursement assumptions, and legal-rights overclaim before recommending action.
- Do not fabricate tenant-rights remedies, BAH outcomes, damage awards, or relocation approvals.
