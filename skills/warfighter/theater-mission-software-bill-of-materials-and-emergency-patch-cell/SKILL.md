---
name: theater-mission-software-bill-of-materials-and-emergency-patch-cell
description: Govern emergency mission-system patching with SBOM evidence, exploit triage, and rollback controls. Use when warfighters need fast software remediation without breaking mission assurance.
---

# Theater Mission Software Bill Of Materials And Emergency Patch Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm affected mission systems, exploit urgency, rollback authority, and allowed maintenance windows before producing recommendations.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Workflow

1. Frame the vulnerable mission thread, affected software components, exploit evidence, and commander risk tolerance.
2. Build patch-now, isolate, defer, rollback, and compensating-control branches with explicit mission and cyber tradeoffs.
3. Bind each recommendation to SBOM, vulnerability, CI/CD, and deployment-governance tools plus protocolized outputs.
4. Publish degraded-mode branches when artifact trust, test evidence, or field deployment acknowledgments fall below threshold.

## Required Output Format

1. Situation snapshot.
2. Recommended patch-governance branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Mission SBOM patch packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: emergency patch decision board, component-exposure ledger, and rollback authorization ladder.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-mission-sbom-emergency-patch-v1` with `protocol_stack_id=ps-theater-mission-sbom-emergency-patch-stack-v1`.
- Alternate: mission software factory queue plus manual vulnerability adjudication board.
- Degraded: isolate-and-monitor posture with commander-approved rollback-only actions.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-MISSION-SBOM-EMERGENCY-PATCH-001` for critical recommendations.
- Prioritize these protocol families for this domain: `CycloneDX/SPDX`, `STIX/TAXII`, signed deployment manifests, `API/JSON`, and `USMTF`.
- Include source system, refresh UTC, confidence, exploit exposure, and unresolved validation gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run assurance checks from `../_shared/references/us-joint-protocol-assurance-drill.md`, `../_shared/references/mission-assurance-checklist.md`, and `../_shared/references/tool-health-and-trust-monitoring.md`.
- If artifact provenance, test evidence, or rollout authority is uncertain, downgrade to advisory-only and require human command review.

## Guardrails

- Do not fabricate exploit confirmation, patch validation, or deployment completion.
- Separate confirmed vulnerable components from hypothesized blast radius.
- Prefer rollback or isolation when patch confidence is insufficient for life-safety or fires-linked systems.
