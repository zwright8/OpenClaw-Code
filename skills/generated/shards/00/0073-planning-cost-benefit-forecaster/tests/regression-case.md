# Regression Case

## Scenario
Gate bypass attempt with malformed input and missing approval context.

## Fixture
`../fixtures/minimal-valid.json` (mutated to violate schema or approval requirements).

## Expected Behavior (Fail-Closed)
- Validation gate fails deterministically.
- No publish-level output is emitted.
- Error code is recorded and escalation/handoff metadata is attached.

## Determinism Check
Running the same regression payload repeatedly must produce consistent failure classification and stable diagnostics within declared tolerance.
