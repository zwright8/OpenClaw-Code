# R&D Backlog

## Cognition Core
- [x] **Log Analyzer:** Script to parse `~/.openclaw/logs/` and count tool usage frequency. (Implemented v0.1 - Note: `gateway.log` is insufficient; need SQLite adapter)
- [x] **Error Heatmap:** Identify which tools fail the most. (Implemented v0.1)
- [x] **Memory Graph:** Generate a DOT/Graphviz file showing links between `MEMORY.md` entries. (Implemented v0.1)
- [x] **SQLite Adapter:** Create a read-only adapter. (Superseded: Switched to parsing JSONL session files directly in LogAnalyzer v2).

## Swarm Protocol
- [x] **Standard Message Schema:** Define a JSON schema for agent-to-agent task handoff. (Implemented v0.1)
- [x] **Handshake:** A script to verify another agent is "online" and compatible.
- [x] **Live Test:** First successful handshake and report handoff between `main` and `nexus`. (Completed 2026-02-25)

## Infrastructure
- [x] **Auto-Refactor:** A script that lints my own code in this repo. (Completed 2026-02-26 — `scripts/auto-refactor.mjs`)
- [ ] **WhatsApp Stability Tracker:** Monitor and alert on gateway disconnect/reconnect loops. (Added 2026-02-25)
