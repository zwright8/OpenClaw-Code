---
name: theater-allied-civilian-contractor-readiness-and-force-protection-cell
description: Protect mission-essential allied civilian contractors, route them safely, and preserve contractor-dependent combat power in contested theaters.
---

# Theater Allied Civilian Contractor Readiness And Force Protection Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter contractor-readiness and contractor-protection decisions.
- Confirm supported mission threads, contractor authorities, vetting posture, protected-route constraints, and commander decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using contractor dependencies, threat picture, access status, badging or vetting health, and route exposure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, survivability, legal sufficiency, and sustainment burden.
3. Identify branch triggers for contractor consolidation, access revocation, protected convoying, shelter-in-place, and mission substitution.
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

Primary products: contractor dependency board, force-protection routing matrix, access-control exception log, and mission-substitution decision ladder.

## Domain Toolchain Defaults

- Primary: `toolchain_id=TC-CONTRACTOR-241`, `tool_suite_id=ts-theater-allied-civilian-contractor-readiness-and-force-protection-v1`, and `protocol_stack_id=ps-theater-allied-civilian-contractor-readiness-and-force-protection-stack-v1`.
- Alternate: select a mission-adjacent force-protection, contracting, or civil-support suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: mission-essential contractors only with dual-review access checks and command-approved movement windows.

## Domain Packet Defaults

- Default packet IDs: `DPL-CONTRACTOR-PROTECTION-001` and `DPL-CONTRACTOR-DEPENDENCY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: contractor roster ledger, badging and vetting tracker, protected-route scheduler, and service-dependency board.
- Preferred protocol profiles for coordination and machine exchange: signed workforce manifests, `NIEM`, `API/JSON`, `S/MIME`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If contractor legal status, access approval, or route-control legitimacy is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag unsupported contractor availability, access-control shortcuts, force-protection gaps, and civil-liability risk before recommending action.
- Do not fabricate contractor status, vetting outcomes, movement approvals, or mission dependencies.
