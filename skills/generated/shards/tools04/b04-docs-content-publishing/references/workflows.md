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
pdfly --help
mailhog --help
swaks --help
navi --help
pdf2svg --help
redocly-cli --help
latexindent --help
mdbook --help
mu --help
tinymist --help
pdfcpu --help
mkdocs --help
```
