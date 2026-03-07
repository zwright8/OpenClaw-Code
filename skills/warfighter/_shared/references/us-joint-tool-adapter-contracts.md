# U.S. Joint Tool Adapter Contracts

Use this reference when a warfighter skill must specify how an external military/civil support tool is connected, validated, and monitored.

## Adapter Contract Fields (required)

For each integrated tool, publish:

- `adapter_id`: stable identifier (`domain.system.function.v1`)
- `tool_system`: source system name and owning organization
- `operation`: read, write, task, publish, or bidirectional sync
- `protocol`: transport and message standard (`USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`, `AIS/NMEA`, API/JSON)
- `auth_mode`: PKI, token, mTLS, role-based gateway, or air-gapped manual transfer
- `required_inputs`: minimal fields needed to execute
- `response_schema`: critical output fields and data types
- `latency_budget_sec`: max acceptable staleness for decision use
- `fallback_path`: alternate adapter or manual procedure
- `owner_cell`: staff owner responsible for adapter health

## Validation Sequence

1. Confirm authority, mission need, and classification boundaries.
2. Confirm account/credential and transport status (see `us-warfighter-tool-auth-and-access-drill.md`).
3. Validate adapter schema with a dry run using known-good payloads.
4. Check timestamp freshness and geospatial/unit normalization.
5. Run dual-source validation for high-consequence recommendations.
6. Record confidence and degraded-mode penalty before release.

## Health and Degraded Operations

- Track adapter heartbeat, successful call rate, error class, and median latency.
- Trigger degraded mode when latency, failures, or schema drift exceed mission thresholds.
- In degraded mode, publish: manual collection path, estimated delay, and confidence penalty.
- Escalate adapter incidents to owning cell and adjacent affected cells with UTC timestamps.

## Minimum Handoff Block

Every skill output using external tools should include:

- Adapter list (`adapter_id`, status, protocol, last_success_utc)
- Decision dependencies bound to each adapter
- Degraded-mode branch actions when any critical adapter is unavailable
- Required revalidation time and owner before next mission decision window
