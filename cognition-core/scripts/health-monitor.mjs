# Health Monitor Prototype

A simple script to track system health indicators (like the WhatsApp gateway status) and report them to the Cognition Core logs.

```javascript
// monitor.mjs
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.env.HOME, '.openclaw/logs/gateway.log');

async function checkWhatsApp() {
    try {
        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = content.split('\n').reverse();
        const lastStatus = lines.find(l => l.includes('WhatsApp gateway'));
        
        if (lastStatus) {
            console.log(`[Health] Last WhatsApp status: ${lastStatus}`);
        }
    } catch (e) {
        console.error('Failed to read logs', e);
    }
}

checkWhatsApp();
```
