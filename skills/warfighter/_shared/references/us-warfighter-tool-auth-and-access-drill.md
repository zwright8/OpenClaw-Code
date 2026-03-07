# U.S. Warfighter Tool Auth and Access Drill

Use this drill before time-sensitive or high-consequence tool actions.

## Pre-Execution Checks

1. Confirm operator role and mission authority for each system touched.
2. Validate account state (enabled, not expired, correct domain/tenant).
3. Verify required certificate/token/session validity window.
4. Confirm transport path availability (mission network, tactical link, or approved relay).
5. Confirm data handling and releasability constraints before cross-domain exchange.

## Degraded-Mode Trigger

Trigger degraded mode if any critical dependency fails checks above. Include:

- failed_dependency
- expected_delay_minutes
- confidence_penalty
- alternate_transport_or_manual_workaround
- revalidation_owner_and_due_utc

## Output Snippet (required)

Include this block in skill outputs:

- `auth_access_status`: `green|amber|red`
- `critical_dependencies`: list of systems with `status`, `owner`, `last_verified_utc`
- `degraded_mode_required`: `true|false`
- `next_revalidation_utc`
