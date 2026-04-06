---
name: special-operations-clandestine-resupply-signature-budget-cell
description: Manage the thermal, electromagnetic, acoustic, and civil-pattern signature budget for clandestine special-operations resupply. Use when SOF sustainment depends on staying below adversary detection thresholds.
---

# Special Operations Clandestine Resupply Signature Budget Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm supported force, denial environment, resupply urgency, signature thresholds, and approval authorities.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the resupply requirement, route options, adversary sensing threat, and exposure tolerance.
2. Separate verified demand, signature baselines, local-pattern constraints, and unknowns.
3. Build air, maritime, ground, cache, deception, and delay branches with explicit tradeoffs in signature, speed, and force survivability.
4. Bind each branch to low-signature mission planning, pattern-of-life, weather or tide, and cache-accountability tools.
5. Publish commander decision points, veto triggers, and revalidation windows for signature changes.

## Required Output Format

1. Situation snapshot.
2. Recommended branch and rationale.
3. Alternative branches with triggers.
4. Decision points now, next, and pre-delegated.
5. Staff task tracker with owners and suspense.
6. Signature-budget packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: clandestine resupply signature ledger, exposure-by-phase budget, deception-support matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-sof-clandestine-resupply-signature-budget-v1` with `protocol_stack_id=ps-sof-clandestine-resupply-signature-budget-stack-v1`.
- Alternate: `tool_suite_id=ts-logistics-distribution-v1` with `protocol_stack_id=ps-logistics-signature-masking-stack-v1`.
- Packet default: `packet_id=DPL-SOF-RESUPPLY-SIGNATURE-001`.
- Degraded: human-only low-signature movement card with fixed signature ceilings and no dynamic rerouting.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md`, `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, and `../_shared/references/domain-tool-packet-library.md`.
- Prioritize `CoT`, signed mission manifests, `API/JSON`, low-probability-of-detect comm plans, and `USMTF`.
- Include route exposure, signature estimate, civil-pattern assumptions, and recontact windows in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run `../_shared/references/mission-assurance-checklist.md` before release.
- If exposure models, route custody, or release authority are uncertain, downgrade to advisory-only.

## Guardrails

- Do not fabricate signature margins, human terrain assumptions, or clandestine access approvals.
- Distinguish sustainment necessity from mission convenience when recommending additional exposure.
- Surface collateral, partner, and compromise-recovery implications before recommending deception or cache abandonment.
