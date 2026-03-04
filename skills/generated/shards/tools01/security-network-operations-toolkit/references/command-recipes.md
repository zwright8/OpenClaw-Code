# Security & Network Operations Toolkit Command Recipes

Use these as starting points. Adapt paths, namespaces, and credentials to the task context.

## 1. Inspect TLS cert

```bash
openssl s_client -connect example.com:443 -servername example.com </dev/null
```

Inspect served certificate chain.

## 2. Scan host ports

```bash
nmap -sV localhost
```

Enumerate open services and versions.

## 3. Run Trivy filesystem scan

```bash
trivy fs .
```

Detect known vulnerabilities in project files.

## 4. Generate local trusted cert

```bash
mkcert localhost 127.0.0.1 ::1
```

Create local development TLS certs.

## 5. Trace route quality

```bash
mtr --report --report-cycles 20 example.com
```

Summarize path loss/latency.

