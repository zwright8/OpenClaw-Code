# CLI Data Processing Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Filter JSON response

```bash
curl -s https://api.github.com/repos/owner/repo | jq ".stargazers_count"
```

Combine HTTP fetch with JSON extraction.

## 2. Search code quickly

```bash
rg "TODO|FIXME" -n .
```

Find key markers across repository files.

## 3. Transform YAML in place

```bash
yq -i ".image.tag = "v2"" deployment.yaml
```

Patch YAML configs safely.

## 4. Parallelize batch command

```bash
parallel -j 4 "file {} && wc -l {}" ::: *.log
```

Run bounded parallel jobs over file sets.

## 5. Sync directories

```bash
rsync -avh --delete src/ dest/
```

Mirror local trees efficiently.

