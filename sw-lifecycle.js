// BiasGuard Service Worker Lifecycle Management
// Handles installation, activation, and cleanup with proper error boundaries

import { SW_CONFIG } from './sw-config.js';

export class ServiceWorkerLifecycle {
  constructor() {
    this.config = SW_CONFIG;
  }

  /**
   * Handle service worker installation
   * Focuses on essential assets only, avoiding feature creep
   */
  async handleInstall() {
    console.log(`[SW] Installing BiasGuard Service Worker v${this.config.version}`);
    
    try {
      await this.cacheEssentialAssets();
      console.log('[SW] Essential assets cached successfully');
      
      // Suggest immediate activation when ready
      return self.skipWaiting();
    } catch (error) {
      console.error('[SW] Installation failed:', error);
      throw error; // Let the browser handle installation failure
    }
  }

  /**
   * Handle service worker activation
   * Cleans up old caches and claims clients
   */
  async handleActivation() {
    console.log(`[SW] Activating BiasGuard Service Worker v${this.config.version}`);
    
    try {
      await this.cleanupOldCaches();
      console.log('[SW] Cache cleanup completed');
      
      // Take control of existing clients when ready
      return self.clients.claim();
    } catch (error) {
      console.error('[SW] Activation failed:', error);
      // Continue activation even if cleanup fails
    }
  }

  /**
   * Cache essential assets during installation
   * Private method with clear single responsibility
   */
  async cacheEssentialAssets() {
    const cache = await caches.open(this.config.caches.static);
    
    // Cache core assets with error boundary
    const corePromises = this.config.assets.core.map(async (asset) => {
      try {
        const response = await fetch(asset);
        if (response.ok) {
          await cache.put(asset, response);
        }
      } catch (error) {
        console.warn(`[SW] Failed to cache core asset ${asset}:`, error.message);
        // Continue with other assets
      }
    });
    
    await Promise.allSettled(corePromises);
  }

  /**
   * Clean up outdated caches
   * Removes caches that don't match current version
   */
  async cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const currentCaches = new Set(Object.values(this.config.caches));
    
    const cleanupPromises = cacheNames
      .filter(cacheName => !currentCaches.has(cacheName))
      .map(async (cacheName) => {
        try {
          await caches.delete(cacheName);
          console.log(`[SW] Removed outdated cache: ${cacheName}`);
        } catch (error) {
          console.warn(`[SW] Failed to remove cache ${cacheName}:`, error.message);
        }
      });
    
    await Promise.allSettled(cleanupPromises);
  }

  /**
   * Handle messages from clients
   * Provides controlled interface for client communication
   */
  handleMessage(event) {
    const { data } = event;
    
    if (!data || typeof data !== 'object') {
      return; // Ignore invalid messages
    }
    
    switch (data.type) {
      case 'SKIP_WAITING':
        console.log('[SW] Received skip waiting request');
        self.skipWaiting();
        break;
        
      case 'GET_VERSION':
        event.ports[0]?.postMessage({
          type: 'VERSION_RESPONSE',
          version: this.config.version
        });
        break;
        
      default:
        console.log('[SW] Received unknown message type:', data.type);
    }
  }
}