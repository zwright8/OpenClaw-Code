---
name: coalition-hostage-crisis-intelligence-fusion-and-negotiation-cell
description: Fuse intelligence, legal constraints, and negotiation options for coalition hostage crises. Use when commanders and diplomats require synchronized decision support under severe time pressure and uncertainty.
---

# Coalition Hostage Crisis Intelligence Fusion and Negotiation Cell

## Mission Scope

- Provide decision support for coalition hostage crisis operations.
- Confirm lead authority, legal constraints, proof-of-life criteria, and partner releasability limits.
- Separate verified intelligence from assumptions and deception indicators.

## Workflow

1. Build a unified incident timeline and actor map.
2. Correlate proof-of-life, location, network, and intent indicators.
3. Recommend one negotiation/pressure strategy with two alternates.
4. Identify rescue-feasibility dependencies and escalation triggers.
5. Publish command and interagency tasking.

## Required Output Format

1. Incident snapshot.
2. Recommended strategy.
3. Alternative strategies.
4. Decision gates and escalation triggers.
5. Staff/interagency tasking.
6. Tool/protocol execution matrix.

## External Tools and Protocol Integration

- Suggested tools: all-source intel fusion systems, biometric matching, intercept summaries, diplomatic reporting, open-source media analytics.
- Protocol/message bindings: STIX/TAXII exchange, NIEM schemas, USMTF coordination messages, JSON/REST.
- Include objective, required inputs, schema, timeout/retry, and degraded fallback.

## Guardrails

- Do not output autonomous lethal or coercive action instructions.
- Require human command/legal approval for recommendations that alter escalation posture.
- If proof-of-life or attribution confidence is weak, publish advisory-only options.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-hostage-crisis-fusion-v1` with `protocol_stack_id=ps-intel-negotiation-coordination-stack-v1`.
- Alternate: `tool_suite_id=ts-coalition-crisis-response-v1` with `protocol_stack_id=ps-stix-niem-usmtf-stack-v1`.
- Degraded: manual incident timeline and deception cross-check.

## Interoperability Validation Checklist

- Run `../_shared/references/mission-assurance-checklist.md`.
- Bind profile IDs with `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.
- Apply `../_shared/references/warfighter-tool-authority-gates.md` before release.
