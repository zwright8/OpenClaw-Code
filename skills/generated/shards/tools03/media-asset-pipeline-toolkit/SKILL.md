---
name: media-asset-pipeline-toolkit
description: Transform audio/video/image assets for delivery workflows. Use when transcoding media, generating thumbnails, optimizing artwork, or preparing codec-specific outputs for web/app distribution.
---

# Media Asset Pipeline Toolkit

Use this skill to standardize media pipelines from source ingest to optimized publish artifacts.

## Workflow Router

- Need video/audio transcode -> ffmpeg/x264/flac path.
- Need image optimization -> oxipng/jpegoptim/potrace path.
- Need media metadata/fingerprint workflows -> chromaprint/fonttools path.

## Playbook 1: Transcode source media for distribution

1. Normalize frame rate/resolution/bitrate.
1. Encode to target codecs and containers.
1. Validate output playback and file-size budgets.

Command starters:
```bash
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 22 -c:a aac out.mp4
ffmpeg -i input.wav -c:a flac out.flac
ffmpeg -i input.mp4 -vf fps=1 thumb-%03d.jpg
```

## Playbook 2: Optimize image and artwork bundles

1. Compress PNG/JPEG assets losslessly where possible.
1. Vectorize bitmap logos when needed.
1. Regenerate thumbnails for catalog views.

Command starters:
```bash
oxipng -o 4 assets/*.png
jpegoptim --strip-all assets/*.jpg
potrace logo.pbm -s -o logo.svg
```

## Playbook 3: Prepare advanced media deliverables

1. Apply filter/effects chains for batch jobs.
1. Generate audio fingerprints/metadata.
1. Export codec variants for compatibility matrices.

Command starters:
```bash
ffmpeg-full -i in.mp4 -vf "scale=1280:-2" out-720p.mp4
chromaprint-tool file.wav
ffmpegthumbnailer -i in.mp4 -o cover.jpg
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
