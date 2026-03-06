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
flexget --help
opentelemetry-cpp --help
unicorn --help
ytt --help
libftdi --help
mage --help
fig2dev --help
sqruff --help
whisperkit-cli --help
gpg-tui --help
desktop-file-utils --help
opusfile --help
```

## 5) Escalation checklist

1. Confirm the binary exists (`command -v <tool>`).
2. Confirm auth/context (profiles, kube contexts, tokens, credentials).
3. Dry-run or scope-limit first.
4. Run full command only after rollback path is clear.
