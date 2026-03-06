# Regression Case: u0240-oversight-continuous-improvement-planner

## Goal
Ensure deterministic replay and fail-closed policy behavior.

## Steps
1. Run capability with `fixtures/minimal-valid.json` twice using identical ruleset.
2. Verify score delta <= 0.005 and artifact hash is identical.
3. Inject high-risk flag and confirm pipeline blocks until human approval token is provided.

## Expected
- Replay determinism PASS.
- All validation gates PASS for baseline fixture.
- High-risk execution remains blocked without sign-off (fail closed).
