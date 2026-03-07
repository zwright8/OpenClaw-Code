# Domain Toolchain Profiles (Warfighter)

Select a profile in every skill output and justify the choice.

## Profile Structure

- Primary: preferred system-of-record stack for current mission phase.
- Alternate: validated backup stack when primary links or systems degrade.
- Degraded: minimum viable manual or low-bandwidth workflow with expected time and confidence penalty.

## Mission Domain Profile Starters

- Joint fires and targeting: AFATDS, JADOCS, ATO/airspace tools; protocols `VMF`, `USMTF`, `Link 16 J-series`.
- Air defense and missile warning: IAMD C2, radar track fusion, warning dissemination; protocols `Link 16`, `USMTF`, `CoT`.
- Maritime and littoral control: fleet COP, AIS/NMEA, mine/ASW mission tools; protocols `AIS/NMEA`, `Link 16`, `USMTF`.
- Space and SATCOM resilience: SDA catalogs, SATCOM planners, spectrum managers; protocols `API/JSON`, `USMTF`, `Link 16` where available.
- Cyber defense and CEMA: SIEM/SOAR, endpoint telemetry, threat intel exchange; protocols `STIX/TAXII`, `API/JSON`.
- Logistics and mobility: GCSS variants, movement planners, maintenance and fuel systems; protocols `USMTF`, `XML/JSON`, secure APIs.
- Medical movement and force health: patient regulation, med logistics, CASEVAC tracking; protocols `USMTF`, `HL7/FHIR`, `API/JSON`.
- Coalition/interagency planning: coalition COP and disclosure workflows; protocols `NATO APP-11/ADatP-3`, `OGC`, releasable message sets.

## Output Requirement

Always include a one-line profile declaration:

`toolchain_profile: primary=<stack>; alternate=<stack>; degraded=<stack>; confidence_impact=<low|medium|high>`
