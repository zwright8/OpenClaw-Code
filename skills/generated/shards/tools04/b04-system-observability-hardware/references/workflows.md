# Workflow patterns

## 1) Discover tools

```bash
bash ./scripts/check-tools.sh
```

## 2) Inspect selected command

```bash
<command> --help || <command> -h
<command> --version || true
```

## 3) Safe execution sequence

1. Select tool from `tools.md`.
2. Validate auth/context first.
3. Run smallest non-destructive command.
4. Scale to full workflow with explicit output paths.
5. Capture command/output for handoff.

## 4) Starter commands

```bash
tailspin --help
usbutils --help
valgrind --help
sleepwatcher --help
goaccess --help
logstash --help
asitop --help
gperftools --help
snap --help
retry --help
sane-backends --help
grc --help
```
