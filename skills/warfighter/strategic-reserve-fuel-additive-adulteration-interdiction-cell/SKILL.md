---
name: strategic-reserve-fuel-additive-adulteration-interdiction-cell
description: Detect and interdict adulterated fuel additives and blend components before they degrade U.S. warfighter readiness. Use when strategic fuel reserves, expeditionary aviation fuel, or bulk-ground sustainment depend on trusted additive pedigree.
---

# Strategic Reserve Fuel Additive Adulteration Interdiction Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm fuel authorities, additive pedigree requirements, contamination thresholds, and release timelines before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the additive supply chain, blend requirements, contamination indicators, and affected weapon-system demand.
2. Build one recommended interdiction branch plus alternatives to quarantine, dilute, reroute, or substitute supply.
3. Bind each recommendation to fuel-quality, pedigree, and release-control tools with explicit protocolized outputs.
4. Publish degraded-mode branches when laboratory confirmation, supplier custody, or transport integrity falls below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended interdiction branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now, next, and pre-delegated.
5. Staff tasking by owner and suspense.
6. Fuel-additive interdiction packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: additive pedigree ledger, contamination branch matrix, fuel-release decision ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-strategic-fuel-additive-adulteration-interdiction-v1` with `protocol_stack_id=ps-strategic-fuel-additive-adulteration-interdiction-stack-v1`.
- Alternate: bulk-fuel quality board plus supplier-custody anomaly tracker.
- Degraded: mission-essential fuel lots only with commander-approved manual release and dual-sample confirmation.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-FUEL-ADDITIVE-ADULTERATION-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed material-cert manifests, `API/JSON`, `USMTF`, and `NIEM`.
- Include source system, refresh UTC, confidence, lot identifiers, and unresolved contamination or substitution gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md` and `../_shared/references/mission-assurance-checklist.md`.
- If lab evidence, supplier custody, or release authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate additive chemistry, lab results, or release authority.
- Separate suspected adulteration from confirmed contamination and from benign formulation variance.
- Flag flight-safety, engine-warranty, and coalition-fuel compatibility constraints early.
