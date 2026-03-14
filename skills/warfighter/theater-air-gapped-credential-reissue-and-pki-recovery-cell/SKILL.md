---
name: theater-air-gapped-credential-reissue-and-pki-recovery-cell
description: Recover mission identity, certificate trust, and credential issuance inside disconnected or air-gapped theaters for U.S. warfighters. Use when commanders or cyber staffs must reissue credentials after compromise, severed reachback, or emergency trust burn without waiting for enterprise identity services.
---

# Theater Air Gapped Credential Reissue And PKI Recovery Cell

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter missions in this domain.
- Confirm compromise scope, affected enclaves, offline certificate authority status, key custody chain, and mission deadlines before recommending action.
- Keep outputs unclassified by default unless explicit handling guidance is provided.

## Workflow

1. Frame the trust-restoration problem with compromised identities, enclave separation, surviving PKI assets, and minimum mission-access requirements.
2. Build one recommended COA and at least two alternatives with tradeoffs in trust restoration speed, insider risk, interoperability, and operator burden.
3. Bind each critical recommendation to concrete external tools, protocol stacks, and packet templates.
4. Identify decision points for trust burn, credential reissue, enclave admission, and later re-synchronization with enterprise identity services.
5. Publish commander-facing recommendations plus a staff tracker with owner, suspense, confidence, and branch triggers.

## Required Output Format

1. Situation snapshot and trust posture.
2. Recommended COA and rationale.
3. Alternative COAs with trigger conditions.
4. Decision points and approval gates.
5. Staff tasks by owner and suspense.
6. Tool invocation packets with protocol bindings.

## Domain Products

Primary products: credential burn matrix, offline PKI recovery plan, enclave admission ladder, and re-synchronization decision brief.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-air-gapped-credential-reissue-pki-recovery-v1` with `protocol_stack_id=ps-theater-air-gapped-credential-reissue-pki-recovery-stack-v1`.
- Alternate: independent offline CA review board with manual certificate issuance worksheet and trust-chain cross-check.
- Degraded: commander-approved emergency access roster with dual-control issuance, paper custody log, and UTC acknowledgment checks.

## Domain Packet Defaults

- Default packet ID: `DPL-AIR-GAPPED-CREDENTIAL-REISSUE-001`.
- Preferred `toolchain_id=TC-AIRGAPID-130` and `toolchain_profile_id=air-gapped-credential-reissue-pki-recovery-v1`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign a validation owner.

## External Tool Stack And Protocols

- Preferred external toolsets for this domain: offline certificate ledger, credential issuance board, key-material custody tracker, and enclave admission matrix.
- Preferred protocol profiles for coordination and machine exchange: `X.509/PKI`, signed certificate manifests, `S/MIME`, `API/JSON`, and `USMTF`.
- Use `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`, `../_shared/references/domain-tool-packet-library.md`, and `../_shared/references/tool-protocol-playbooks.md`.
- Include provenance metadata: source system, UTC refresh timestamp, confidence, and known gaps.

## Tool Invocation Contract

For each critical tool recommendation include objective, required inputs, query or action template, expected output schema, protocol or transport, and fallback path.

## Mission Tool Authority Gates

- Apply escalation requirements in `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md` for high-consequence recommendations.
- Include `authority_tier`, `decision_impact_level`, `approval_role`, and `audit_record_id` for recommendations that can alter trust boundaries, credential scope, or mission-access posture.
- If authority, key custody, or certificate provenance is uncertain, downgrade to advisory-only and require human command review.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Validate protocol conformance, UTC freshness, key-custody continuity, and enclave admission assumptions.
- If checks fail, provide a degraded trust-restoration branch with explicit access and compromise risk.

## Guardrails

- Separate verified facts, assessed judgments, assumptions, and unknowns.
- Flag insider-risk concerns, lost key custody, certificate revocation ambiguity, and coalition trust-boundary impacts early.
- Require explicit human release for recommendations that expand privileged access or bypass standard authentication controls.
- Do not fabricate sources, approvals, or trust-chain integrity.
