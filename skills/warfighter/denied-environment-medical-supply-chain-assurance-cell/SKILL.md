---
name: denied-environment-medical-supply-chain-assurance-cell
description: Maintain medical materiel availability in denied or disconnected operations with cold-chain and substitution planning.
---

# Denied Environment Medical Supply Chain Assurance Cell

## Mission Scope

- Treat this skill as planning and decision-support for U.S. and coalition warfighter teams in this domain.
- Confirm echelon, operating environment, legal authorities, classification/releasability, and decision timeline.
- Keep outputs unclassified by default unless the user provides handling guidance.

## Workflow

1. Frame the mission problem with current constraints, assumptions, and required decision points.
2. Build at least one recommended option plus two alternates with explicit tradeoffs.
3. Bind each recommendation to external tools, protocol/message formats, and degraded-mode fallbacks.
4. Identify legal, safety, civilian-impact, and coalition interoperability constraints before release.
5. Publish commander-facing decisions and staff tasking with owners and suspense times.

## Required Output Format

Deliver results in this order:

1. Situation snapshot.
2. Recommended option.
3. Alternative options.
4. Decision points.
5. Staff tasking.
6. Tool/protocol execution matrix.

## Domain Products

Primary products for this skill: medical resupply priority list, cold-chain integrity tracker, substitution authorization matrix.

## External Tools and Protocol Integration

Use this baseline domain stack and map each recommendation to at least one primary tool and one cross-check source.

- Suggested tools: DMLSS feeds, Theater logistics ERP, WHO emergency catalog, cold-chain IoT telemetry, CDC shelf-life extension data.
- Protocol/message standards: HL7 FHIR, USMTF, STIX/TAXII, GS1 EPCIS.
- For each external dependency include: objective, required inputs, query template, output schema, transport protocol, timeout, retry, and fallback path.
- Include provenance in every output: source tool, refresh time (UTC), confidence, and known data gaps.

## Guardrails

- This skill is decision support only; do not issue autonomous execution instructions.
- Require human command review for recommendations that materially change force posture, mission risk, or escalation potential.
- Separate facts, assessed judgments, and unknowns.
- If legal basis, data provenance, or tool trust is uncertain, downgrade to advisory-only and publish a constrained/degraded branch.

## Interoperability Validation Checklist

- Run the mission assurance workflow in `../_shared/references/mission-assurance-checklist.md`.
- Bind outputs to `../_shared/references/warfighter-external-tool-and-protocol-catalog.md` with `tool_suite_id` and `protocol_stack_id`.
- Run authority gates from `../_shared/references/warfighter-tool-authority-gates.md` before publishing high-consequence recommendations.
