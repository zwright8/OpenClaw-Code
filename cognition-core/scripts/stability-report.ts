import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.env.HOME, '.openclaw/logs/gateway.err.log');

async function checkWhatsAppStability() {
    try {
        if (!fs.existsSync(LOG_FILE)) {
            console.log('Log file not found.');
            return;
        }

        const content = fs.readFileSync(LOG_FILE, 'utf8');
        const disconnects = (content.match(/WhatsApp gateway disconnected/g) || []).length;
        const reconnects = (content.match(/WhatsApp gateway connected/g) || []).length;
        
        console.log('--- WhatsApp Stability Report ---');
        console.log(`Disconnects: ${disconnects}`);
        console.log(`Reconnects:  ${reconnects}`);
        console.log(`Current:     ${reconnects >= disconnects ? 'Connected ✅' : 'Disconnected ❌'}`);
        
        if (disconnects > 5) {
            console.log('Warning: High frequency of WhatsApp disconnects detected today.');
        }
    } catch (e) {
        console.error('Stability check failed:', e.message);
    }
}

checkWhatsAppStability();
