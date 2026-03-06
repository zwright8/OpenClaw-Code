# Regression Case — Community Feedback Harvesting for mental well-being practices

## Goal
Verify deterministic tolerance enforcement and fail-closed behavior for mental well-being practices.

## Steps
1. Run the workflow twice with `fixtures/minimal-valid.json` unchanged.
2. Compare score outputs and artifact hashes.
3. Re-run with `risk_tier=high` and no sign-off token.

## Expected
- Absolute score delta <= 0.005.
- Artifact hash drift == 0.
- High-risk run without sign-off is blocked (fail closed).
