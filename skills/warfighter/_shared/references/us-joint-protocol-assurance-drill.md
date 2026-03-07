# U.S. Joint Protocol Assurance Drill

Use this drill before releasing any recommendation that depends on external tools, message transport, or coalition interoperability.

## Objective

Verify that tool integrations, protocol bindings, identity/crypto controls, and acknowledgment handling are mission-safe before operational use.

## Required Inputs

- Mission context: operation name, echelon, mission phase, releasability constraints
- Toolchain selection: `toolchain_id`, primary/cross-check systems, fallback path
- Message profile: protocol family (for example `USMTF`, `VMF`, `Link 16`, `CoT`, `STIX/TAXII`, `OGC`, `NATO APP-11`)
- Security posture: key/certificate source, auth method, token validity window, logging policy
- SLA/SLO targets: latency ceiling, ack timeout, retry policy, degrade trigger

## Assurance Execution Sequence

1. Confirm mission-to-protocol fit and authority boundaries.
2. Validate endpoint identity and cryptographic trust chain.
3. Execute one dry-run invocation using representative payload fields.
4. Confirm schema conformance and required metadata fields.
5. Verify acknowledgment chain integrity from sender to receiving role.
6. Run cross-check path with an alternate data source/tool.
7. Trigger controlled fault (timeout or stale data) and verify degraded-mode behavior.
8. Record assurance score and release recommendation status.

## Required Output Fields

Publish these fields in every skill output that depends on external tools:

- `assurance_drill_id`: unique drill run identifier
- `interop_score`: numeric 0-100 interoperability score
- `crypto_posture`: `verified`, `degraded`, or `unverified`
- `ack_chain_status`: `complete`, `partial`, or `failed`
- `schema_conformance`: `pass` or `fail`
- `degraded_mode_ready`: `yes` or `no`
- `release_status`: `approved`, `constrained`, or `hold`

## Scoring and Gates

- Interoperability score calculation:
  - protocol fit and authority checks: 20 points
  - identity/crypto verification: 20 points
  - schema conformance: 20 points
  - acknowledgment integrity: 20 points
  - degraded-mode validation: 20 points
- Gate criteria:
  - `approved`: score >= 85 and no failed critical checks
  - `constrained`: score 70-84 or one non-critical check failed
  - `hold`: score < 70 or any critical check failed

## Critical Fail Conditions

Escalate immediately and set `release_status=hold` when any of the following occurs:

- Endpoint identity cannot be verified
- Message signature/hash or integrity checks fail
- Required protocol fields are missing for an operational message
- Acknowledgment cannot be traced to accountable receiving role
- Degraded-mode branch is undefined for a critical dependency

## Commander-Facing Summary Template

- Recommendation status: approved/constrained/hold
- Highest-risk dependency: tool or protocol and why
- Mitigation owner and suspense
- Decision needed: proceed constrained, delay, or reroute

## Operator Packet Template

```yaml
assurance_drill_id: "PD-YYYYMMDD-###"
toolchain_id: "<from domain-toolchain-profiles>"
protocol_profile: "<message/profile id>"
interop_score: 0
crypto_posture: "verified"
ack_chain_status: "complete"
schema_conformance: "pass"
degraded_mode_ready: "yes"
release_status: "approved"
critical_findings: []
remediation_owner: ""
remediation_suspense_utc: ""
```
