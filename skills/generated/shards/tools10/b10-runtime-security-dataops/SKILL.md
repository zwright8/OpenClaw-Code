---
name: b10-runtime-security-dataops
description: Use when coordinating runtime/toolchain setup, kernel security controls, DNS/network analysis, and data platform utilities.
---

# Runtime toolchains, security controls, and data operations

This skill clusters adjacent tools from ranks **4564-4594** in the top-5000 inventory.

## Tool families in this pack

- Runtime and compiler toolchains (`garble`, `halide`, `i686-elf-binutils`, `xsimd`).
- Security and network controls (`libseccomp`, `massdns`, `daq`).
- Data/inference operations (`orientdb`, `doltgres`, `shimmy`, `cql`).

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
