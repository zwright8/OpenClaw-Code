# Regression Case

## Scenario
Migration rehearsal with an incomplete source inventory and no rollback checkpoint.

## Fixture
`../fixtures/minimal-valid.json` (mutated to violate auth, contract, or approval requirements).

## Mutation
Remove items from the source inventory and strip the rollback checkpoint reference from the fixture.

## Expected Behavior (Fail-Closed)
- Credential or contract validation fails deterministically.
- No publish-level or mutating output is emitted without the required approval state.
- The run records a stable error classification and attaches rollback or review guidance.

## Determinism Check
Running the same mutated payload repeatedly must produce the same failure class, same blocked gate, and stable diagnostics within declared tolerance.
