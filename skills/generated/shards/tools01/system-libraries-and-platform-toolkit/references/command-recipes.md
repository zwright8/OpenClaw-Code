# System Libraries & Platform Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Inspect shared library linkage

```bash
otool -L ./binary
```

Verify linked dynamic libraries on macOS.

## 2. Query pkg-config metadata

```bash
pkg-config --cflags --libs libxml-2.0
```

Resolve compile/link flags for dependencies.

## 3. Check daemon listening ports

```bash
lsof -i -P -n | grep LISTEN
```

Confirm local service bindings.

## 4. Inspect OpenMP runtime

```bash
brew info libomp
```

Confirm compiler runtime dependency details.

## 5. Test Caddy config

```bash
caddy validate --config Caddyfile
```

Validate local reverse-proxy config before restart.

