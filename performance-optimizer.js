// BiasGuard Performance Optimizer
// Advanced performance enhancement system following 2025 best practices

export class PerformanceOptimizer {
    constructor() {
        this.memoryPool = new Map();
        this.statisticalCache = new Map();
        this.chartCache = new Map();
        this.lazyComponents = new Map();
        this.observedElements = new Set();
        this.performanceMetrics = {
            wasmMemoryUsage: 0,
            cacheHitRate: 0,
            chartRenderTime: 0,
            componentLoadTime: 0
        };
        
        this.initializePerformanceMonitoring();
    }

    /**
     * WebAssembly Memory Pool Management
     * Based on research showing VRAM > RAM importance for ML inference
     */
    initializeWasmMemoryPool() {
        // Pre-allocate memory pools for common operations
        const poolSizes = {
            statistical: 1024 * 1024,      // 1MB for statistical calculations
            pattern: 512 * 1024,           // 512KB for pattern matching
            intersection: 256 * 1024,      // 256KB for intersectional analysis
            temporary: 128 * 1024          // 128KB for temporary operations
        };

        Object.entries(poolSizes).forEach(([type, size]) => {
            this.memoryPool.set(type, {
                buffer: new ArrayBuffer(size),
                view: new Uint8Array(new ArrayBuffer(size)),
                allocated: 0,
                maxSize: size
            });
        });

        console.log('[Performance] WASM memory pools initialized');
    }

    /**
     * Allocate memory from pool to avoid frequent allocations
     */
    allocateMemory(type, size) {
        const pool = this.memoryPool.get(type);
        if (!pool || pool.allocated + size > pool.maxSize) {
            // Fallback to direct allocation if pool exhausted
            return new ArrayBuffer(size);
        }

        const offset = pool.allocated;
        pool.allocated += size;
        return pool.buffer.slice(offset, offset + size);
    }

    /**
     * Reset memory pool for reuse
     */
    resetMemoryPool(type) {
        const pool = this.memoryPool.get(type);
        if (pool) {
            pool.allocated = 0;
        }
    }

    /**
     * Statistical Calculation Caching Layer
     * Caches expensive operations like p-value calculations, confidence intervals
     */
    initializeStatisticalCache() {
        // Cache configuration with TTL
        this.cacheConfig = {
            maxSize: 1000,
            ttl: 5 * 60 * 1000, // 5 minutes
            cleanupInterval: 60 * 1000 // 1 minute
        };

        // Periodic cache cleanup
        setInterval(() => {
            this.cleanupExpiredCache();
        }, this.cacheConfig.cleanupInterval);
    }

    /**
     * Cache statistical calculation results
     */
    cacheStatisticalResult(key, result) {
        if (this.statisticalCache.size >= this.cacheConfig.maxSize) {
            // Remove oldest entries
            const oldestKey = this.statisticalCache.keys().next().value;
            this.statisticalCache.delete(oldestKey);
        }

        this.statisticalCache.set(key, {
            result,
            timestamp: Date.now(),
            hitCount: 0
        });
    }

    /**
     * Retrieve cached statistical result
     */
    getCachedStatisticalResult(key) {
        const cached = this.statisticalCache.get(key);
        if (cached && (Date.now() - cached.timestamp) < this.cacheConfig.ttl) {
            cached.hitCount++;
            return cached.result;
        }
        return null;
    }

    /**
     * Generate cache key for statistical operations
     */
    generateStatisticalCacheKey(operation, data, options = {}) {
        const dataHash = this.hashData(data);
        const optionsHash = this.hashData(options);
        return `${operation}:${dataHash}:${optionsHash}`;
    }

    /**
     * Simple hash function for cache keys
     */
    hashData(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }

    /**
     * Chart.js Rendering Optimization
     * Implements data decimation, lazy loading, and performance-optimized configurations
     */
    optimizeChartConfig(config, dataSize) {
        const optimizedConfig = { ...config };

        // Enable performance optimizations for large datasets
        if (dataSize > 1000) {
            optimizedConfig.options = {
                ...optimizedConfig.options,
                // Disable animations for large datasets
                animation: false,
                
                // Disable data parsing for performance
                parsing: false,
                
                // Enable data decimation
                plugins: {
                    ...optimizedConfig.options?.plugins,
                    decimation: {
                        enabled: true,
                        algorithm: 'lttb', // Largest Triangle Three Buckets
                        samples: Math.min(500, Math.floor(dataSize / 10))
                    }
                },
                
                // Optimize scales
                scales: {
                    ...optimizedConfig.options?.scales,
                    x: {
                        ...optimizedConfig.options?.scales?.x,
                        ticks: {
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }
                },
                
                // Optimize interaction
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            };
        }

        return optimizedConfig;
    }

    /**
     * Lazy Loading Implementation for Dashboard Components
     */
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadComponent(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.1
            }
        );

