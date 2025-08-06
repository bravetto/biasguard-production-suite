// BiasGuard Service Worker Features
// Optional features that can be enabled/disabled via configuration

import { SW_CONFIG } from './sw-config.js';

export class ServiceWorkerFeatures {
  constructor() {
    this.config = SW_CONFIG;
    this.offlineQueue = [];
    this.isOnline = true;
    this.initializeOfflineSupport();
  }

  /**
   * Initialize offline support and queue management
   */
  initializeOfflineSupport() {
    // Monitor online/offline status
    self.addEventListener('online', () => {
      this.isOnline = true;
      this.processOfflineQueue();
    });
    
    self.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Handle background sync events
   * Only active if enabled in configuration
   */
  async handleBackgroundSync(event) {
    if (!this.config.features.backgroundSync) {
      return;
    }

    console.log('[SW] Background sync triggered:', event.tag);
    
    switch (event.tag) {
      case 'bias-analysis-sync':
        await this.syncOfflineAnalyses();
        break;
        
      case 'user-feedback-sync':
        await this.syncUserFeedback();
        break;
        
      default:
        console.log('[SW] Unknown sync tag:', event.tag);
    }
  }

  /**
   * Handle push notifications
   * Only active if enabled in configuration
   */
  async handlePushNotification(event) {
    if (!this.config.features.pushNotifications) {
      return;
    }

    console.log('[SW] Push notification received');
    
    const notificationData = this.parseNotificationData(event.data);
    const options = this.buildNotificationOptions(notificationData);
    
    await self.registration.showNotification(
      notificationData.title || 'BiasGuard',
      options
    );
  }

  /**
   * Handle notification clicks
   * Manages client focus and navigation
   */
  async handleNotificationClick(event) {
    if (!this.config.features.pushNotifications) {
      return;
    }

    console.log('[SW] Notification clicked');
    event.notification.close();
    
    const targetUrl = event.notification.data?.url || '/';
    
    // Try to focus existing client or open new window
    const clients = await self.clients.matchAll({ type: 'window' });
    
    for (const client of clients) {
      if (client.url.includes('biasguards.ai') && 'focus' in client) {
        await client.focus();
        return;
      }
    }
    
    if (self.clients.openWindow) {
      await self.clients.openWindow(targetUrl);
    }
  }

  /**
   * Sync offline bias analyses when connection is restored
   * Private method with error handling
   */
  async syncOfflineAnalyses() {
    try {
      console.log('[SW] Syncing offline bias analyses');
      
      // This would integrate with IndexedDB storage
      // Implementation depends on offline storage strategy
      
      // For now, just log the intent
      console.log('[SW] Offline analysis sync completed');
    } catch (error) {
      console.error('[SW] Failed to sync offline analyses:', error);
      throw error; // Re-throw to trigger retry
    }
  }

  /**
   * Sync user feedback when connection is restored
   */
  async syncUserFeedback() {
    try {
      console.log('[SW] Syncing user feedback');
      
      // Implementation would depend on feedback storage
      console.log('[SW] User feedback sync completed');
    } catch (error) {
      console.error('[SW] Failed to sync user feedback:', error);
      throw error;
    }
  }

  /**
   * Parse notification data with fallbacks
   */
  parseNotificationData(eventData) {
    if (!eventData) {
      return { title: 'BiasGuard', body: 'New update available' };
    }

    try {
      return eventData.json();
    } catch {
      return {
        title: 'BiasGuard',
        body: eventData.text() || 'New notification'
      };
    }
  }

  /**
   * Build notification options with sensible defaults
   */
  buildNotificationOptions(data) {
    return {
      body: data.body || 'New update available',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: data.tag || 'biasguard-notification',
      data: {
        url: data.url || '/',
        timestamp: Date.now()
      },
      actions: data.actions || [
        {
          action: 'open',
          title: 'Open BiasGuard',
          icon: '/favicon.svg'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/favicon.svg'
        }
      ],
      requireInteraction: data.requireInteraction || false,
      silent: false,
      vibrate: [200, 100, 200]
    };
  }

  /**
   * Handle file sharing and analysis
   */
  async handleFileShare(event) {
    try {
      const formData = await event.request.formData();
      const sharedFiles = formData.getAll('bias_report');
      
      if (sharedFiles.length > 0) {
        // Store files for offline processing
        await this.storeSharedFiles(sharedFiles);
        
        // Redirect to analysis interface
        return Response.redirect('/?shared=true', 302);
      }
      
      return new Response('No files shared', { status: 400 });
    } catch (error) {
      console.error('[SW] File share error:', error);
      return new Response('File share failed', { status: 500 });
    }
  }

  /**
   * Store shared files in IndexedDB for offline access
   */
  async storeSharedFiles(files) {
    // Implementation would use IndexedDB
    console.log('[SW] Storing shared files:', files.length);
  }

  /**
   * Process offline analysis queue when connection restored
   */
  async processOfflineQueue() {
    if (this.offlineQueue.length === 0) return;
    
    console.log('[SW] Processing offline queue:', this.offlineQueue.length, 'items');
    
    const processPromises = this.offlineQueue.map(async (item) => {
      try {
        await this.processOfflineAnalysis(item);
        return { success: true, item };
      } catch (error) {
        console.error('[SW] Failed to process offline item:', error);
        return { success: false, item, error };
      }
    });
    
    const results = await Promise.allSettled(processPromises);
    
    // Remove successfully processed items
    this.offlineQueue = this.offlineQueue.filter((_, index) => {
      const result = results[index];
      return result.status === 'rejected' || !result.value.success;
    });
    
    // Notify user of sync completion
    if (results.some(r => r.status === 'fulfilled' && r.value.success)) {
      await this.showSyncCompletionNotification(results);
    }
  }

  /**
   * Process individual offline analysis
   */
  async processOfflineAnalysis(analysisData) {
    // This would send the analysis to the server
    console.log('[SW] Processing offline analysis:', analysisData.id);
    
    // Simulate API call
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analysisData)
    });
    
    if (!response.ok) {
      throw new Error(`Analysis failed: ${response.status}`);
    }
    
    return await response.json();
  }

  /**
   * Show notification when sync completes
   */
  async showSyncCompletionNotification(results) {
    const successCount = results.filter(r => 
      r.status === 'fulfilled' && r.value.success
    ).length;
    
    if (successCount > 0) {
      await self.registration.showNotification(
        'BiasGuard Sync Complete',
        {
          body: `${successCount} offline analysis${successCount > 1 ? 'es' : ''} synced successfully`,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
          tag: 'sync-complete',
          data: { url: '/?synced=true' },
          actions: [
            {
              action: 'view',
              title: 'View Results',
              icon: '/favicon.svg'
            }
          ]
        }
      );
    }
  }

  /**
   * Queue analysis for offline processing
   */
  queueOfflineAnalysis(analysisData) {
    const queueItem = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      data: analysisData,
      retryCount: 0
    };
    
    this.offlineQueue.push(queueItem);
    console.log('[SW] Queued offline analysis:', queueItem.id);
    
    // Register background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      self.registration.sync.register('bias-analysis-sync');
    }
    
    return queueItem.id;
  }

  /**
   * Handle protocol handler for web+biasguard:// URLs
   */
  async handleProtocolRequest(event) {
    const url = new URL(event.request.url);
    const data = url.searchParams.get('data');
    
    if (data) {
      // Decode and process the shared data
      try {
        const decodedData = decodeURIComponent(data);
        return Response.redirect(`/?protocol_data=${encodeURIComponent(decodedData)}`, 302);
      } catch (error) {
        console.error('[SW] Protocol handler error:', error);
        return Response.redirect('/?error=protocol_decode_failed', 302);
      }
    }
    
    return Response.redirect('/', 302);
  }
}