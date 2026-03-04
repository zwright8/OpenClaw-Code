# Tax Workflows Domain Resource

## Domain Context
Use this reference when implementing workflows touching tax workflows systems.

## Domain Workflow Focus
- Identify source-of-truth systems and critical entities.
- Map data contracts, IDs, and reconciliation rules.
- Prioritize safe, reversible changes.

## Access + Controls
- Confirm role and scope boundaries for tax workflows APIs/tools.
- Enforce redaction for credentials, tokens, and personal data.
- Use auditable execution logs and immutable evidence when feasible.

## Validation Signals
- Data completeness and schema conformance
- Error budgets and retry limits
- Post-change verification against expected outcomes
