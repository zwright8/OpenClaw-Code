# Regression Case — u06486-kpi-dashboard-publishing-for-education-support-services

## Objective
Verify deterministic replay and fail-closed gate behavior for `KPI Dashboard Publishing for education support services`.

## Procedure
1. Execute twice with `fixtures/minimal-valid.json` and identical runtime configuration.
2. Compare score outputs and artifact hashes.
3. Verify schema, determinism, policy-risk, and approval-high-risk gates.

## Expected Results
- Absolute score delta <= 0.005.
- Artifact hash drift = 0 for identical replay.
- Any gate failure blocks downstream routing and emits an error bundle.
