# Joint Protocol Translation and Fallback Matrix

Use this reference when translating or relaying outputs across mixed U.S. joint, coalition, civil, and degraded transport paths.

## Required Translation Flow

1. Capture source message identity: originating system, schema version, classification/handling caveat, and timestamp.
2. Map source fields to target protocol schema using explicit field-level mapping.
3. Preserve critical semantics: unit/echelon, geospatial reference, target/track identity, confidence, and authority status.
4. Validate translation with schema checks and at least one semantic sanity check.
5. Publish a fallback message if target transport is unavailable, including confidence and delay penalty.

## Baseline Protocol Mapping

- USMTF <-> VMF: preserve message precedence, route indicators, and mandatory operational fields.
- USMTF/VMF <-> Link 16 J-series: preserve track identifiers, time quality, and engagement status semantics.
- CoT <-> OGC/API geospatial feeds: preserve coordinates, altitude/depth, time, and platform identity tags.
- STIX/TAXII <-> operational cyber tasking: preserve indicator confidence, validity windows, and attribution caveats.
- AIS/NMEA <-> maritime COP events: preserve vessel identity, course/speed, and source quality metadata.

## Fallback Hierarchy

- Primary: automated adapter-mediated transport with schema-validated payloads.
- Alternate: API relay or gateway service with reduced field set and explicit confidence downgrade.
- Degraded: operator-verified manual template message (voice/chat/form) with mandatory readback.

## Output Block (required)

For each translated dependency, include:

- `source_protocol`
- `target_protocol`
- `adapter_id`
- `schema_version`
- `validation_status`
- `fallback_mode`
- `estimated_delay_minutes`
- `confidence_delta`
