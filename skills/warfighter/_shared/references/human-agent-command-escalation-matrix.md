# Human-Agent Command Escalation Matrix

Use this reference to enforce clear authority boundaries between AI support agents and human command in U.S. and coalition operations.

## Required Fields in Skill Outputs

- `authority_tier`
- `decision_impact_level`
- `requires_human_approval`
- `approval_role`
- `escalation_trigger`
- `max_action_latency_minutes`
- `audit_record_id`

## Authority Tiers

- `TIER-0 advisory-only`: AI may summarize, analyze, and recommend; no action execution.
- `TIER-1 operator-initiated`: AI may draft machine-ingestible packets; human initiates all external actions.
- `TIER-2 constrained automation`: AI may execute pre-approved low-risk automation with hard guardrails and rollback.
- `TIER-3 prohibited-without-commander`: high-consequence actions always require explicit commander authorization.

## Decision Impact Levels

- `LOW`: administrative or informational impact only.
- `MEDIUM`: affects readiness, allocation, or non-lethal operational posture.
- `HIGH`: affects mission execution windows, coalition commitments, or strategic signaling.
- `CRITICAL`: could materially alter force posture, escalation risk, or life safety.

## Mandatory Escalation Triggers

Escalate to designated human authority immediately when any of these conditions are true:

1. Confidence below mission threshold for a high or critical recommendation.
2. Conflicting sources on target identity, fratricide risk, or legal authority.
3. Tool trust score or data freshness below required SLA.
4. Cross-domain transfer or releasability uncertainty for coalition partners.
5. Any recommendation that changes force posture, strategic messaging, or escalation pathway.

## Output Contract

For every critical recommendation, include:

- selected tier and impact level
- explicit approval role and suspense
- what action is blocked until approval
- rollback/failsafe branch if approval is delayed
- audit chain reference for post-action review

## Audit and Traceability

- Record all recommendation revisions with UTC timestamp and author (human/agent).
- Preserve the final approved packet and all superseded alternatives.
- Attach provenance fields from external tool protocols and command acknowledgment status.

## Degraded Mode

If identity, authority, or acknowledgment integrity is uncertain:

- downgrade to `TIER-0 advisory-only`
- mark recommendation as `provisional`
- publish commander decision prompts and required revalidation actions
