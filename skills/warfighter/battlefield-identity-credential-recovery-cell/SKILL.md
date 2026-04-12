---
name: battlefield-identity-credential-recovery-cell
description: Recover and reassert trusted digital identity after credential compromise in contested operations. Use when units face identity theft, credential replay, or degraded trust in access control systems.
---

# Battlefield Identity Credential Recovery Cell

## Problem Statement

Credential compromise can lock operators out of mission-essential systems, leave stale trust assertions active across federated relying parties, and force manual workarounds that hide audit gaps. This skill exists to restore trustworthy access, reissue credentials safely, and keep lawful support operations moving without bypassing identity proofing, MFA, or human approval gates.

## Allowed Use Boundaries

- Use this skill for cyber defense, access continuity, credential revocation, reissue planning, and audit-ready trust restoration.
- Use it to support lawful noncombat operations such as personnel accountability, logistics access, medical or maintenance system recovery, and cross-domain staff coordination.
- Do not use it to regain unauthorized access, disable protective controls for convenience, impersonate users, evade monitoring, or enable offensive cyber or combat action.
- If the requested outcome depends on breaking policy, suppressing audit trails, or bypassing identity proofing or MFA without an approved emergency procedure, stop and escalate for human decision.

## Mission Scope

- Treat this skill as a planning and decision-support aid for U.S. warfighter mission-support teams restoring trusted access after credential loss, theft, replay, revocation, or federation drift.
- Start by confirming mission-support scope, affected operators or service accounts, operating environment, available authorities, time horizon, and required decision points.
- Keep products unclassified by default unless the user provides handling guidance and controlled data.

## Required Inputs

Confirm these inputs before recommending a recovery path:

- affected identities: user, service, device, or federation account list with owning unit or system
- compromise details: suspected theft, replay, phishing, insider misuse, lost token, expired cert, or revocation trigger
- authoritative identity systems: credential service provider, IdP, PKI, federation broker, and relying-party inventory
- current assurance posture: identity proofing status, MFA method availability, revocation authority, and emergency-access policy
- mission dependency map: systems the identity unlocks, outage tolerance, manual fallback availability, and latest acceptable restoration time
- evidence freshness: source system timestamps in UTC, last successful login or assertion time, current session status, and known telemetry gaps
- approval chain: legal basis, approving role, audit record ID, and any coalition or host-nation constraints

## Workflow

1. Frame the recovery problem using the required inputs, identity assurance gaps, and the specific mission functions blocked by the compromise.
2. Determine the recommended sequence for containment, revocation, re-proofing, reissue, federation propagation, and session cleanup, plus at least two alternatives with explicit tradeoffs.
3. Bind each critical step to concrete external tools, protocol paths, authority checks, and UTC freshness requirements.
4. Validate that revocation and reissue decisions propagate to relying parties, anomaly telemetry, and manual continuity boards before recommending restoration of normal access.
5. Publish commander-facing output and a staff-action tracker with owners, suspense, validation gates, and revalidation triggers.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended recovery option.
3. Alternative options and degraded branch.
4. Decision points and approval authorities.
5. Staff tasking and suspense dates.
6. Tool invocation packets and validation status.

## Domain Products

