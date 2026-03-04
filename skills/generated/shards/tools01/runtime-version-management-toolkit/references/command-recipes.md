# Runtime & Version Management Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Pin Node with nvm

```bash
nvm install 22 && nvm use 22
```

Align local Node runtime to project target.

## 2. Create Python env with uv

```bash
uv venv .venv && source .venv/bin/activate
```

Create fast isolated Python environment.

## 3. Install Python deps with Poetry

```bash
poetry install
```

Resolve and install from lock file.

## 4. Set Java version

```bash
jenv local 21
```

Use project-specific JDK.

## 5. Select Rust toolchain

```bash
rustup default stable
```

Set default Rust channel.

