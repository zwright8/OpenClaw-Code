---
name: joint-denied-sar-beacon-authentication-and-recovery-cell
description: Authenticate search-and-rescue beacons and coordinate recovery in denied communications environments. Use when spoofing, jamming, or signal ambiguity threatens personnel recovery timelines.
---

# Joint Denied SAR Beacon Authentication and Recovery Cell

## Mission Scope

- Treat this skill as planning and decision support for U.S. warfighter operations.
- Confirm recovery authority, authentication rules, and time-critical decision thresholds.
- Keep outputs advisory; execution requires authorized command approval.

## Workflow

1. Build beacon signal confidence from independent sources and track history.
2. Prioritize recovery options by survivability window, authentication confidence, and access risk.
3. Define communication fallback branches for denied or intermittent links.
4. Publish recovery decision package with required human approvals.

## Required Output Format

1. Situation snapshot.
2. Recommended authentication/recovery branch.
3. Alternate/degraded branches.
4. Decision gates and command roles.
5. Staff tasks and suspense.

## Domain Products

Primary products: beacon authenticity ledger, recovery corridor options matrix, denied-comms handoff packet.

## External Tools and Protocol Integration

- Use `../_shared/references/external-tools-protocols.md` and `../_shared/references/tool-protocol-playbooks.md`.
- Apply command escalation controls from `../_shared/references/human-agent-command-escalation-matrix.md`.
- Bind suite/stack selections to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md`.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-intel-fusion-v1` with `protocol_stack_id=ps-joint-tactical-link-stack-v1`.
- Alternate: `tool_suite_id=ts-medical-force-health-v1` with `protocol_stack_id=ps-medical-readiness-stack-v1`.
- Degraded: authenticated voice challenge/response + UTC confirmation chain.

## Guardrails

- Do not treat unverified beacon traffic as confirmed survivor location.
- Flag all identity confidence gaps before recommending asset commitment.
- If confidence is insufficient, publish constrained `GO-WITH-CONSTRAINTS` or `NO-GO`.
