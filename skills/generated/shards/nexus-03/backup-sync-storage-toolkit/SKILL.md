---
name: backup-sync-storage-toolkit
description: Protect and move data safely across local and remote stores. Use when creating encrypted backups, syncing folders, restoring archives, or handling recovery/transfer workflows.
---

# Backup Sync Storage Toolkit

Use this skill for backup discipline: snapshot, verify, restore-test, and synchronize.

## Workflow Router

- Need encrypted snapshots -> restic/borg path.
- Need bidirectional sync -> unison path.
- Need recovery/extraction operations -> ddrescue/cabextract/innoextract path.

## Playbook 1: Create encrypted backup snapshots

1. Initialize repository and retention policy.
1. Capture snapshot with tags/host metadata.
1. Verify and prune according to policy.

Command starters:
```bash
restic -r <repo> backup <paths>
restic -r <repo> snapshots
restic -r <repo> forget --keep-daily 7 --prune
```

## Playbook 2: Synchronize working sets across machines

1. Define explicit sync root and ignore patterns.
1. Run dry-run conflict check before apply.
1. Execute sync and validate key file hashes.

Command starters:
```bash
unison <profile>
croc send <file-or-dir>
rsync -avh --dry-run src/ dst/
```

## Playbook 3: Recover or extract from damaged/packaged sources

1. Attempt non-destructive recovery first.
1. Extract packaged artifacts for forensic inspection.
1. Move recovered outputs to quarantine area.

Command starters:
```bash
ddrescue /dev/<disk> disk.img rescue.log
cabextract archive.cab
innoextract installer.exe
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
