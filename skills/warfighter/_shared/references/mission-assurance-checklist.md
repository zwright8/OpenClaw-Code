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

## 4) Risk and Branch Planning

- Identify top mission risks, likelihood, impact, and mitigations.
- Define branch/sequel triggers with objective thresholds.
- Note assumptions that would invalidate the recommendation.

## 5) Human Review and Handoff

- Provide a concise commander summary and a staff execution task list.
- Include provenance: source systems, pull time, confidence, and known gaps.
- End with explicit decision points: decide now, monitor, pre-delegate.

## Required Output Footer (append to products)

- `Sources:`
- `Protocols/Formats:`
- `Last refresh (UTC):`
- `Confidence:`
- `Known gaps:`
- `Classification/Handling:`
