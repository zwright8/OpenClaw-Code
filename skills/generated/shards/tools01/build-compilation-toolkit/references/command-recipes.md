# Build & Compilation Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Configure CMake build

```bash
cmake -S . -B build -G Ninja
```

Generate Ninja build files.

## 2. Build with Ninja

```bash
ninja -C build
```

Compile using generated build graph.

## 3. Cache compilation results

```bash
ccache --show-stats
```

Inspect compiler cache effectiveness.

## 4. Run Maven package

```bash
mvn -B clean package
```

Create JVM artifacts in batch mode.

## 5. Generate protobuf stubs

```bash
buf generate
```

Generate language stubs from proto definitions.

