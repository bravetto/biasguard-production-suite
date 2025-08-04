#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const WATCH_FILES = ['index.html', 'package.json', 'vercel.json'];

// MIME types for different file extensions
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
    '.webp': 'image/webp'
};

// Live reload script to inject into HTML
const LIVE_RELOAD_SCRIPT = `
<script>
(function() {
    let ws;
    let reconnectInterval = 1000;
    let maxReconnectAttempts = 10;
    let reconnectAttempts = 0;

    function connect() {
        ws = new WebSocket('ws://localhost:${PORT + 1}');
        
        ws.onopen = function() {
            console.log('🔄 Live reload connected');
            reconnectAttempts = 0;
            reconnectInterval = 1000;
        };
        
        ws.onmessage = function(event) {
            if (event.data === 'reload') {
                console.log('🔄 File changed, reloading...');
                window.location.reload();
            }
        };
        
        ws.onclose = function() {
            console.log('🔄 Live reload disconnected');
            if (reconnectAttempts < maxReconnectAttempts) {
                setTimeout(connect, reconnectInterval);
                reconnectAttempts++;
                reconnectInterval *= 1.5;
            }
        };
        
        ws.onerror = function(error) {
            console.log('🔄 Live reload error:', error);
        };
    }
    
    connect();
})();
</script>
</body>`;

// Simple WebSocket server for live reload
function createWebSocketServer() {
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: PORT + 1 });
    
    wss.on('connection', function connection(ws) {
        console.log('🔄 Live reload client connected');
    });
    
    return wss;
}

// File watcher
function watchFiles(wss) {
    WATCH_FILES.forEach(file => {
        if (fs.existsSync(file)) {
            fs.watchFile(file, { interval: 500 }, (curr, prev) => {
                if (curr.mtime !== prev.mtime) {
                    console.log(`📝 File changed: ${file}`);
                    wss.clients.forEach(client => {
                        if (client.readyState === 1) { // WebSocket.OPEN
                            client.send('reload');
                        }
                    });
                }
            });
            console.log(`👀 Watching: ${file}`);
        }
    });
}

// HTTP Server
function createServer() {
    return http.createServer((req, res) => {
        let filePath = req.url === '/' ? '/index.html' : req.url;
        filePath = path.join(__dirname, filePath);
        
        // Security: prevent directory traversal
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        
        const ext = path.extname(filePath);
        const contentType = MIME_TYPES[ext] || 'text/plain';
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error');
                }
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            
            // Inject live reload script into HTML files
            if (ext === '.html') {
                const html = data.toString();
                const modifiedHtml = html.replace('</body>', LIVE_RELOAD_SCRIPT);
                res.end(modifiedHtml);
            } else {
                res.end(data);
            }
        });
    });
}

// Start the development server
function startServer() {
    // Check if WebSocket is available
    try {
        require('ws');
    } catch (e) {
        console.log('⚠️  WebSocket module not found. Installing...');
        exec('npm install ws', (error) => {
            if (error) {
                console.log('❌ Failed to install ws module. Live reload disabled.');
                startBasicServer();
            } else {
                console.log('✅ WebSocket module installed. Restarting...');
                startFullServer();
            }
        });
        return;
    }
    
    startFullServer();
}

function startFullServer() {
    const server = createServer();
    const wss = createWebSocketServer();
    
    server.listen(PORT, HOST, () => {
        console.log('\n🚀 BiasGuard Code Development Server');
        console.log('=====================================');
        console.log(`📍 Local:    http://${HOST}:${PORT}`);
        console.log(`🌐 Network:  http://${getNetworkIP()}:${PORT}`);
        console.log(`🔄 Live reload enabled on port ${PORT + 1}`);
        console.log('\n📱 Mobile Testing:');
        console.log(`   Use network URL on mobile devices`);
        console.log('\n⌨️  Press Ctrl+C to stop the server\n');
    });
    
    watchFiles(wss);
    
    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n👋 Shutting down development server...');
        server.close();
        wss.close();
        process.exit(0);
    });
}

function startBasicServer() {
    const server = createServer();
    
    server.listen(PORT, HOST, () => {
        console.log('\n🚀 BiasGuard Code Development Server (Basic)');
        console.log('=============================================');
        console.log(`📍 Local:    http://${HOST}:${PORT}`);
        console.log(`🌐 Network:  http://${getNetworkIP()}:${PORT}`);
        console.log('⚠️  Live reload disabled (WebSocket not available)');
        console.log('\n📱 Mobile Testing:');
        console.log(`   Use network URL on mobile devices`);
        console.log('\n⌨️  Press Ctrl+C to stop the server\n');
    });
}

// Get network IP for mobile testing
function getNetworkIP() {
    const nets = require('os').networkInterfaces();
    const results = {};
    
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    
    // Return first non-internal IPv4 address
    for (const name of Object.keys(results)) {
        if (results[name].length > 0) {
            return results[name][0];
        }
    }
    
    return 'localhost';
}

// Start the server
startServer(); 