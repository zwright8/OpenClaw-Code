# Regression Case

## Scenario
Sync replay with a stale destination cursor and an unresolved conflict burst.

## Fixture
`../fixtures/minimal-valid.json` (mutated to violate auth, contract, or approval requirements).

## Mutation
Provide mismatched checkpoints and a conflict policy that permits no automatic merge.

## Expected Behavior (Fail-Closed)
- Credential or contract validation fails deterministically.
- No publish-level or mutating output is emitted without the required approval state.
- The run records a stable error classification and attaches rollback or review guidance.

## Determinism Check
Running the same mutated payload repeatedly must produce the same failure class, same blocked gate, and stable diagnostics within declared tolerance.
