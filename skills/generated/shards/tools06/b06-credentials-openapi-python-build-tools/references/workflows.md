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

- Start with read-only/list/dry-run flags where possible.
- Isolate output into a working directory before mutating production state.
- Capture command + path + exit status in your run notes.

## 4) Starter command set for this pack

```bash
usbredir --help
jump --help
mailsy --help
knock --help
git-credential-libsecret --help
libsmi --help
opencc --help
mpc --help
storj-uplink --help
faudio --help
btcli --help
xk6 --help
```

## 5) Escalation checklist

1. Confirm the binary exists (`command -v <tool>`).
2. Confirm auth/context (profiles, kube contexts, tokens, credentials).
3. Dry-run or scope-limit first.
4. Run full command only after rollback path is clear.
