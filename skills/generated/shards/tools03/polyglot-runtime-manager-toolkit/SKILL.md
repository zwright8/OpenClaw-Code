---
name: polyglot-runtime-manager-toolkit
description: Manage multi-language toolchains and compiler workflows. Use when projects span Go, Ruby, Haskell, OCaml, Swift, WebAssembly, or systems languages and require reproducible runtime/build environments.
---

# Polyglot Runtime Manager Toolkit

Use this skill to bootstrap, pin, and validate polyglot runtimes with compiler-aware diagnostics.

## Workflow Router

- Need language/runtime install/pinning -> volta/nodebrew/aqua/juliaup path.
- Need compiler toolchain work -> gcc/llvm/mold/yasm path.
- Need WebAssembly or cross-target work -> wabt/wasmtime/binaryen path.

## Playbook 1: Pin and bootstrap language runtimes

1. Install required runtime versions.
1. Lock toolchain config in repo.
1. Verify binaries and path precedence.

Command starters:
```bash
volta install node@<ver>
aqua i
juliaup add release
```

## Playbook 2: Compile and link performance-sensitive binaries

1. Select compiler version and flags by target.
1. Build with reproducible optimization profile.
1. Benchmark and verify ABI/runtime compatibility.

Command starters:
```bash
gcc-14 --version
clang --version
mold --version
```

## Playbook 3: Work with WebAssembly artifacts

1. Inspect and validate wasm modules.
1. Run modules under local runtime.
1. Optimize binaries before shipping.

Command starters:
```bash
wasm-objdump -x module.wasm
wasmtime run module.wasm
wasm-opt -O3 module.wasm -o module.opt.wasm
```

## Tool Inventory Reference

- Read `references/tool-map.csv` for the full rank-mapped tool list for this workflow cluster.
- Read `references/tool-notes.md` for quick top-tool guidance.
- Prefer tools already installed locally before suggesting new installs.

## Completion Checklist

- Confirm objective, scope, and target environment before running commands.
- Execute smallest safe test first, then expand to full workflow.
- Capture outputs (logs, reports, artifacts) and summarize follow-up actions.