Primary products for this skill: credential compromise recovery plan, trust re-establishment ladder, identity revocation and reissue matrix.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-battlefield-identity-credential-recovery-v1` with `protocol_stack_id=ps-battlefield-identity-credential-recovery-stack-v1`.
- Alternate: select an independently administered trust-audit or identity-proofing suite from `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` and explain why it is a stronger cross-check.
- Degraded: mission-essential allowlist operations with manual dual-control identity checks, signed exception log, and explicit revalidation deadline.

## Domain Packet Defaults

- Default packet ID: `DPL-BATTLEFIELD-IDENTITY-CREDENTIAL-RECOVERY-001`.
- If no packet matches mission conditions, create a provisional packet using the shared schema and assign `validation_owner` plus `revalidation_utc`.

## External Tools and Protocol Integration

- Apply the Core Integration Protocol in `../_shared/references/external-tools-protocols.md` as an explicit sequence.
- Use scenario packet guidance in `../_shared/references/domain-tool-packet-library.md` and include packet mappings.
- Use profile guidance in `../_shared/references/joint-operations-external-toolchain-profiles.md` and include degraded-mode triggers.
- Use catalog bindings in `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` with a concrete tool and protocol stack.
- Prefer these tool families for this domain: credential lifecycle manager, revocation status broker, access anomaly analytics, federation assertion audit ledger, and mission access continuity board.
- Prefer these protocol families for this domain: `X.509/PKI`, `OCSP/CRL`, `SCIM` or `API/JSON`, `SAML/OIDC` federation assertions, `STIX/TAXII`, and `USMTF` or `NIEM` for staff coordination packets.
- Include provenance metadata for every tool-driven claim: source system, UTC refresh time, confidence, and known gaps.

## Tool Invocation Contract

For each critical dependency include:

- objective
- required inputs
- query/action template
- expected output schema
- transport protocol
- fallback path and confidence impact

Use this exact tool sequence unless the operator states a justified override:

1. Credential lifecycle manager
   objective: revoke, suspend, or reissue the affected credential
   required inputs: identity ID, credential type, revocation authority, replacement authenticator path
   query/action template: `revoke_or_reissue(identity_id, credential_scope, reason_code, approval_role, audit_record_id)`
   expected output schema: `{identity_id, action, effective_utc, replacement_status, approval_role, audit_record_id}`
   transport protocol: `SCIM` or authenticated `API/JSON`
   fallback path: dual-control manual issuance worksheet with signed UTC acknowledgment
2. Revocation status broker
   objective: confirm revocation propagates across PKI and federation dependencies
   required inputs: certificate serial or token ID, relying-party list, revocation timestamp
   query/action template: `check_revocation(serial_or_token_id, relying_party_scope)`
   expected output schema: `{artifact_id, revocation_state, observed_by, observed_utc, stale_parties[]}`
   transport protocol: `OCSP/CRL` or authenticated `API/JSON`
   fallback path: advisory-only hold on affected systems until manual witness confirms revocation
3. Access anomaly analytics
   objective: scope residual misuse, replay attempts, and orphaned sessions before access restoration
   required inputs: identity ID, time window, source systems, anomaly thresholds
   query/action template: `query_identity_anomalies(identity_id, window_utc, source_scope, threshold_profile)`
   expected output schema: `{identity_id, suspicious_events[], active_sessions[], confidence, last_refresh_utc}`
   transport protocol: `STIX/TAXII` or authenticated `API/JSON`
   fallback path: manual log review with confidence downgrade and wider session kill recommendation
4. Mission access continuity board
   objective: preserve essential support workflows while full trust is being restored
   required inputs: affected mission systems, priority functions, manual fallback owners, revalidation deadline
   query/action template: `publish_continuity_exception(identity_scope, mission_systems, fallback_mode, expires_utc)`
   expected output schema: `{exception_id, systems[], fallback_mode, owner, expires_utc, review_status}`
   transport protocol: `USMTF`, `NIEM`, or signed `API/JSON`
   fallback path: paper or voice continuity roster with UTC call-back verification

## Domain Toolchain Override (2026-03-10, Warfighter Expansion)

- Prioritize `tool_suite_id=ts-battlefield-identity-credential-recovery-v1` + `protocol_stack_id=ps-battlefield-identity-credential-recovery-stack-v1` for this mission set.
- Include `packet_id=DPL-BATTLEFIELD-IDENTITY-CREDENTIAL-RECOVERY-001` for high-consequence recommendations and branch decisions.
- Bind recommendations to `toolchain_profile_id=battlefield-identity-credential-recovery-v1` in joint operations profile selection.

## Validation and Assurance

- Run `../_shared/references/mission-assurance-checklist.md` and `../_shared/references/us-joint-protocol-assurance-drill.md` before release.
- Confirm the recommended path includes identity proofing, authenticator replacement or MFA restoration, revocation propagation, relying-party acknowledgment, and audit-log continuity.
- Cross-check the primary toolchain with an independent trust or anomaly source before clearing a compromised identity for normal use.
- Validate that every product includes `tool_suite_id`, `protocol_stack_id`, `packet_id`, UTC freshness, confidence, approval role, and known gaps.
- If interoperability, approval, or data freshness checks fail, mark the recommendation `advisory_only: true` and publish a degraded branch with explicit operator actions.

## Failure Handling and Degraded Operations

- If identity proofing cannot be completed, hold reissue at advisory-only and route only mission-essential access through dual-control manual checks.
- If revocation status does not propagate to all relying parties, keep affected systems in constrained mode and assign a stale-party cleanup owner with suspense.
- If anomaly telemetry is unavailable or contradictory, widen the session reset scope, downgrade confidence, and require human approval before restoring privileged access.
- If MFA or replacement authenticators are unavailable, recommend time-bounded break-glass access only when an approved emergency policy and audit record already exist.
- If legal basis, approval chain, or coalition acceptance is uncertain, stop at decision support and request human review rather than improvising a workaround.

## Guardrails

- Flag gaps where assumptions exceed evidence.
- Separate facts, assessed judgments, and unknowns.
- Identify legal, policy, privacy, and coalition identity-federation constraints early.
- Do not fabricate authorities, approvals, revocation status, or source provenance.
- Require explicit human command approval for break-glass access, privileged access restoration, or posture changes that widen trust.
- Do not recommend disabling MFA, suppressing logs, or bypassing identity proofing except under a documented emergency policy with audit traceability.
