---
name: theater-cloud-credential-burn-and-access-reconstitution-cell
description: Coordinate emergency cloud credential burn, privileged-access containment, and workload recovery for U.S. warfighter mission systems. Use when compromised identities threaten battlefield cloud, edge compute, or software-delivery continuity.
---

# Theater Cloud Credential Burn And Access Reconstitution Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm cyber authorities, enclave ownership, break-glass rules, and decision deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the mission problem with federation scope, compromised identities, workload dependencies, and privileged-role exposure.
2. Build one recommended COA and at least two alternatives with explicit tradeoffs in containment speed, mission continuity, access debt, and rollback risk.
3. Identify branch/sequel triggers, credential-burn thresholds, and command approval gates.
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

Primary products: credential burn ladder, privileged-access reconstitution matrix, and mission-service exception ledger.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-cloud-credential-burn-access-reconstitution-v1` with `protocol_stack_id=ps-theater-cloud-credential-burn-access-reconstitution-stack-v1`.
- Alternate: select a mission-adjacent cyber defense, identity-control, or mission-cloud suite/stack from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain tradeoffs.
- Degraded: commander-approved break-glass access only with dual-control logging, manual privileged-role roster, and UTC revocation witness checks.

## Domain Packet Defaults

- Default packet ID: `DPL-CLOUD-CREDENTIAL-BURN-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack and Protocols

- Preferred external toolsets for this domain: identity emergency control plane, token revocation orchestrator, and workload access recovery board.
- Preferred protocol profiles for coordination and machine exchange: `SCIM`, `OIDC/SAML`, `STIX/TAXII`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query/action template, expected output schema, protocol/transport, and fallback path.

## Mission Tool Authority Gates

- Apply authority and escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for posture-changing actions.
- If authority, legal basis, identity provenance, or workload criticality evidence is uncertain, downgrade to advisory-only and request command decision.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, confidence declaration, and branch-trigger clarity.
- If checks fail, provide a degraded-mode branch with explicit operational risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag least-privilege violations, insider-risk concerns, supply-chain blast radius, and mission-service safety impacts before recommending action.
- Do not fabricate classified sources, authorities, or approvals.
