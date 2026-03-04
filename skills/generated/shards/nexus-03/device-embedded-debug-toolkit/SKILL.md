---
name: device-embedded-debug-toolkit
description: Diagnose firmware, mobile package, and device-level integration issues. Use when working with embedded debug probes, iOS package extraction/research, USB/HID devices, or emulator-based compatibility checks.
---

# Device Embedded Debug Toolkit

Use this skill for hardware-adjacent debugging and firmware/package inspection workflows.

## Workflow Router

- Need embedded signal/probe work -> gnuradio path.
- Need iOS artifact retrieval/research -> ipatool/ipsw path.
- Need device connectivity/emulation checks -> hidapi/tiger-vnc/dosbox-x path.

## Playbook 1: Inspect and fetch mobile firmware artifacts

1. Search and download app package metadata.
1. Pull firmware bundles for offline analysis.
1. Record hashes and provenance.

Command starters:
```bash
ipatool search <app-name>
ipsw download --device <device> --version <ver>
```

## Playbook 2: Run USB/HID diagnostics

1. Enumerate and verify connected HID devices.
1. Test read/write behavior with known-good harness.
1. Capture logs for driver/firmware teams.

Command starters:
```bash
python -c "import hid"
lsusb
```

## Playbook 3: Validate legacy/remote device behavior

1. Launch emulation or remote desktop session.
1. Reproduce issue path and capture artifacts.
1. Document environment assumptions and constraints.

Command starters:
```bash
dosbox-x
tiger-vnc
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
