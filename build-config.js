// build-config.js — Generates js/config.js from environment variables during Vercel deployment
const fs = require('fs');
const path = require('path');

const publicKey = process.env.EMAILJS_PUBLIC_KEY || '';
const serviceId = process.env.EMAILJS_SERVICE_ID || '';
const templateId = process.env.EMAILJS_TEMPLATE_ID || '';

const configContent = `// Auto-generated during build
window.EMAIL_CONFIG = {
    PUBLIC_KEY: '${publicKey}',
    SERVICE_ID: '${serviceId}',
    TEMPLATE_ID: '${templateId}'
};
`;

const outputDir = path.join(__dirname, 'js');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(path.join(outputDir, 'config.js'), configContent);
console.log('✅ js/config.js generated successfully for Vercel deployment.');
