# Regression Case — u06747-skill-gap-diagnosis-for-civic-participation-platforms

## Objective
Verify deterministic replay and fail-closed gate behavior for `Skill Gap Diagnosis for civic participation platforms`.

## Procedure
1. Execute twice with `fixtures/minimal-valid.json` and identical runtime configuration.
2. Compare score outputs and artifact hashes.
3. Verify schema, determinism, policy-risk, and approval-high-risk gates.

## Expected Results
- Absolute score delta <= 0.005.
- Artifact hash drift = 0 for identical replay.
- Any gate failure blocks downstream routing and emits an error bundle.
