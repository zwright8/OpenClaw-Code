# Tool Skill Baseline

## Intent
This baseline defines execution quality for all generated tool skills.

## Required Execution Pattern
1. Clarify objective, constraints, and expected outputs.
2. Verify authentication and authorization scope before any write operation.
3. Start with read-only inspection or dry-run where available.
4. Execute minimally scoped write operations with explicit change boundaries.
5. Validate side effects using objective checks.
6. Emit structured result artifacts and follow-up actions.

## Validation Checklist
- Inputs validated
- Permissions confirmed
- Dry-run or preflight recorded
- Post-change verification completed
- Sensitive data redacted in logs
- Rollback or recovery path documented

## Safety Guardrails
- Extension layer only: do not duplicate OpenClaw core utilities.
- Use least privilege and temporary credentials where possible.
- Capture evidence for auditability and reproducibility.
