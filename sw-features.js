// BiasGuard Service Worker Features
// Optional features that can be enabled/disabled via configuration

import { SW_CONFIG } from './sw-config.js';

export class ServiceWorkerFeatures {
  constructor() {
    this.config = SW_CONFIG;
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
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false
    };
  }
}