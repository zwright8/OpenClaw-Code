# Regression Case

## Scenario
Connector run with stale credentials and a mutation attempt before the read-only probe succeeds.

## Fixture
`../fixtures/minimal-valid.json` (mutated to violate auth, contract, or approval requirements).

## Mutation
Set the auth context to expired and request a write operation without completing auth validation.

## Expected Behavior (Fail-Closed)
- Credential or contract validation fails deterministically.
- No publish-level or mutating output is emitted without the required approval state.
- The run records a stable error classification and attaches rollback or review guidance.

## Determinism Check
Running the same mutated payload repeatedly must produce the same failure class, same blocked gate, and stable diagnostics within declared tolerance.
