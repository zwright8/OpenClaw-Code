# skills/generated sharding layout

To keep GitHub browsing usable, generated skill folders are sharded under:

`skills/generated/shards/<bucket>/<skill-dir>/`

- `<bucket>` is the first 2 digits of the zero-padded 5-digit skill id.
- Example: skill `1` lives in `skills/generated/shards/00/0001-.../`
- Example: skill `9876` lives in `skills/generated/shards/09/9876-.../`

Manifests and runtime catalogs reference these sharded paths.
Build/materialize scripts are shard-aware and continue to write to this layout.
