---
name: b10-platform-build-geo-sdr
description: Use when handling platform operations, distributed build/release tasks, geospatial indexing, SDR/USB protocol analysis, and backup coordination.
---

# Platform operations, release engineering, geospatial, and SDR workflows

This skill clusters adjacent tools from ranks **4501-4532** in the top-5000 inventory.

## Tool families in this pack

- Platform and orchestration CLIs (`triton`, `kwok`, `monit`, `codeberg-cli`).
- Build/test/release chain (`jreleaser`, `lit`, `distcc`, `adaptivecpp`).
- Geo, signal, and content extraction (`h3`, `packetry`, `limesuite`, `trafilatura`, `bup`).

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
