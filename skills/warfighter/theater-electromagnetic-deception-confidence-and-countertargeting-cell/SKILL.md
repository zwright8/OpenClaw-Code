---
name: theater-electromagnetic-deception-confidence-and-countertargeting-cell
description: Coordinate friendly electromagnetic deception scoring, adversary countertargeting indicators, and release controls when U.S. warfighter survivability depends on decoy credibility and trusted emission discipline.
---

# Theater Electromagnetic Deception Confidence And Countertargeting Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm deception authorities, blue-force emission constraints, adversary sensing posture, and commander priorities before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with decoy layout, emitter inventory, adversary sensor behavior, and commander priorities.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in survivability, detectability, false-target value, and fratricide risk.
3. Identify branch triggers for decoy refresh, emission hold, signature shift, or countertargeting response.
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

Primary products: deception confidence ladder, countertargeting matrix, and emission exposure ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-electromagnetic-deception-confidence-countertargeting-v1` with `protocol_stack_id=ps-theater-electromagnetic-deception-confidence-countertargeting-stack-v1`.
- Alternate: select a mission-adjacent CEMA, force-protection, or deception suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: fixed emission windows only with commander-approved decoy usage and manual exposure logging.

## Domain Packet Defaults

- Default packet ID: `DPL-EM-DECEPTION-CONFIDENCE-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: deception effects board, emitter confidence scorer, and adversary sensor behavior monitor.
- Preferred protocol profiles for coordination and machine exchange: `Link 16 J-series`, `VMF`, `CoT`, `STIX/TAXII`, `API/JSON`, and signed emission manifests.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If deception evidence, blue-force deconfliction, or release authority is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag blue-force fratricide exposure, signature leakage, adversary adaptation, and escalation consequences before recommending action.
- Do not fabricate deception effects, adversary confidence, or release approvals.
