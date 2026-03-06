# Apple & Mobile Dev Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Beautify xcodebuild output

```bash
xcodebuild -scheme App -configuration Debug build | xcbeautify
```

Reduce noisy build output for debugging.

## 2. Run Swift lint

```bash
swiftlint lint --strict
```

Fail on style violations before CI.

## 3. Format Swift code

```bash
swiftformat .
```

Normalize formatting before commits.

## 4. Run Fastlane lane

```bash
fastlane ios beta
```

Trigger a standard iOS release lane.

## 5. Generate project from spec

```bash
xcodegen generate
```

Recreate Xcode project from project.yml.

