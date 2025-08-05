#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PORT = process.env.PORT || 3009;
const HOST = process.env.HOST || 'localhost';
const WATCH_FILES = ['index.html', 'package.json', 'vercel.json'];

// MIME types for different file extensions including modern formats
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

// Generate simple dev info script (no WebSocket for now)
function generateLiveReloadScript(wsPort) {
    return `
<script>
// BiasGuard Dev Server - Live reload temporarily disabled for stability
console.log('🚀 BiasGuard Dev Server Active');
console.log('📍 Server: http://localhost:3009');
console.log('⚡ PWA Features: Active');
console.log('🔄 Live reload: Disabled (manual refresh needed)');
</script>
</body>`;
}

// Simplified WebSocket server with robust port detection
async function createWebSocketServer() {
    const { WebSocketServer } = await import('ws');
    const net = await import('net');
    
    // Function to check if port is available
    const isPortAvailable = (port) => {
        return new Promise((resolve) => {
            const server = net.createServer();
            server.listen(port, () => {
                server.close(() => resolve(true));
            });
            server.on('error', () => resolve(false));
        });
    };
    
    // Find an available port starting from PORT + 1
    let wsPort = PORT + 1;
    
    for (let attempts = 0; attempts < 10; attempts++) {
        const available = await isPortAvailable(wsPort);
        if (available) {
            try {
                const wss = new WebSocketServer({ 
                    port: wsPort,
                    perMessageDeflate: false, // Disable compression for faster dev
                    maxPayload: 1024, // Small payload limit
                    clientTracking: true // Track connections
                });
                
                console.log(`🔌 WebSocket server started on port ${wsPort}`);
                
                // Track connections to prevent flooding
                let connectionCount = 0;
                const maxConnections = 5;
                
                wss.on('connection', (ws, req) => {
                    connectionCount++;
                    
                    // Limit concurrent connections
                    if (connectionCount > maxConnections) {
                        ws.close(1008, 'Too many connections');
                        connectionCount--;
                        return;
                    }
                    
                    console.log(`🔄 Client connected (${connectionCount}/${maxConnections})`);
                    
                    ws.on('close', () => {
                        connectionCount--;
                        // Only log if there are still connections (reduce noise)
                        if (connectionCount > 0) {
                            console.log(`🔄 Client disconnected (${connectionCount}/${maxConnections})`);
                        }
                    });
                    
                    ws.on('error', () => {
                        // Silently handle errors - they're common in dev
                    });
                });
                
                return { wss, port: wsPort };
            } catch (error) {
                console.log(`❌ Failed to start WebSocket on port ${wsPort}:`, error.message);
            }
        }
        wsPort++;
    }
    
    throw new Error('Could not find available port for WebSocket server after 10 attempts');
}

// Streamlined file watcher
function watchFiles(wss) {
    WATCH_FILES.forEach(file => {
        if (fs.existsSync(file)) {
            fs.watchFile(file, { interval: 500 }, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    console.log(`📝 ${file} changed`);
                    wss.clients.forEach(client => {
                        if (client.readyState === 1) {
                            client.send('reload');
                        }
                    });
                }
            });
            console.log(`👀 Watching ${file}`);
        }
    });
}

// HTTP Server
function createServer(wsPort = null) {
    return http.createServer((req, res) => {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(__dirname, filePath);
        
        // Security check
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        
        // Handle special cases and get content type
        const ext = path.extname(filePath);
        const fileName = path.basename(filePath);
        
        let contentType = MIME_TYPES[ext] || 'text/plain';
        
        // Special handling for specific files
        if (fileName === 'site.webmanifest') {
            contentType = 'application/manifest+json';
        } else if (fileName === 'browserconfig.xml') {
            contentType = 'application/xml';
        } else if (fileName === 'sw.js') {
            contentType = 'application/javascript';
        }
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(err.code === 'ENOENT' ? 404 : 500);
                res.end(err.code === 'ENOENT' ? 'Not found' : 'Server error');
                return;
            }
            
            const headers = { 
                'Content-Type': contentType,
                'Cache-Control': fileName === 'sw.js' ? 'no-cache, no-store, must-revalidate' : 'no-cache',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'DENY',
                // Enhanced security headers for 2025
                'X-XSS-Protection': '1; mode=block',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
                'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
            };
            
            // Add Service Worker specific headers
            if (fileName === 'sw.js') {
                headers['Service-Worker-Allowed'] = '/';
                headers['Expires'] = '0';
            }
            
            res.writeHead(200, headers);
            
            // Inject dev info for HTML
            if (ext === '.html') {
                const html = data.toString();
                res.end(html.replace('</body>', generateLiveReloadScript(null)));
            } else {
                res.end(data);
            }
        });
    });
}

// Simplified server start
async function startServer() {
    try {
        await import('ws');
    } catch (e) {
        console.log('⚠️  Installing WebSocket...');
        exec('npm install ws', (error) => {
            if (error) {
                console.log('❌ WebSocket install failed');
                startBasicServer();
            } else {
                console.log('✅ WebSocket installed');
                startFullServer();
            }
        });
        return;
    }
    
    startFullServer();
}

async function startFullServer() {
    // Skip WebSocket for now - just start HTTP server
    const server = createServer(null);
    
    server.listen(PORT, HOST, async () => {
        console.log('\n🚀 BiasGuard Dev Server');
        console.log('=======================');
        console.log(`📍 Local:   http://${HOST}:${PORT}`);
        console.log(`🌐 Network: http://${await getNetworkIP()}:${PORT}`);
        console.log(`⚡ PWA Features: Active`);
        console.log(`🔄 Live reload: Disabled (stable mode)`);
        console.log('\n📱 Mobile: Use network URL');
        console.log('⌨️  Ctrl+C to stop\n');
    });
    
    // watchFiles(null); // Disabled for stability
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Stopping server...');
        server.close(() => {
            console.log('✅ Server closed successfully');
            process.exit(0);
        });
    });
}

function startBasicServer() {
    const server = createServer();
    
    server.listen(PORT, HOST, async () => {
        console.log('\n🚀 BiasGuard Dev Server (Basic)');
        console.log('===============================');
        console.log(`📍 Local:   http://${HOST}:${PORT}`);
        console.log(`🌐 Network: http://${await getNetworkIP()}:${PORT}`);
        console.log('⚠️  Live reload disabled');
        console.log('\n📱 Mobile: Use network URL');
        console.log('⌨️  Ctrl+C to stop\n');
    });
}

// Simplified network IP detection
async function getNetworkIP() {
    const { networkInterfaces } = await import('os');
    const nets = networkInterfaces();
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    
    return 'localhost';
}

// Start the server
startServer(); 