# Database & Streaming Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Open Postgres shell

```bash
psql "$DATABASE_URL"
```

Start direct PostgreSQL session.

## 2. Open MySQL shell

```bash
mysql -h localhost -u root -p
```

Connect to MySQL interactively.

## 3. Ping Redis

```bash
redis-cli ping
```

Validate Redis connectivity quickly.

## 4. Query DuckDB file

```bash
duckdb data.duckdb "SELECT count(*) FROM events;"
```

Run one-shot analytical query.

## 5. Describe Kafka topics

```bash
kafka-topics --bootstrap-server localhost:9092 --list
```

List available Kafka topics.

