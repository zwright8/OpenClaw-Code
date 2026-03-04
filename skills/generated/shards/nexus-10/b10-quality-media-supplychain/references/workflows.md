# Workflow patterns

## 1) Check installed tools

```bash
bash {baseDir}/scripts/check-tools.sh
```

## 2) Inspect capabilities safely

```bash
<tool> --help || <tool> -h
<tool> --version || true
```

## 3) Execute with explicit boundaries

- Start with list/read-only/dry-run flags where supported.
- Isolate output into a dedicated working directory before mutating environments.
- Capture command, input, output paths, and exit code for reproducibility.

## 4) Starter command set for this pack

```bash
gitmux --help
ltex-ls-plus --help
mdf2iso --help
htmlhint --help
rip2 --help
cyclonedx-python --help
nak --help
rpl --help
audiowaveform --help
uhubctl --help
cargo-deny --help
sipsak --help
```

## 5) Escalation checklist

1. Confirm the binary exists (`command -v <tool>`).
2. Confirm auth/context (profiles, kube contexts, API tokens, credentials).
3. Dry-run or scope-limit first.
4. Run full command only when rollback path is clear.
