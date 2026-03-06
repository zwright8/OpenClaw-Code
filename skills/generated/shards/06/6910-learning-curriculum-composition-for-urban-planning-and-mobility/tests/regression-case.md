# Regression Case — u06910-learning-curriculum-composition-for-urban-planning-and-mobility

## Objective
Verify deterministic replay and fail-closed gate behavior for `Learning Curriculum Composition for urban planning and mobility`.

## Procedure
1. Execute twice with `fixtures/minimal-valid.json` and identical runtime configuration.
2. Compare score outputs and artifact hashes.
3. Verify schema, determinism, policy-risk, and approval-high-risk gates.

## Expected Results
- Absolute score delta <= 0.005.
- Artifact hash drift = 0 for identical replay.
- Any gate failure blocks downstream routing and emits an error bundle.
