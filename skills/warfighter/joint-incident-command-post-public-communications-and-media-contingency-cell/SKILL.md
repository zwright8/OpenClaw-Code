---
name: joint-incident-command-post-public-communications-and-media-contingency-cell
description: Synchronize incident-command-post messaging, public warning, and media-contingency actions during major military or civil shocks. Use when commanders need auditable public-communications branches with explicit tool and protocol bindings.
---

# Joint Incident Command Post Public Communications And Media Contingency Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter public-communications, public-warning, and incident-disclosure decisions.
- Confirm release authority, incident severity, affected audiences, operational-security constraints, and notification timelines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the problem using incident facts, public-warning posture, media pressure, adversary narrative indicators, and commander intent.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in speed, credibility, OPSEC, and escalation risk.
3. Identify branch triggers for warning release, holding statement transition, rumor rebuttal, and coordinated partner messaging.
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

Primary products: incident message matrix, public-warning release ladder, and media-contingency branch card.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-joint-incident-command-post-public-communications-media-contingency-v1` with `protocol_stack_id=ps-joint-incident-command-post-public-communications-media-contingency-stack-v1`.
- Alternate: select a mission-adjacent public-affairs, warning, or information-integrity suite or stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: commander-approved holding statement, manual warning call tree, and no external release beyond essential life-safety messaging.

## Domain Packet Defaults

- Default packet ID: `DPL-ICP-PUBLIC-COMMS-CONTINGENCY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: message-approval board, public-warning gateway, media query tracker, and adversary-narrative monitor.
- Preferred protocol profiles for coordination and machine exchange: `CAP`, `NIEM`, `S/MIME`, `API/JSON`, `STIX/TAXII`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If notification status, release authority, or narrative provenance is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag family-notification conflicts, public-panic risk, adversary amplification, and OPSEC compromise before recommending action.
- Do not fabricate incident facts, media posture, or release approvals.
