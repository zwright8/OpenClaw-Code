---
name: cli-data-processing-toolkit
description: Use core shell and text/data-processing CLIs for local automation. Use when searching files, transforming text/JSON/YAML/XML, downloading APIs/files, scripting pipelines, and improving terminal productivity.
---

# CLI Data Processing Toolkit

## Overview
Compose fast, scriptable command pipelines for local data inspection and automation.

Read `references/tool-matrix.md` to choose the best tool by rank/adoption and fallback options.
Read `references/command-recipes.md` for validated command starters.
Run `scripts/check-installed.sh` to detect availability and versions before execution.

## Workflow
1. Define the exact outcome and constraints.
2. Select a primary tool and one fallback from `references/tool-matrix.md`.
3. Verify installation with `bash scripts/check-installed.sh <tool>`.
4. Start from the closest recipe in `references/command-recipes.md` and adapt flags/paths.
5. Validate output and capture command + result in your task notes.

## Common task categories
- Discover and filter filesystem content
- Transform structured and unstructured data
- Build repeatable shell pipelines
- Navigate/monitor terminal sessions efficiently

## Safety guardrails
- Prefer read-only or dry-run modes before apply/delete operations.
- Scope commands narrowly (specific files, namespaces, or resources).
- Avoid destructive flags unless explicitly required by the task.
- Capture stderr/stdout for troubleshooting and reproducibility.

## Fast checks
```bash
bash scripts/check-installed.sh
bash scripts/check-installed.sh <tool-name>
```
