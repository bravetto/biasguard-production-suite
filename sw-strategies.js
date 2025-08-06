// BiasGuard Service Worker Strategies
// Modular caching strategies following strategy pattern

import { SW_CONFIG } from './sw-config.js';

/**
 * Strategy factory for different caching approaches
 * Follows Google Web.dev recommendations for composable code
 */
export class CacheStrategies {
  constructor() {
    this.config = SW_CONFIG;
    this.mobileOptimizations = this.initMobileOptimizations();
  }

  initMobileOptimizations() {
    const isMobile = this.detectMobileDevice();
    const connection = this.getConnectionInfo();
    const battery = this.getBatteryInfo();

    return {
      isMobile,
      connection,
      battery,
      strategy: this.config.mobile.connectionStrategies[connection.effectiveType] || 
                this.config.mobile.connectionStrategies['3g']
    };
  }

  detectMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  }

  getConnectionInfo() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      rtt: connection?.rtt || 100,
      saveData: connection?.saveData || false
    };
  }

  getBatteryInfo() {
    // Note: Battery API is deprecated but we can still use it where available
    return {
      level: 1, // Default to full battery
      charging: true
    };
  }

  /**
   * Network First strategy with timeout and fallback
   * Suggests network priority while providing cache fallback
   */
  async networkFirst(request, cacheName = this.config.caches.dynamic) {
    try {
      const networkResponse = await this.fetchWithTimeout(request);
      
      if (networkResponse?.ok) {
        await this.safeCachePut(cacheName, request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch {
      const cachedResponse = await caches.match(request);
      
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return this.createFallbackResponse(request);
    }
  }

  /**
   * Cache First strategy with background update
   * Prioritizes speed while maintaining freshness
   */
  async cacheFirst(request, cacheName = this.config.caches.static) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      // Background update for next request (mobile-aware)
      if (this.shouldBackgroundUpdate()) {
        this.backgroundUpdate(request, cacheName).catch(() => {
          // Silent failure for background updates
        });
      }
      
      return cachedResponse;
    }
    
    try {
      const networkResponse = await this.fetchWithMobileOptimizations(request);
      
      if (networkResponse?.ok) {
        await this.safeCachePut(cacheName, request, networkResponse.clone());
      }
      
      return networkResponse;
    } catch {
      return this.createFallbackResponse(request);
    }
  }

  /**
   * Mobile-optimized fetch with connection awareness
   */
  async fetchWithMobileOptimizations(request) {
    const { connection } = this.mobileOptimizations;
    
    // Use regular fetch for now, but with mobile headers
    const response = await fetch(request, {
      headers: {
        ...request.headers,
        'Save-Data': connection.saveData ? 'on' : 'off'
      }
    });
    
    return response;
  }

  /**
   * Determine if background update should occur based on mobile conditions
   */
  shouldBackgroundUpdate() {
    const { connection, strategy } = this.mobileOptimizations;
    
    // Don't background update on slow connections
    if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') {
      return false;
    }
    
    // Don't background update if save-data is enabled
    if (connection.saveData) {
      return false;
    }
    
    return strategy.cacheAggressively;
  }

  /**
   * Stale While Revalidate strategy
   * Balances speed and freshness
   */
  async staleWhileRevalidate(request, cacheName = this.config.caches.static) {
    const cachedResponse = await caches.match(request);
    
    // Start network request in parallel
    const networkPromise = this.fetchWithTimeout(request)
      .then(response => {
        if (response?.ok) {
          this.safeCachePut(cacheName, request, response.clone());
        }
        return response;
      })
      .catch(() => null);
    
    // Return cache immediately if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Otherwise wait for network
    const networkResponse = await networkPromise;
    return networkResponse || this.createFallbackResponse(request);
  }

  /**
   * Fetch with timeout to prevent hanging requests
   */
  async fetchWithTimeout(request, timeout = this.config.timeouts.network) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(request, { signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Safe cache put with error handling
   */
  async safeCachePut(cacheName, request, response) {
    try {
      const cache = await caches.open(cacheName);
      await cache.put(request, response);
    } catch (error) {
      console.warn(`[SW] Cache put failed for ${cacheName}:`, error.message);
    }
  }

  /**
   * Background update for stale-while-revalidate
   */
  async backgroundUpdate(request, cacheName) {
    const response = await fetch(request);
    
    if (response?.ok) {
      await this.safeCachePut(cacheName, request, response);
    }
  }

  /**
   * Create appropriate fallback responses
   */
  createFallbackResponse(request) {
    const url = new URL(request.url);
    
    if (request.destination === 'document') {
      return this.createOfflineDocument();
    }
    
    if (request.destination === 'image') {
      return new Response(this.config.fallbacks.image, {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    }
    
    if (url.pathname.endsWith('.css')) {
      return new Response(this.config.fallbacks.css, {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    return new Response(this.config.fallbacks.generic, { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }

  /**
   * Create offline document with BiasGuard branding
   */
  createOfflineDocument() {
    const offlineHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BiasGuard - Offline</title>
    <style>
        body { 
            font-family: system-ui, -apple-system, sans-serif; 
            margin: 0; padding: 2rem; background: #f9fafb; 
            display: flex; flex-direction: column; align-items: center; 
            justify-content: center; min-height: 100vh; text-align: center; 
        }
        .logo { 
            width: 64px; height: 64px; 
            background: linear-gradient(135deg, #1e40af, #059669); 
            border-radius: 12px; margin-bottom: 2rem; 
            display: flex; align-items: center; justify-content: center; 
            color: white; font-weight: bold; font-size: 24px; 
        }
        h1 { color: #111827; margin-bottom: 1rem; }
        p { color: #6b7280; margin-bottom: 2rem; max-width: 400px; }
        .retry-btn { 
            background: #1e40af; color: white; 
            padding: 0.75rem 1.5rem; border: none; 
            border-radius: 0.5rem; cursor: pointer; 
            font-size: 1rem; transition: background 0.2s; 
        }
        .retry-btn:hover { background: #1d4ed8; }
    </style>
</head>
<body>
    <div class="logo">BG</div>
    <h1>You're Currently Offline</h1>
    <p>BiasGuard will be available when your connection is restored. Your work is automatically saved.</p>
    <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
</body>
</html>`;
    
    return new Response(offlineHTML, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}