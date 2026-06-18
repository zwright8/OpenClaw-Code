# Hermes Agent

Hermes is the OpenClaw warfighter-skill dispatch profile. It does not copy skill
content into the agent; it loads the current `skills/warfighter/*/SKILL.md`
corpus at build time and records the resolved loadout in
`agents/hermes/warfighter-skills.manifest.json`.

Build the manifest:

```bash
npm run agent:hermes:build
```

Validate the current corpus without writing the manifest:

```bash
npm run agent:hermes:validate
```

Hermes is advisory-only. The profile keeps outputs unclassified by default,
requires provenance and confidence, and routes high-consequence or authority
changing recommendations through human review before action.
