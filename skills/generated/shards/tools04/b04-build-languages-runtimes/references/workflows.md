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
cargo-nextest --help
node-sass --help
v8 --help
pkl --help
arm-linux-gnueabihf-binutils --help
protoc --help
poco --help
minimal-racket --help
llvm --help
gtk-doc --help
code-cli --help
tinyxml2 --help
```
