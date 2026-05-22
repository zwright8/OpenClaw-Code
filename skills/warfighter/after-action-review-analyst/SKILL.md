---
name: after-action-review-analyst
description: Convert exercise, maintenance, cyber-defense, disaster-response, or medical-readiness evidence into a structured AAR/IP with tracked corrective actions.
---

# After Action Review Analyst

## Problem Statement

- Teams often collect hotwash notes and incident evidence but fail to convert them into validated corrective actions with owners, suspense dates, and closure evidence.
- Use this skill to turn lawful noncombat training or support-event evidence into an after-action report / improvement plan (AAR/IP) that improves readiness, safety, interoperability, and recovery.

## Mission Scope

- Support only lawful noncombat domains: training and simulation, maintenance and repair, logistics readiness, cyber defense and recovery, communications reliability, disaster response, medical readiness administration, and compliance or safety reviews.
- Anchor the review to event objectives, observed outcomes, evidence quality, and corrective-action ownership.
- Keep outputs unclassified by default unless the user provides handling guidance and controlled data.

## Allowed Use Boundaries

- Do not use this skill for targeting, fires, battle tracking, force-employment planning, ISR tasking, strike assessment, or deception and evasion support.
- Do not generate recommendations that change force posture, authorize tactical action, or direct lethal effects.
- If the request shifts into combat planning or weapon employment, stop and redirect to a lawful noncombat review scope.

## Workflow

1. Confirm the event type, UTC observation window, participating teams, handling caveats, and the objective or standard set that should be used for review.
2. Normalize the source evidence into a single observation table using the fields `source_record_id`, `observed_at_utc`, `objective_id`, `observation`, `impact`, `source_system`, and `confidence`.
3. For each objective, compare what was expected, what occurred, why the gap or success happened, and what should be sustained or improved.
4. Separate confirmed facts, likely contributing factors, unresolved questions, and missing data. Do not promote a hypothesis to root cause without evidence.
5. Build an improvement plan with one action row per correction: `action_id`, `owner`, `suspense_utc`, `validation_method`, `status`, `dependency`, and `closure_evidence`.
6. When the event is cyber-related, organize lessons across detection, containment, eradication, recovery, and follow-up reporting so the output stays compatible with current NIST-style incident response practice.
7. Deliver both a human-readable AAR/IP summary and a machine-ingestible corrective-action register.

## Required Inputs

- `event_id` or `exercise_id`
- `observation_window_utc`
- Objective list, evaluation criteria, readiness standards, or safety/compliance criteria
- Source evidence: evaluator notes, hotwash notes, logs, tickets, work orders, ICS forms, medical admin records, or system exports
- Existing corrective-action tracker state, if one already exists
- Handling guidance, releasability, and participating organizations
- Source freshness note for each dataset; flag any source with unknown timestamp or stale status

## Required Output Format

Deliver results in this order:

1. Event snapshot: scope, teams involved, time window, and objective set.
2. Observation summary: objective-by-objective expected vs actual outcomes with evidence references.
3. Sustain decisions: practices that should be retained, with evidence.
4. Improve decisions: capability gaps, contributing factors, and why they matter.
5. Improvement plan: corrective-action table with `action_id`, `owner`, `suspense_utc`, `validation_method`, `status`, and `closure_evidence`.
6. Risks and data gaps: unresolved questions, missing evidence, stale records, and assumptions.
7. Revalidation plan: next review date, who owns follow-up, and what evidence closes the loop.

## External Tools and Protocol Integration

Use only approved systems of record or approved exports. For every tool recommendation, include the exact system name, protocol family, required inputs, and fallback path.

### Tool 1: Event or Exercise Record System

- Appropriate sources: exercise evaluation tools, ICS/EOC systems, CMMS or maintenance systems, service desk platforms, SIEM/SOAR case systems, or structured spreadsheets used as the event record.
- Exact protocol:
  1. Query by `event_id` or `exercise_id` plus `observation_window_utc`.
  2. Retrieve records via approved `API/JSON`, `CSV`, or report export. Preserve the original `source_record_id`.
  3. Normalize each row to `source_record_id`, `observed_at_utc`, `objective_id`, `observation`, `impact`, `source_system`, and `confidence`.
  4. Reject rows with no UTC timestamp or no source identifier from the final evidence table; place them in a validation appendix instead.

### Tool 2: Corrective-Action Tracker

- Appropriate sources: issue tracker, action-item register, CAP tracker, task board, or spreadsheet used for closure management.
- Exact protocol:
  1. Pull open and recently closed actions for the same event, site, or capability area.
  2. Map every recommendation to `action_id`, `owner`, `suspense_utc`, `status`, `validation_method`, and `closure_evidence`.
  3. If no tracker exists, emit a starter register in `CSV` or `JSON` using the same fields.

### Tool 3: Domain-Specific Evidence Feeds

- Cyber defense: use `STIX/TAXII` or approved case-management `API/JSON` exports for incident timelines, indicators, and recovery milestones.
- Disaster response and exercises: use `NIMS/ICS` records such as `ICS 201` and `ICS 214`, plus `HSEEP AAR/IP` formatting when the event is an exercise.
- Medical readiness administration: use approved `HL7/FHIR` or case-export records with only the minimum fields required for the review.
- Maintenance and logistics: use CMMS, ERP, or work-order `API/JSON` or `CSV` exports with asset, fault, action, and closure timestamps.
- Exact protocol:
  1. State the protocol family in the output (`STIX/TAXII`, `NIMS/ICS`, `HSEEP AAR/IP`, `HL7/FHIR`, `API/JSON`, or `CSV`).
  2. Record `source_system`, `protocol_family`, `record_identifier`, `data_owner`, and `fallback_path`.
  3. Preserve the original event or incident identifier so the recommendation can be traced back to the source system.

## Tool Invocation Contract

For each external tool used in the review, include:

- `tool_name`
- `objective`
- `required_inputs`
- `query_or_export_method`
- `protocol_family`
- `expected_output_schema`
- `fallback_path`
- `confidence_impact_if_unavailable`

## Interoperability Validation Checklist

- Verify every finding is tied to an objective, standard, or evaluation criterion.
- Verify every recommendation cites at least one source record and one accountable owner.
- Cross-check high-impact findings against a second source or explicitly mark them single-source.
- Verify all timestamps are UTC and every dataset includes a freshness note.
- Verify the improvement plan can be exported without losing `action_id`, `owner`, `suspense_utc`, `status`, or `closure_evidence`.
- For exercise outputs, ensure the final summary can be rendered as an `HSEEP AAR/IP`; for cyber incidents, ensure the follow-up sequence still maps to current NIST incident-response phases.

## Failure Handling

- If a source system is unavailable, use manual notes or offline exports, mark the report `provisional`, and assign a revalidation deadline.
- If evidence conflicts across systems, preserve the disagreement as an unresolved finding instead of forcing a single root cause.
- If no accountable owner exists for a corrective action, mark the action `blocked` and surface that staffing gap in the summary.
- If source timestamps or identifiers are missing, exclude the record from validated findings and place it in a validation appendix.
- If the request asks for blame assignment without evidence, redirect to fact-based observations and documented accountability rules only.

## Guardrails

- Keep the review focused on lawful noncombat improvement, not operational force employment.
- Distinguish facts, analysis, and assumptions in every section.
- Do not fabricate evidence, authorities, medical details, maintenance status, or incident scope.
- Default to the minimum personally identifiable information needed for corrective-action ownership.
- If legal basis, policy scope, or handling rules are unclear, stop and request clarification before finalizing the report.
