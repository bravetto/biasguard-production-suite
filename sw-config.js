// BiasGuard Service Worker Configuration
// Centralized configuration following separation of concerns principles

export const SW_CONFIG = {
  version: '2.2.0',
  
  // Enhanced cache configuration with mobile-specific strategies
  caches: {
    static: 'biasguard-static-v2.2.0',
    dynamic: 'biasguard-dynamic-v2.2.0',
    api: 'biasguard-api-v2.2.0',
    images: 'biasguard-images-v2.2.0',
    mobile: 'biasguard-mobile-v2.2.0'
  },
  
  // Assets categorized by purpose, not assumption
  assets: {
    core: [
      '/',
      '/index.html',
      '/favicon.svg',
      '/site.webmanifest',
      '/bias-ml-engine.wasm.js'
    ],
    external: [
      'https://cdn.tailwindcss.com',
      'https://unpkg.com/web-vitals@3/dist/web-vitals.js'
    ]
  },
  
  // Enhanced strategy definitions with mobile-specific optimizations
  strategies: {
    documents: 'networkFirst',
    assets: 'cacheFirst', 
    external: 'staleWhileRevalidate',
    api: 'networkFirst',
    images: 'cacheFirst',
    mobileOptimized: 'staleWhileRevalidate'
  },

  // Mobile-specific configuration
  mobile: {
    // Cache sizes optimized for mobile storage constraints
    maxCacheSize: {
      images: 50 * 1024 * 1024, // 50MB for images
      static: 25 * 1024 * 1024,  // 25MB for static assets
      dynamic: 15 * 1024 * 1024  // 15MB for dynamic content
    },
    
    // Connection-aware caching
    connectionStrategies: {
      '4g': {
        preloadDistance: 200,
        cacheAggressively: true,
        prefetchImages: true
      },
      '3g': {
        preloadDistance: 100,
        cacheAggressively: true,
        prefetchImages: false
      },
      '2g': {
        preloadDistance: 50,
        cacheAggressively: false,
        prefetchImages: false
      },
      'slow-2g': {
        preloadDistance: 25,
        cacheAggressively: false,
        prefetchImages: false
      }
    },

    // Battery-conscious settings
    batteryOptimizations: {
      enableWhenBatteryLow: false,
      backgroundSyncThreshold: 0.2, // Only sync when battery > 20%
      reduceQualityWhenLowBattery: true
    }
  },
  
  // Timeout configurations
  timeouts: {
    network: 3000,
    cache: 1000
  },
  
  // Error handling preferences
  fallbacks: {
    document: '/offline.html',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjEwMCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNmI3MjgwIj5PZmZsaW5lPC90ZXh0Pjwvc3ZnPg==',
    css: '/* Resource temporarily unavailable */',
    generic: 'Service temporarily unavailable'
  },
  
  // Feature flags for gradual enhancement
  features: {
    backgroundSync: true,
    pushNotifications: true,
    offlineAnalytics: false // Could be enabled later
  }
};