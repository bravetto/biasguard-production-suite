// BiasGuard Service Worker - Core PWA Implementation
// Version 2.0.0 - Simplified and Focused

const CACHE_VERSION = 'biasguard-v2.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

// Essential assets recommended for caching
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/favicon.svg',
    '/site.webmanifest',
    '/bias-ml-engine.wasm.js'
];

// External resources that may benefit from caching
const EXTERNAL_RESOURCES = [
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/web-vitals@3/dist/web-vitals.js'
];

// Note: Cache strategies are implemented directly in handlers for simplicity

// Install Event - Cache Essential Assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker v2.0.0');
    
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching essential assets');
            return cache.addAll(CORE_ASSETS);
        }).then(() => {
            console.log('[SW] Essential assets cached successfully');
            return self.skipWaiting(); // Activate when ready
        }).catch((error) => {
            console.error('[SW] Failed to cache essential assets:', error);
        })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker v2.0.0');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('[SW] Removing outdated cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('[SW] Service Worker activated');
            return self.clients.claim(); // Take control when ready
        })
    );
});

// Fetch Event - Simplified Request Handling
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests and localhost in development
    if (request.method !== 'GET' || url.hostname === 'localhost') return;
    
    // Route requests based on type
    if (request.destination === 'document') {
        event.respondWith(handleDocumentRequest(request));
    } else if (request.destination === 'image') {
        event.respondWith(handleAssetRequest(request));
    } else if (EXTERNAL_RESOURCES.some(resource => request.url.includes(resource))) {
        event.respondWith(handleExternalRequest(request));
    } else {
        event.respondWith(handleGenericRequest(request));
    }
});

// Document Request Handler (Network First)
async function handleDocumentRequest(request) {
    try {
        // Attempt network request first
        const networkResponse = await fetch(request);
        
        // Cache successful responses for offline use
        if (networkResponse.ok) {
            try {
                const cache = await caches.open(DYNAMIC_CACHE);
                await cache.put(request, networkResponse.clone());
            } catch (cacheError) {
                console.warn('[SW] Cache put failed:', cacheError);
            }
        }
        
        return networkResponse;
    } catch (networkError) {
        console.log('[SW] Network unavailable, checking cache:', networkError.message);
        
        // Try cached version
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Provide offline page as fallback
        return createOfflinePage();
    }
}

// Asset Request Handler (Cache First)
async function handleAssetRequest(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            try {
                const cache = await caches.open(DYNAMIC_CACHE);
                await cache.put(request, networkResponse.clone());
            } catch (cacheError) {
                console.warn('[SW] Asset cache put failed:', cacheError);
            }
        }
        
        return networkResponse;
    } catch {
        // Provide simple fallback for images
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#6b7280">Content Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
}

// External Resource Handler (Stale While Revalidate)
async function handleExternalRequest(request) {
    const cachedResponse = await caches.match(request);
    
    // Return cached version immediately if available
    if (cachedResponse) {
        // Update cache in background
        fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
                const cache = caches.open(STATIC_CACHE);
                cache.then(c => c.put(request, networkResponse.clone()));
            }
        }).catch(() => {}); // Ignore background update failures
        
        return cachedResponse;
    }
    
    // No cache available, try network
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch {
        return new Response('/* Resource unavailable */', {
            headers: { 'Content-Type': 'text/css' }
        });
    }
}

// Generic Request Handler (Simplified)
async function handleGenericRequest(request) {
    const cachedResponse = await caches.match(request);
    
    // Return cached version if available, update in background
    if (cachedResponse) {
        // Background update for next request
        fetch(request).then(networkResponse => {
            if (networkResponse.ok) {
                const cache = caches.open(DYNAMIC_CACHE);
                cache.then(c => c.put(request, networkResponse.clone()));
            }
        }).catch(() => {}); // Ignore background failures
        
        return cachedResponse;
    }
    
    // No cache available, try network
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch {
        return new Response('Resource unavailable', { status: 503 });
    }
}

// Create Offline Page
function createOfflinePage() {
    const offlineHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BiasGuard - Offline</title>
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 2rem; background: #f9fafb; text-align: center; }
        .logo { width: 64px; height: 64px; background: linear-gradient(to right, #1e40af, #059669); border-radius: 12px; margin: 0 auto 2rem; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; }
        h1 { color: #111827; margin-bottom: 1rem; }
        p { color: #6b7280; margin-bottom: 2rem; }
        .retry-btn { background: #1e40af; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; }
    </style>
</head>
<body>
    <div class="logo">BG</div>
    <h1>Currently Offline</h1>
    <p>BiasGuard will be available when your connection is restored.</p>
    <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
</body>
</html>`;
    
    return new Response(offlineHTML, {
        headers: { 'Content-Type': 'text/html' }
    });
}

// Basic Background Sync Support
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync triggered:', event.tag);
    
    if (event.tag === 'bias-scan-sync') {
        event.waitUntil(syncOfflineScans());
    }
});

// Simple sync for offline bias scans
async function syncOfflineScans() {
    try {
        // Basic implementation for syncing offline scans when connection is restored
        console.log('[SW] Syncing offline bias scans');
        // Implementation would depend on IndexedDB storage
    } catch (error) {
        console.error('[SW] Sync failed:', error);
    }
}

// Simple Push Notification Handler
self.addEventListener('push', (event) => {
    console.log('[SW] Push notification received');
    
    let notificationData = {
        title: 'BiasGuard',
        body: 'New update available!'
    };
    
    if (event.data) {
        try {
            notificationData = event.data.json();
        } catch {
            notificationData.body = event.data.text();
        }
    }
    
    const options = {
        body: notificationData.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        data: {
            url: notificationData.url || '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, options)
    );
});

// Simple Notification Click Handler
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked');
    
    event.notification.close();
    
    const notificationData = event.notification.data || {};
    const targetUrl = notificationData.url || '/';
    
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clientList => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url.includes('biasguards.ai') && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Open new window if none exists
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// Basic message handling
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker v2.0.0 loaded - Simplified and focused'); 