# Regression Case — u06468-kpi-dashboard-publishing-for-sales-and-client-success

## Objective
Verify deterministic replay and fail-closed gate behavior for `KPI Dashboard Publishing for sales and client success`.

## Procedure
1. Execute twice with `fixtures/minimal-valid.json` and identical runtime configuration.
2. Compare score outputs and artifact hashes.
3. Verify schema, determinism, policy-risk, and approval-high-risk gates.

## Expected Results
- Absolute score delta <= 0.005.
- Artifact hash drift = 0 for identical replay.
- Any gate failure blocks downstream routing and emits an error bundle.
