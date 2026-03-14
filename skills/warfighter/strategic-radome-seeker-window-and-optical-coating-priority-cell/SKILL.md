---
name: strategic-radome-seeker-window-and-optical-coating-priority-cell
description: Prioritize radomes, seeker windows, and specialty optical coatings across strategic weapons, ISR, and air-defense demand. Use when scarce electro-optical materials or coating capacity constrain mission release confidence.
---

# Strategic Radome Seeker Window And Optical Coating Priority Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm release authority, coating-certification thresholds, strategic demand priorities, and industrial deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with optical lot pedigree, coating-line status, inspection results, and mission demand.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in readiness, inspection confidence, coating throughput, and cross-program scarcity.
3. Identify branch or sequel triggers, lot hold points, and approval gates.
4. Bind each critical recommendation to concrete external tools, protocols, and staff handoffs.
5. Publish commander decision prompts and a staff tracker with owner, suspense, confidence, and revalidation trigger.

## Required Output Format

1. Situation snapshot and key changes.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and escalation gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: optics allocation matrix, coating-capacity ladder, and release-confidence board.

## External Tool Stack and Protocols

- Primary toolsets: optical coating queue, radome pedigree ledger, and seeker-window inspection board.
- Alternate toolsets: manual lot-allocation worksheet, coating rework board, and strategic release review cell.
- Degraded mode: mission-essential lots only with narrowed environmental certification and dual-review pedigree validation.
- Preferred protocol profiles: signed material-cert manifests, `API/JSON`, `USMTF`, and `OPC UA`.
- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md` as the baseline for building a provisional packet for this domain.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, optical pedigree, or coating-cert confidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag counterfeit, coating-defect, cross-program diversion, and strategic readiness risks before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
