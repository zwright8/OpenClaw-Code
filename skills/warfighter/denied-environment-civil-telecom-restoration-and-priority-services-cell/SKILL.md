---
name: denied-environment-civil-telecom-restoration-and-priority-services-cell
description: Plan telecom restoration and priority communications in denied or disaster-affected areas. Use when military and civil responders must reestablish command and emergency services under degraded infrastructure.
---

# Denied Environment Civil Telecom Restoration and Priority Services Cell

## Mission Scope

- Support telecom restoration for military-civil operations in degraded regions.
- Confirm host-nation authorities, emergency-service priorities, and available spectrum/transport paths.
- Align military support with civil telecom governance and legal boundaries.

## Workflow

1. Assess outage topology across core, backhaul, and last-mile segments.
2. Prioritize restoration for life safety, command, and critical infrastructure services.
3. Build one recommended restoration sequence with alternates.
4. Define spectrum, backhaul, power, and cyber-hardening dependencies.
5. Publish restoration tasking and priority-service routing directives.

## Required Output Format

1. Outage and dependency snapshot.
2. Recommended restoration sequence.
3. Alternate sequences.
4. Priority-service decision gates.
5. Joint telecom tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: cell-site telemetry, satcom gateway status, microwave/fiber fault systems, grid outage feeds, cyber sensor dashboards.
- Protocol/message bindings: 3GPP OAM interfaces, BGP/NETCONF telemetry, P25/LMR coordination, USMTF civil support messages, JSON/REST.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Decision support only; do not execute network changes automatically.
- Require telecom authority approval before modifying emergency-priority routing policies.
- If legal authority or service-impact evidence is incomplete, downgrade to advisory-only.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-denied-telecom-restoration-v1` with `protocol_stack_id=ps-telecom-civil-support-stack-v1`.
- Alternate: `tool_suite_id=ts-expeditionary-comms-restoration-v1` with `protocol_stack_id=ps-satcom-backhaul-stack-v1`.
- Degraded: paper/voice outage board with periodic UTC reconciliation.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Bind IDs from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Apply command authority checks from `../_shared/references/warfighter-tool-authority-gates.md`.
