# Workflow patterns

## 1) Discover tools

```bash
bash {baseDir}/scripts/check-tools.sh
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
apko --help
balena-cli --help
tf-summarize --help
ko --help
scw --help
kops --help
aws --help
kubetail --help
faas-cli --help
steampipe --help
aws-sso-util --help
gifski --help
```
