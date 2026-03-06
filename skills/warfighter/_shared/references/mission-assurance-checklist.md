# Mission Assurance Checklist (Warfighter Skills)

Use this checklist before delivering any mission recommendation.

## 1) Command Intent and Authority

- Confirm mission objective, commander's intent, and desired effects.
- Confirm echelon, supported/supporting relationships, and decision authority.
- Confirm legal and policy boundaries (ROE, LOAC, domestic authorities where applicable).

## 2) Data Integrity and Timeliness

- Verify source systems and data freshness (UTC timestamp on each critical input).
- Validate geospatial, unit, and track identifiers for consistency.
- Mark stale, conflicting, or low-confidence data explicitly.

## 3) Interoperability and Protocol Compliance

- Select message format required by the receiving unit (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`).
- Verify schema completeness and mandatory field population.
- Confirm transport path and fallback path if primary comms are degraded.
- Select and document `Primary`, `Alternate`, and `Degraded` domain toolchain profiles with rationale.

## 4) Tool Invocation Packet Completeness

- For each critical tool dependency, include objective, required inputs, query/action template, and expected output schema.
- Confirm protocol/transport is explicit for each dependency and maps to the receiving system.
- Document manual fallback procedures and expected mission impact if integration is unavailable.

## 5) Risk and Branch Planning

- Identify top mission risks, likelihood, impact, and mitigations.
- Define branch/sequel triggers with objective thresholds.
- Note assumptions that would invalidate the recommendation.

## 6) Human Review and Handoff

- Provide a concise commander summary and a staff execution task list.
- Include provenance: source systems, pull time, confidence, and known gaps.
- End with explicit decision points: decide now, monitor, pre-delegate.

## Required Output Footer (append to products)

- `Sources:`
- `Tool stack:`
- `Toolchain profile (Primary/Alternate/Degraded):`
- `Protocols/Formats:`
- `Last refresh (UTC):`
- `Confidence:`
- `Known gaps:`
- `Fallback if tool unavailable:`
- `Classification/Handling:`
- `Escalation hooks (trigger/owner/format/fallback):`

## 7) Machine-Readable Handoff Quality

- Validate the handoff block includes: `mission_id`, `decision_window_utc`, `recommendation_id`, `option_rank`, and `confidence`.
- Confirm each staff action has `owner`, `action`, and `due_utc` fields populated.
- Confirm degraded-mode output explicitly states fallback tools, expected delay, and confidence penalty.

## 8) Cross-Domain Escalation Coverage

- Confirm at least two adjacent cells are identified for escalation based on mission risk thresholds.
- Confirm each escalation trigger is measurable and includes an owner plus required report format.
- Confirm each escalation path has a no-fail comms fallback and expected delay annotation.
