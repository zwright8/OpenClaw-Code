# Regression Case

## Scenario
Report generation with stale source data and a template expecting a removed metric.

## Fixture
`../fixtures/minimal-valid.json` (mutated to violate auth, contract, or approval requirements).

## Mutation
Age the source timestamps beyond freshness tolerance and request a missing metric in the template.

## Expected Behavior (Fail-Closed)
- Credential or contract validation fails deterministically.
- No publish-level or mutating output is emitted without the required approval state.
- The run records a stable error classification and attaches rollback or review guidance.

## Determinism Check
Running the same mutated payload repeatedly must produce the same failure class, same blocked gate, and stable diagnostics within declared tolerance.
