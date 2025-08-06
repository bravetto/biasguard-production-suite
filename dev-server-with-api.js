#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3009;
const HOST = process.env.HOST || 'localhost';

// MIME types
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.avif': 'image/avif',
    '.webmanifest': 'application/manifest+json',
    '.xml': 'application/xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf'
};

// Mock Stripe API response for development - redirect to success page
function getMockStripeResponse(tier) {
    const sessionId = 'cs_test_mock_session_id_' + Date.now();
    return {
        sessionId: sessionId,
        url: `http://localhost:${PORT}/subscription-success?session_id=${sessionId}&tier=${tier}&mock=true`,
        tier: tier,
        mode: 'subscription'
    };
}

// API route handlers
async function handleCreateCheckoutSession(req, res) {
    console.log('🔄 Mock Stripe checkout session creation');
    
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        try {
            const data = JSON.parse(body);
            console.log('📋 Checkout request:', data);
            
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            });
            
            const response = getMockStripeResponse(data.tier || 'professional');
            res.end(JSON.stringify(response));
            
        } catch (error) {
            console.error('❌ Error parsing checkout request:', error);
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
    });
}

async function handleWebhooks(req, res) {
    console.log('📨 Mock webhook received');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ received: true }));
}

async function handleSubscriptionStatus(req, res) {
    console.log('📊 Mock subscription status');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        status: 'active',
        tier: 'professional',
        trial_end: Date.now() + (14 * 24 * 60 * 60 * 1000)
    }));
}

async function handleCustomerPortal(req, res) {
    console.log('🏪 Mock customer portal');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        url: 'https://billing.stripe.com/p/session/test_mock_portal'
    }));
}

// Get network interface IP
function getNetworkIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4;
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    // Return the first available network IP
    for (const name of Object.keys(results)) {
        if (results[name].length > 0) {
            return results[name][0];
        }
    }
    
    return 'localhost';
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }
    
    // API Routes
    if (pathname.startsWith('/api/')) {
        console.log(`🔗 API Request: ${req.method} ${pathname}`);
        
        switch (pathname) {
            case '/api/create-checkout-session':
                if (req.method === 'POST') {
                    await handleCreateCheckoutSession(req, res);
                    return;
                }
                break;
            case '/api/webhooks':
                if (req.method === 'POST') {
                    await handleWebhooks(req, res);
                    return;
                }
                break;
            case '/api/subscription-status':
                if (req.method === 'GET') {
                    await handleSubscriptionStatus(req, res);
                    return;
                }
                break;
            case '/api/customer-portal':
                if (req.method === 'POST') {
                    await handleCustomerPortal(req, res);
                    return;
                }
                break;
        }
        
        // API route not found
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'API endpoint not found' }));
        return;
    }
    
    // Static file serving
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);
    
    // Security check
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    try {
        // Check if file exists
        await fs.promises.access(filePath);
        
        // Get file stats
        const stats = await fs.promises.stat(filePath);
        
        if (stats.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }
        
        // Read and serve file
        const data = await fs.promises.readFile(filePath);
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        
        // Add dev script to HTML files
        if (ext === '.html') {
            const htmlString = data.toString();
            const modifiedHtml = htmlString.replace(
                '</body>',
                `
<script>
// BiasGuard Dev Server with API Mock
console.log('🚀 BiasGuard Dev Server Active');
console.log('📍 Local: http://localhost:${PORT}');
console.log('🌐 Network: http://${getNetworkIP()}:${PORT}');
console.log('⚡ PWA Features: Active');
console.log('🔄 Live reload: Disabled (stable mode)');
console.log('🧪 API: Mock Stripe endpoints active');
</script>
</body>`
            );
            
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache'
            });
            res.end(modifiedHtml);
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
            });
            res.end(data);
        }
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
        } else {
            console.error('❌ Server error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal server error');
        }
    }
});

// Start server
function startServer() {
    const networkIP = getNetworkIP();
    
    server.listen(PORT, () => {
        console.log('🚀 BiasGuard Dev Server');
        console.log('=======================');
        console.log(`📍 Local:   http://localhost:${PORT}`);
        console.log(`🌐 Network: http://${networkIP}:${PORT}`);
        console.log('⚡ PWA Features: Active');
        console.log('🔄 Live reload: Disabled (stable mode)');
        console.log('🧪 API: Mock Stripe endpoints active');
        console.log('');
        console.log('📱 Mobile: Use network URL');
        console.log('⌨️  Ctrl+C to stop');
        console.log('');
    });
    
    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.error(`❌ Port ${PORT} is already in use`);
            console.log('💡 Try: lsof -ti:3009 | xargs kill -9');
            process.exit(1);
        } else {
            console.error('❌ Server error:', error);
        }
    });
}

startServer();