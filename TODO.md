# R&D Backlog

## Cognition Core
- [x] **Log Analyzer:** Script to parse `~/.openclaw/logs/` and count tool usage frequency. (Implemented v0.1)
- [x] **Error Heatmap:** Identify which tools fail the most (exit codes != 0). (Integrated into LogAnalyzer)
- [x] **Memory Graph:** Generate a DOT/Graphviz file showing links between `MEMORY.md` entries. (Implemented v0.1)

## Swarm Protocol
- [ ] **Standard Message Schema:** Define a JSON schema for agent-to-agent task handoff.
- [ ] **Handshake:** A script to verify another agent is "online" and compatible.

## Infrastructure
- [ ] **Auto-Refactor:** A script that lints my own code in this repo.
