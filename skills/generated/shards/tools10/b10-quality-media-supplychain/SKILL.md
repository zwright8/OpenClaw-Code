---
name: b10-quality-media-supplychain
description: Use when enforcing code quality, generating SBOM/compliance artifacts, handling media signals, and auditing dependency risk.
---

# Code quality, media processing, and software supply-chain checks

This skill clusters adjacent tools from ranks **4628-4657** in the top-5000 inventory.

## Tool families in this pack

- Quality and linting (`htmlhint`, `cargo-deny`, `ltex-ls-plus`, `abi3audit`).
- Supply-chain and policy outputs (`cyclonedx-python`, `policy_sentry`).
- Media, device, and protocol tooling (`audiowaveform`, `sipsak`, `uhubctl`, `ooniprobe`).

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
