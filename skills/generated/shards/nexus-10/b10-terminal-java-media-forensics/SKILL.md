---
name: b10-terminal-java-media-forensics
description: Use when coordinating terminal-based system operations, Java/runtime components, media extraction pipelines, forensic triage, and repository fleet management.
---

# Terminal system control, Java/runtime stacks, media extraction, and forensics

This skill clusters adjacent tools from ranks **4967-5000** in the top-5000 inventory.

## Tool families in this pack

- Terminal and system control (`wmctrl`, `wifitui`, `khard`, `mr`).
- Java/runtime and language ecosystems (`openj9`, `koka`, `cadence`).
- Media, forensics, and telemetry (`dash-mpd-cli`, `ccextractor`, `chainsaw`, `gnmic`, `sloccount`).

## What this skill provides

- Domain catalog: `references/tools.md` and `references/tools.csv`
- Repeatable playbook: `references/workflows.md`
- Local availability check: `scripts/check-tools.sh`

## Standard operating flow

1. Open `references/tools.md` and select the smallest matching tool for the request.
2. Run `bash {baseDir}/scripts/check-tools.sh` to verify local availability.
3. Read `references/workflows.md` for command scaffolds and safety order.
4. Run help/version first, then execute with explicit input/output paths.
5. Report exact commands, artifacts produced, and follow-up risks.

## Fast start

```bash
bash {baseDir}/scripts/check-tools.sh
```

Then run:

```bash
<tool> --help || <tool> -h
<tool> --version || true
```

## Notes

- Some entries are libraries/SDKs rather than interactive CLIs.
- For library entries, treat the catalog as dependency-selection guidance.
