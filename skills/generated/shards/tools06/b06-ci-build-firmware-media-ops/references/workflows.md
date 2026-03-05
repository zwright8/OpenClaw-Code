# Workflow patterns

## 1) Check installed tools

```bash
bash ./scripts/check-tools.sh
```

## 2) Inspect capabilities safely

```bash
<tool> --help || <tool> -h
<tool> --version || true
```

## 3) Execute with explicit boundaries

- Start with read-only/list/dry-run flags where possible.
- Isolate output into a working directory before mutating production state.
- Capture command + path + exit status in your run notes.

## 4) Starter command set for this pack

```bash
icdiff --help
percona-xtrabackup --help
shellspec --help
babel --help
mapserver --help
premake --help
boost-build --help
vsftpd --help
commitlint --help
nixpacks --help
monero --help
dockerfile-language-server --help
```

## 5) Escalation checklist

1. Confirm the binary exists (`command -v <tool>`).
2. Confirm auth/context (profiles, kube contexts, tokens, credentials).
3. Dry-run or scope-limit first.
4. Run full command only after rollback path is clear.
