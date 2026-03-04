---
name: files-compression-and-os-utils
description: Handle file conversion, compression, and low-level OS utility workflows. Use when transforming structured text, packing/unpacking archives, or performing core Unix system maintenance.
---

# files-compression-and-os-utils

Execute this playbook whenever work in this tool family is requested.

## 1) Triage quickly
- Confirm target environment (local, container, cluster, remote host, or cloud account).
- Confirm risk level before mutating operations.
- Confirm whether operation is read-only, change, or destructive.

## 2) Select the right tool fast
- Read `references/tools.md`.
- Match the requested outcome to the smallest capable tool.
- Prefer deterministic CLIs over ad-hoc manual steps.

## 3) Run with safe defaults
- Start with `--help` / `--version` if command behavior is uncertain.
- Use dry-run/check modes when available.
- Scope commands to specific files/resources first, then widen.

## 4) Verify and report
- Capture key command output and exit status.
- Validate expected side effects (service state, artifact creation, config diff, or logs).
- Summarize what changed, what did not change, and next recommended action.

## Command patterns
- Discover: `{tool} --help`
- Validate env: `{tool} --version`
- Safe inspect first: read/list/status subcommands before apply/delete operations.

## Included tools
See `references/tools.md` for the complete catalog for this skill (rank, description, homepage, license).
