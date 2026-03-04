---
name: b10-schema-mobile-dns-quality
description: Use when validating schemas/contracts, controlling mobile/simulator workflows, automating DNS providers, and consolidating code quality checks.
---

# Schema validation, mobile device tooling, DNS automation, and quality gates

This skill clusters adjacent tools from ranks **4726-4758** in the top-5000 inventory.

## Tool families in this pack

- Schema and contract validation (`graphql-inspector`, `oxfmt`, `precious`).
- Mobile and device workflows (`ios-sim`, `mobiledevice`, `ddcutil`).
- DNS/security and org ops (`lexicon`, `onlykey-agent`, `otterdog`).

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
