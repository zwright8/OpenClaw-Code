---
name: theater-cloud-credential-burn-and-access-reconstitution-cell
description: Coordinate emergency credential burn, token revocation, and mission-safe access reconstitution across battlefield cloud and edge systems. Use when federation trust, privileged access, or workload identity has been compromised.
---

# Theater Cloud Credential Burn and Access Reconstitution Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm authority, affected enclaves, credential scope, and mission services that cannot go dark.
- Keep outputs unclassified unless handling guidance is provided.

## Workflow

1. Define the compromise boundary, affected identities, and commander continuity priorities.
2. Pull revocation state, token inventory, privileged-role mappings, and workload dependencies from the selected toolchain.
3. Build primary, alternate, and degraded burn or reissue paths with explicit lockout and restoration triggers.
4. Bind recommendations to approval chains, acknowledgment checks, and follow-on monitoring.

## Required Output Format

1. Situation snapshot.
2. Recommended primary action path.
3. Alternate and degraded paths.
4. Decision points and authorities.
5. Staff tasking and suspense.

## Domain Products

Primary products: credential burn ladder, privileged-access reconstitution matrix, mission-service exception ledger.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Use packet template `DPL-CLOUD-CREDENTIAL-BURN-001` from `../_shared/references/domain-tool-packet-library.md`.
- Bind tool and protocol choices to `ts-theater-cloud-credential-burn-access-reconstitution-v1` from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Prefer `SCIM`, `OIDC/SAML`, `STIX/TAXII`, `API/JSON`, and `USMTF` for machine-to-machine exchanges.

## Guardrails

- Separate observed compromise indicators, assessed blast radius, and unknowns.
- Flag single-provider identity assumptions, incomplete token invalidation, and stale cross-domain trust assertions.
- Keep human approval explicit for privileged-role restoration or emergency access exceptions.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-cloud-credential-burn-access-reconstitution-v1` with `protocol_stack_id=ps-theater-cloud-credential-burn-access-reconstitution-stack-v1`.
- Alternate: `tool_suite_id=ts-cyber-defense-v1` with `protocol_stack_id=ps-identity-access-recovery-stack-v1`.
- Degraded: manual privileged-access roster with dual-control approval and UTC revocation ledger.

## Domain Packet Defaults

- Default packet ID: `DPL-CLOUD-CREDENTIAL-BURN-001`.
- If packet scope mismatches mission constraints, define a provisional packet and assign validation owner and suspense.