        console.log('[Performance] Lazy loading initialized');
    }

    /**
     * Register component for lazy loading
     */
    registerLazyComponent(element, loader) {
        const componentId = element.dataset.componentId || `component-${Date.now()}`;
        
        this.lazyComponents.set(componentId, {
            element,
            loader,
            loaded: false,
            loadTime: null
        });

        element.dataset.componentId = componentId;
        this.intersectionObserver.observe(element);
        this.observedElements.add(element);
    }

    /**
     * Load component when it becomes visible
     */
    async loadComponent(element) {
        const componentId = element.dataset.componentId;
        const component = this.lazyComponents.get(componentId);

        if (!component || component.loaded) return;

        const startTime = performance.now();
        
        try {
            // Show loading state
            element.innerHTML = `
                <div class="flex items-center justify-center h-32">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span class="ml-2 text-gray-600">Loading...</span>
                </div>
            `;

            // Load the component
            await component.loader(element);
            
            component.loaded = true;
            component.loadTime = performance.now() - startTime;
            
            // Update performance metrics
            this.updateComponentLoadMetrics(component.loadTime);
            
            // Stop observing this element
            this.intersectionObserver.unobserve(element);
            this.observedElements.delete(element);

            console.log(`[Performance] Component ${componentId} loaded in ${component.loadTime.toFixed(2)}ms`);
            
        } catch (error) {
            console.error(`[Performance] Failed to load component ${componentId}:`, error);
            element.innerHTML = `
                <div class="text-red-600 text-center p-4">
                    Failed to load component. Please refresh the page.
                </div>
            `;
        }
    }

    /**
     * Performance Monitoring and Metrics
     */
    initializePerformanceMonitoring() {
        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                this.performanceMetrics.wasmMemoryUsage = performance.memory.usedJSHeapSize;
            }, 5000);
        }

        // Monitor cache hit rate
        setInterval(() => {
            this.calculateCacheHitRate();
        }, 10000);

        // Web Vitals monitoring
        this.monitorWebVitals();
    }

    /**
     * Calculate cache hit rate
     */
    calculateCacheHitRate() {
        let totalRequests = 0;
        let totalHits = 0;

        this.statisticalCache.forEach(entry => {
            totalRequests += entry.hitCount + 1; // +1 for initial miss
            totalHits += entry.hitCount;
        });

        this.performanceMetrics.cacheHitRate = totalRequests > 0 ? 
            (totalHits / totalRequests * 100).toFixed(2) : 0;
    }

    /**
     * Monitor Web Vitals
     */
    monitorWebVitals() {
        // Largest Contentful Paint
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('[Performance] LCP:', lastEntry.startTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                const fid = entry.processingStart - entry.startTime;
                console.log('[Performance] FID:', fid);
            });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift
        let cls = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            });
            console.log('[Performance] CLS:', cls);
        }).observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Update component load metrics
     */
    updateComponentLoadMetrics(loadTime) {
        const currentAvg = this.performanceMetrics.componentLoadTime;
        const loadedComponents = Array.from(this.lazyComponents.values())
            .filter(c => c.loaded).length;
        
        this.performanceMetrics.componentLoadTime = 
            (currentAvg * (loadedComponents - 1) + loadTime) / loadedComponents;
    }

    /**
     * Cleanup expired cache entries
     */
    cleanupExpiredCache() {
        const now = Date.now();
        let cleanedCount = 0;

        this.statisticalCache.forEach((entry, key) => {
            if (now - entry.timestamp > this.cacheConfig.ttl) {
                this.statisticalCache.delete(key);
                cleanedCount++;
            }
        });

        if (cleanedCount > 0) {
            console.log(`[Performance] Cleaned ${cleanedCount} expired cache entries`);
        }
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        return {
            memoryPools: Array.from(this.memoryPool.entries()).map(([type, pool]) => ({
                type,
                allocated: pool.allocated,
                maxSize: pool.maxSize,
                utilization: ((pool.allocated / pool.maxSize) * 100).toFixed(2) + '%'
            })),
            cache: {
                statisticalCacheSize: this.statisticalCache.size,
                maxCacheSize: this.cacheConfig.maxSize,
                hitRate: this.performanceMetrics.cacheHitRate + '%'
            },
            components: {
                registered: this.lazyComponents.size,
                loaded: Array.from(this.lazyComponents.values()).filter(c => c.loaded).length,
                averageLoadTime: this.performanceMetrics.componentLoadTime.toFixed(2) + 'ms'
            },
            memory: {
                wasmUsage: (this.performanceMetrics.wasmMemoryUsage / 1024 / 1024).toFixed(2) + 'MB'
            }
        };
    }

    /**
     * Optimize existing bias detection for performance
     */
    optimizeBiasDetection(biasEngine) {
        // Wrap statistical calculations with caching
        const originalCalculateAdvancedScores = biasEngine.calculateAdvancedScores;
        biasEngine.calculateAdvancedScores = (patterns, counterfactualAnalysis, intersectionalAnalysis) => {
            const cacheKey = this.generateStatisticalCacheKey(
                'advancedScores', 
                { patterns, counterfactualAnalysis, intersectionalAnalysis }
            );
            
            const cached = this.getCachedStatisticalResult(cacheKey);
            if (cached) {
                return cached;
            }

            const result = originalCalculateAdvancedScores.call(
                biasEngine, 
                patterns, 
                counterfactualAnalysis, 
                intersectionalAnalysis
            );
            
            this.cacheStatisticalResult(cacheKey, result);
            return result;
        };

        // Optimize memory usage for pattern matching
        const originalAnalyzeAdvanced = biasEngine.analyzeAdvanced;
        biasEngine.analyzeAdvanced = async (text, options = {}) => {
            // Use memory pool for text processing
            this.allocateMemory('pattern', text.length * 2);
            
            try {
                const result = await originalAnalyzeAdvanced.call(biasEngine, text, options);
                return result;
            } finally {
                // Reset memory pool after use
                this.resetMemoryPool('pattern');
            }
        };

        console.log('[Performance] BiasMLEngine optimized for performance');
    }
}

// Export singleton instance
export const performanceOptimizer = new PerformanceOptimizer();