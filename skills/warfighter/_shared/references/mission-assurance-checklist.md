# Mission Assurance Checklist (Warfighter Skills)

Use this checklist before delivering any mission recommendation.

## 1) Command Intent and Authority

- Confirm mission objective, commander's intent, and desired effects.
- Confirm echelon, supported/supporting relationships, and decision authority.
- Confirm legal and policy boundaries (ROE, LOAC, domestic authorities where applicable).
- Confirm release authority and releasability constraints for coalition/interagency dissemination.

## 2) Data Integrity and Timeliness

- Verify source systems and data freshness (UTC timestamp on each critical input).
- Validate geospatial, unit, and track identifiers for consistency.
- Mark stale, conflicting, or low-confidence data explicitly.
- For AI-generated analysis, include model-assist caveat and require human review before execution.
- Validate that recommendations are traceable to cited source inputs (no source-free claims).
- Confirm any automated fusion output includes source confidence/latency and conflict-resolution rule used.

## 3) Interoperability and Protocol Compliance

- Select message format required by the receiving unit (for example `USMTF`, `VMF`, `Link 16 J-series`, `CoT`, `STIX/TAXII`, `OGC`).
- Verify schema completeness and mandatory field population.
- Confirm transport path and fallback path if primary comms are degraded.
- Select and document `Primary`, `Alternate`, and `Degraded` domain toolchain profiles with rationale.
- Confirm coalition packets include translation assumptions and known field-loss risks.

## 4) Tool Invocation Packet Completeness

- For each critical tool dependency, include objective, required inputs, query/action template, and expected output schema.
- Confirm protocol/transport is explicit for each dependency and maps to the receiving system.
- Document manual fallback procedures and expected mission impact if integration is unavailable.
- Confirm `Primary`, `Alternate`, and `Degraded` profile triggers are objective and time-bound.
- Confirm each packet has UTC refresh timestamp, owner, and revalidation trigger.

## 5) Risk and Branch Planning

- Identify top mission risks, likelihood, impact, and mitigations.
- Define branch/sequel triggers with objective thresholds.
- Note assumptions that would invalidate the recommendation.
- For cross-domain options, document second-order effects (civil, alliance, logistics, legal, and information environment) and who owns each mitigation.
- Include one explicit "stop-condition" trigger that forces immediate human revalidation if conditions shift.

## 6) Human Review and Handoff

- Provide a concise commander summary and a staff execution task list.
- Include provenance: source systems, pull time, confidence, and known gaps.
- End with explicit decision points: decide now, monitor, pre-delegate.
- Include a no-go criterion list that pauses execution when authority, legality, or data integrity is uncertain.
- Explicitly state that recommendations are decision support and require authorized human approval for execution.

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
- `No-go criteria hit (Y/N):`
- `Second-order effects tracked (Y/N):`
- `Stop-condition trigger defined (Y/N):`
