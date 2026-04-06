# WhatsApp Bridge

This repo now includes a local WhatsApp bridge that can hand inbound WhatsApp messages to the local `codex` CLI and send the final answer back through Twilio.

The bridge lives at:

- `scripts/whatsapp-codex-bridge.ts`

It exposes:

- `GET /health`
- `POST /twilio/whatsapp`

## What This Does

This is not a native Codex-to-WhatsApp account pairing. Instead, it creates a small webhook service:

1. Twilio receives a WhatsApp message.
2. Twilio calls the local bridge webhook.
3. The bridge runs `codex exec` inside this repo.
4. The bridge sends Codex's final message back to WhatsApp.

## Requirements

- A Twilio account with WhatsApp Sandbox enabled, or a production Twilio WhatsApp sender.
- A public HTTPS URL that Twilio can reach.
  - `ngrok`, `Cloudflare Tunnel`, or another tunnel is fine.
- A logged-in local Codex CLI (`codex login` if needed).

## Quick Start

1. Copy the example environment file:

```bash
cp deploy/systemd/openclaw-whatsapp.env.example .env.whatsapp
```

2. Edit `.env.whatsapp` and set at least:

```bash
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
WHATSAPP_ALLOWED_SENDERS=whatsapp:+15551234567
WHATSAPP_BRIDGE_BASE_URL=https://your-public-url.example
CODEX_WORKDIR=/Users/zacharywright/Documents/GitHub/OpenClaw-Code
```

3. Export the env file and start the bridge:

```bash
set -a
source ./.env.whatsapp
set +a
npm run whatsapp:bridge
```

4. Point your Twilio WhatsApp webhook at:

```text
https://your-public-url.example/twilio/whatsapp
```

5. Join the Twilio Sandbox from your phone, then send a message to the sandbox number.

## Commands

These messages are handled directly by the bridge:

- `/help`
- `/status`
- `/reset`

Everything else is forwarded to `codex exec`.

## Security Notes

- `WHATSAPP_ALLOWED_SENDERS` is strongly recommended. Without it, anyone who can reach the WhatsApp sender could trigger local Codex runs.
- `TWILIO_VERIFY_SIGNATURES=true` is recommended so the bridge validates `X-Twilio-Signature`.
- The default Codex mode is `--full-auto`, not unrestricted execution.
- Only set `CODEX_DANGEROUS=true` if you understand the risk of running Codex without sandboxing.

## Notes

- Conversation history is stored locally in `.codex-whatsapp/state.json`.
- The bridge keeps replies short and splits long Codex responses into multiple WhatsApp messages.
- If you want production WhatsApp rather than the sandbox, keep the same bridge and swap in your production Twilio WhatsApp sender.
