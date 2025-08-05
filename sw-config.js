// BiasGuard Service Worker Configuration
// Centralized configuration following separation of concerns principles

export const SW_CONFIG = {
  version: '2.1.0',
  
  // Cache configuration with clear naming
  caches: {
    static: 'biasguard-static-v2.1.0',
    dynamic: 'biasguard-dynamic-v2.1.0',
    api: 'biasguard-api-v2.1.0'
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
  
  // Strategy definitions - declarative, not imperative
  strategies: {
    documents: 'networkFirst',
    assets: 'cacheFirst', 
    external: 'staleWhileRevalidate',
    api: 'networkFirst'
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