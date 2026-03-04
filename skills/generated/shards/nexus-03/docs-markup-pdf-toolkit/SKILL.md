---
name: docs-markup-pdf-toolkit
description: Produce and maintain documentation outputs across Markdown, AsciiDoc, and PDF pipelines. Use when converting docs, rendering slides, comparing PDFs, or enforcing doc quality and style checks.
---

# Docs Markup PDF Toolkit

Use this skill for documentation assembly lines: author, render, validate, and publish.

## Workflow Router

- Need slide/deck generation -> marp-cli path.
- Need print-quality PDF workflows -> tectonic/pdftk/pdfgrep path.
- Need docs linting and preview -> markdownlint/grip/asciidoctor path.

## Playbook 1: Render publish-ready docs and slides

1. Compile source into target formats.
1. Check links/style/lint before publish.
1. Generate final assets (HTML/PDF/PPT).

Command starters:
```bash
markdownlint-cli2 "**/*.md"
marp slides.md --pdf --pptx
asciidoctor README.adoc
```

## Playbook 2: Assemble and inspect PDF deliverables

1. Merge/split/stamp PDFs as needed.
1. Search and verify required legal/branding text.
1. Compare revisions visually before release.

Command starters:
```bash
pdftk-java A=in1.pdf B=in2.pdf cat A B output merged.pdf
pdfgrep -n "<required phrase>" merged.pdf
diff-pdf --output-diff=delta.pdf old.pdf new.pdf
```

## Playbook 3: Build citation-heavy technical docs

1. Compile TeX docs deterministically.
1. Apply cross-references and figure/table numbering.
1. Run final spell/style pass.

Command starters:
```bash
tectonic main.tex
pandoc --filter pandoc-crossref paper.md -o paper.pdf
aspell check paper.md
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
