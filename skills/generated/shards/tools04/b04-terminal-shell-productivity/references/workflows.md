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
zsh-history-substring-search --help
wtfutil --help
zplug --help
brew-gem --help
tcsh --help
ttyd --help
rich-cli --help
picocom --help
irssi --help
terminator --help
kimi-cli --help
virtualenvwrapper --help
```
