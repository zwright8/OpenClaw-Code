# External Tool Endpoints and Adapter Contracts (Warfighter)

Use this reference to standardize how skills define machine-to-machine integration contracts, including API, message bus, and file-drop adapters.

## Adapter Contract Fields (required)

For each tool binding, define:

- Adapter ID: stable name (`domain-system-purpose-v1`)
- Endpoint class: `api`, `message_bus`, `file_exchange`, `tactical_gateway`, or `human_relay`
- AuthN/AuthZ model: credential type, role scope, and approval gate
- Input schema: required keys, unit identifiers, AOI, UTC window, classification tag
- Output schema: required keys and confidence fields used for command decisions
- Retry policy: backoff pattern, max retries, timeout thresholds
- Quality gates: schema validation, freshness checks, conflict detection rule
- Failure mode: degraded profile action, alert owner, and revalidation trigger

## API Adapter Template

```json
{
  "adapter_id": "ops-gccsj-cop-delta-v1",
  "endpoint_class": "api",
  "method": "POST",
  "path": "/cop/delta/query",
  "input_schema": ["aoi", "time_window_utc", "unit_ids", "handling"],
  "output_schema": ["event_id", "unit", "location", "status", "confidence", "source_time_utc"],
  "transport": "HTTPS/mTLS",
  "protocol": "USMTF+JSON",
  "fallback": "manual-watchfloor-report",
  "degraded_latency_minutes": 30
}
```

## Message Bus Adapter Template

```json
{
  "adapter_id": "sensors-ew-emitter-track-v1",
  "endpoint_class": "message_bus",
  "topic": "mission.ew.emitters",
  "key_fields": ["track_id", "emitter_type", "geo", "time_utc"],
  "consumer_sla_seconds": 60,
  "protocol": "JSON over AMQP",
  "fallback": "periodic-batch-pull",
  "degraded_latency_minutes": 20
}
```

## File Exchange Adapter Template

```json
{
  "adapter_id": "coalition-releasable-brief-packet-v1",
  "endpoint_class": "file_exchange",
  "drop_location": "approved-transfer-zone",
  "formats": ["CSV", "USMTF", "PDF"],
  "integrity": "SHA-256 checksum + manifest",
  "protocol": "NATO APP-11 aligned packet",
  "fallback": "manual liaison relay",
  "degraded_latency_minutes": 60
}
```

## Protocol Mapping Guide

- `USMTF`: formal command reporting and standardized military message traffic
- `VMF`: tactical maneuver and fires coordination packets
- `Link 16 J-series`: tactical track and engagement-support messaging
- `CoT`: low-latency event dissemination for COP updates
- `STIX/TAXII`: cyber threat ingest and sharing
- `OGC` services: geospatial feature/tile interoperability
- `AIS/NMEA`: maritime traffic and track exchange
- `HL7/FHIR`: medical data interoperability and patient movement context

## Domain Adapter Recommendations

- Mission command/watchfloor: API + message-bus dual path with USMTF summary fallback
- ISR and targeting: message bus for tracks, API for historical pulls, OGC for map layers
- Cyber defense: STIX/TAXII ingest + API enrichment + USMTF commander summary
- Logistics and movement: API queries plus CSV/USMTF transfer package for disconnected nodes
- Medical and casualty operations: FHIR/HL7 adapter with USMTF medevac report fallback
- Coalition/interagency: releasability filter adapter before any partner-facing transport

## Reliability and Security Rules

1. Never recommend a tool endpoint without a fallback path and degraded latency estimate.
2. Always include schema keys for confidence and source timestamp in output contracts.
3. Require explicit handling caveat and releasability label in every packet.
4. For high-consequence actions, require two-source validation or one authoritative source with confidence threshold.
5. Log adapter selection rationale so staff can audit why a transport path was chosen.
