---
name: shell-productivity-toolkit
description: Optimize command-line productivity and workstation ergonomics. Use when organizing files/directories, improving shell navigation/prompts, running quick text transforms, or managing terminal-centric local workflows.
---

# Shell Productivity Toolkit

Use this skill to accelerate everyday terminal operations and reduce friction in developer workflows.

## Workflow Router

- Need file navigation and quick edits -> lf/ranger/nnn/sd path.
- Need shell UX improvements -> pure/spaceship/sheldon/fisher path.
- Need terminal session orchestration -> tmuxinator/byobu/z path.

## Playbook 1: Accelerate local file and text workflows

1. Navigate and stage file operations from TUI managers.
1. Apply safe in-place string replacements.
1. Inspect process trees while iterating fixes.

Command starters:
```bash
lf
sd "old" "new" path/to/file
pstree
```

## Playbook 2: Tune shell experience

1. Install and activate prompt/plugin managers.
1. Configure frequently used shortcuts and aliases.
1. Verify startup times and plugin conflicts.

Command starters:
```bash
fisher install <plugin>
sheldon init --shell zsh
pure
```

## Playbook 3: Manage long-running terminal work

1. Define named tmux session layouts.
1. Use smart directory jumping for project switching.
1. Keep terminal panes reproducible across restarts.

Command starters:
```bash
tmuxinator start <project>
byobu
z <project-dir>
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
