---
name: messaging-terminal-toolkit
description: Run terminal-native messaging, mail, and feed workflows. Use when triaging inboxes in CLI clients, exporting message history, or monitoring text-based communication streams without GUI dependencies.
---

# Messaging Terminal Toolkit

Use this skill to process communication channels rapidly in keyboard-first environments.

## Workflow Router

- Need email send/receive workflows -> mutt/neomutt/msmtp path.
- Need chat/feed monitoring -> weechat/newsboat path.
- Need history extraction or assistant CLI ops -> imessage-exporter/openclaw-cli path.

## Playbook 1: Triaging email from terminal

1. Open mailbox in mutt/neomutt.
1. Draft and send via msmtp profile.
1. Archive/tag high-priority threads.

Command starters:
```bash
neomutt
msmtp -a default recipient@example.com < message.txt
```

## Playbook 2: Monitor community/chat channels

1. Join required channels and set highlights.
1. Track incidents/news via terminal feeds.
1. Capture action items into task system.

Command starters:
```bash
weechat
newsboat
```

## Playbook 3: Export and audit message history

1. Export local message artifacts for analysis.
1. Search for timeline reconstruction.
1. Store outputs in secured workspace.

Command starters:
```bash
imessage-exporter -f txt -o ./exports
openclaw-cli --help
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
