# Regression Case — u0168-governance-dependency-dag-planner

## Scenario
Highest-risk path: schema-valid input with near-threshold risk score that requires deterministic re-run and policy gate checks.

## Expected Behavior
1. Execution remains deterministic within <= 0.5%.
2. If variance exceeds tolerance, output is frozen and escalated.
3. Publish-level output is blocked until policy gate passes.
4. High-risk outcomes require human sign-off.
