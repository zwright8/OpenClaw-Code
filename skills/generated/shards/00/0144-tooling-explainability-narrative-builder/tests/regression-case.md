# Regression Case: Highest-Risk Failure Mode

- Skill: `u0144-tooling-explainability-narrative-builder`
- Failure mode under test: `E_NON_DETERMINISM`
- Trigger: replay identical input payloads and force score/rank variance above tolerance.
- Expected result: validation gate `determinism-check` fails closed; publish-level outputs blocked; incident raised; human sign-off required for any override.
