# Regression Case

## Scenario
Alert monitor with stale signals and a duplicate storm caused by an unreviewed threshold change.

## Fixture
`../fixtures/minimal-valid.json` (mutated to violate auth, contract, or approval requirements).

## Mutation
Age the signals beyond the freshness window and lower thresholds below the approved baseline.

## Expected Behavior (Fail-Closed)
- Credential or contract validation fails deterministically.
- No publish-level or mutating output is emitted without the required approval state.
- The run records a stable error classification and attaches rollback or review guidance.

## Determinism Check
Running the same mutated payload repeatedly must produce the same failure class, same blocked gate, and stable diagnostics within declared tolerance.
