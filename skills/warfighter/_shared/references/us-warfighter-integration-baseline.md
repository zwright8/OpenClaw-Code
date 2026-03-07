# U.S. Warfighter Integration Baseline

Use this baseline for any skill output that informs American warfighter planning, execution, sustainment, or assessment.

## Required U.S. Mission Context Fields

- theater: geographic combatant command or homeland support region
- echelon: strategic, operational, tactical
- mission_partner_set: U.S.-only, coalition, interagency, host-nation
- handling: classification and releasability caveats
- authority_chain: approval authority and delegation boundaries
- latency_budget: acceptable delay for mission-critical updates

## Approved Network and Data Path Baseline

- Prefer system-of-record pulls on approved NIPR/SIPR/JWICS or accredited mission enclaves.
- Do not assume cross-domain transfer is available; declare guard, diode, or manual release path.
- For degraded operations, define PACE comms (primary, alternate, contingency, emergency).

## U.S. Joint Data and Message Standards

- Use USMTF for formal operational reports and orders where required.
- Use Link 16 J-series, VMF, and CoT for tactical dissemination when supported.
- Use STIX/TAXII for cyber indicator exchange and machine-to-machine threat sharing.
- Use OGC for geospatial overlays and shared map layers.
- Use HL7/FHIR for medical status and patient movement interoperability where available.

## External Tool Protocol Expectations

1. Name primary system, cross-check source, and fallback source.
2. Include API/query template and expected response schema.
3. Record source freshness (UTC) and confidence.
4. Bind each output to a command decision point.
5. Publish degraded-mode fallback with time and confidence penalty.

## U.S.-Specific Tool Families (Non-Exhaustive)

- Command and control: GCCS-J, CPOF, JADOCS, JBC-P
- Air and missile defense: IBCS, FAAD C2, C2BMC
- Air operations: TBMCS, TAIS, ATO/ACO planning systems
- Intelligence fusion: DCGS variants, GEOINT exploitation suites
- Fires and targeting: AFATDS and joint fires coordination systems
- Logistics and sustainment: GCSS variants and movement control systems
- Cyber defense: SIEM/SOAR stacks and endpoint telemetry platforms
- Space and PNT: SDA catalogs, SATCOM planners, spectrum monitors
- Medical and CASEVAC: patient regulation and evacuation tracking systems

## Output Compliance Gate

A recommendation is not release-ready unless it includes:

- commander's decision statement
- at least one alternative course of action
- tool invocation packet for critical dependencies
- machine-readable handoff block
- confidence and key assumptions
- branch or sequel trigger conditions
