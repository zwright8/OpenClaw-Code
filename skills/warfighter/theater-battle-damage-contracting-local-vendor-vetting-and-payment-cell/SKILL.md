---
name: theater-battle-damage-contracting-local-vendor-vetting-and-payment-cell
description: Accelerate battle-damage recovery through local vendor vetting, emergency contracting, and payment integrity controls. Use when mission restoration depends on local labor or materiel under high fraud, corruption, or insider-risk pressure.
---

# Theater Battle-Damage Contracting Local Vendor Vetting And Payment Cell

## Mission Scope

- Treat this skill as an advisory planning and decision-support aid for U.S. warfighter missions in its domain.
- Confirm contracting authorities, emergency acquisition thresholds, local vendor pools, payment channels, and commander decision timelines before producing recommendations.
- Keep outputs advisory-only by default and require explicit human command approval before recommending branches that materially change vendor access or payment controls.

## Workflow

1. Frame the battle-damage repair demand, contracting bottlenecks, and local-market risks most exposed to fraud, coercion, or delay.
2. Build primary and alternate vet, award, pay, and deny branches with explicit tradeoffs in speed, trust, force protection, and local legitimacy.
3. Bind each recommendation to concrete vendor-risk, payment-integrity, and repair-priority tools plus packetized outputs.
4. Run authority, vetting, and reconciliation checks before publishing commander-facing recommendations.

## Required Output Format

1. Situation snapshot.
2. Recommended contracting branch and rationale.
3. Alternative branches with trigger conditions.
4. Decision points now/next/pre-delegated.
5. Staff tasking by owner and suspense.
6. Contracting packet, protocol bindings, and confidence notes.

## Domain Products

Primary products for this skill: emergency local-vendor release board, payment-integrity ledger, and battle-damage contracting branch plan.

## Domain Toolchain Defaults

- Primary: `tool_suite_id=ts-theater-battle-damage-contracting-vendor-vetting-payment-v1` with `protocol_stack_id=ps-theater-battle-damage-contracting-vendor-vetting-payment-stack-v1`.
- Alternate: manual vendor board plus cash-control worksheet and repair-priority matrix.
- Degraded: mission-essential awards only with dual-control payment release and daily fraud review.

## External Tools and Protocol Integration

- Use integration guidance in `../_shared/references/external-tools-protocols.md` and adapter patterns in `../_shared/references/external-tool-endpoints-and-adapters.md`.
- Include `packet_id=DPL-BATTLE-DAMAGE-CONTRACTING-VENDOR-001` for critical recommendations.
- Prioritize these protocol families for this domain: signed vendor manifests, `STIX/TAXII`, `NIEM`, `API/JSON`, `USMTF`, and `S/MIME`.
- Include source system, refresh UTC, confidence, vetting status, and unresolved payment or insider-risk gaps in each recommendation.

## Authority and Assurance Gates

- Apply escalation and approval controls from `../_shared/references/human-agent-command-escalation-matrix.md` and `../_shared/references/warfighter-tool-authority-gates.md`.
- Run cross-source validation from `../_shared/references/mission-assurance-checklist.md`.
- If vendor trust, payment custody, or acquisition authority is uncertain, downgrade to advisory-only and assign closure actions.

## Guardrails

- Do not fabricate vendor vetting, anti-corruption findings, or contracting authority.
- Separate observed vendor facts from inferred loyalty or insider intent.
- Surface host-nation, anti-corruption, and force-protection effects of rapid local contracting early.
