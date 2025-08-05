// BiasGuard Dashboard Lazy Loading System
// Implements modern lazy loading patterns for optimal performance

export class DashboardLazyLoader {
    constructor() {
        this.componentRegistry = new Map();
        this.loadedComponents = new Set();
        this.loadingComponents = new Set();
        this.intersectionObserver = null;
        this.performanceMetrics = {
            totalComponents: 0,
            loadedComponents: 0,
            averageLoadTime: 0,
            failedLoads: 0
        };
        
        this.initializeObserver();
    }

    /**
     * Initialize Intersection Observer for lazy loading
     */
    initializeObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.loadingComponents.has(entry.target)) {
                        this.loadComponent(entry.target);
                    }
                });
            },
            {
                rootMargin: '100px', // Start loading 100px before component enters viewport
                threshold: 0.1
            }
        );

        console.log('[LazyLoader] Intersection Observer initialized');
    }

    /**
     * Register a component for lazy loading
     */
    registerComponent(element, config) {
        const componentId = element.dataset.componentId || `lazy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        element.dataset.componentId = componentId;

        const componentConfig = {
            element,
            id: componentId,
            type: config.type || 'generic',
            loader: config.loader,
            priority: config.priority || 0,
            retryCount: 0,
            maxRetries: config.maxRetries || 3,
            loadTime: null,
            errorHandler: config.errorHandler || this.defaultErrorHandler.bind(this)
        };

        this.componentRegistry.set(componentId, componentConfig);
        this.performanceMetrics.totalComponents++;

        // Add loading placeholder
        this.addLoadingPlaceholder(element, config.type);

        // Start observing
        this.intersectionObserver.observe(element);

        console.log(`[LazyLoader] Registered component: ${componentId} (${config.type})`);
        return componentId;
    }

    /**
     * Add loading placeholder to element
     */
    addLoadingPlaceholder(element, type) {
        const placeholders = {
            chart: this.createChartPlaceholder(),
            metrics: this.createMetricsPlaceholder(),
            table: this.createTablePlaceholder(),
            analysis: this.createAnalysisPlaceholder(),
            generic: this.createGenericPlaceholder()
        };

        element.innerHTML = placeholders[type] || placeholders.generic;
        element.classList.add('lazy-loading');
    }

    /**
     * Create chart loading placeholder
     */
    createChartPlaceholder() {
        return `
            <div class="chart-placeholder bg-white rounded-xl p-6 card-shadow">
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div class="h-64 bg-gray-200 rounded mb-4"></div>
                    <div class="flex space-x-4">
                        <div class="h-3 bg-gray-200 rounded w-1/6"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/6"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/6"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create metrics loading placeholder
     */
    createMetricsPlaceholder() {
        return `
            <div class="metrics-placeholder bg-white rounded-xl p-6 card-shadow">
                <div class="animate-pulse">
                    <div class="flex items-center justify-between mb-4">
                        <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div class="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    </div>
                    <div class="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        `;
    }

    /**
     * Create table loading placeholder
     */
    createTablePlaceholder() {
        return `
            <div class="table-placeholder bg-white rounded-xl p-6 card-shadow">
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div class="space-y-3">
                        ${Array(5).fill(0).map(() => `
                            <div class="grid grid-cols-4 gap-4">
                                <div class="h-3 bg-gray-200 rounded"></div>
                                <div class="h-3 bg-gray-200 rounded"></div>
                                <div class="h-3 bg-gray-200 rounded"></div>
                                <div class="h-3 bg-gray-200 rounded"></div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create analysis loading placeholder
     */
    createAnalysisPlaceholder() {
        return `
            <div class="analysis-placeholder bg-white rounded-xl p-6 card-shadow">
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div class="space-y-2 mb-4">
                        <div class="h-3 bg-gray-200 rounded"></div>
                        <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                        <div class="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="h-16 bg-gray-200 rounded"></div>
                        <div class="h-16 bg-gray-200 rounded"></div>
                        <div class="h-16 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Create generic loading placeholder
     */
    createGenericPlaceholder() {
        return `
            <div class="generic-placeholder bg-white rounded-xl p-6 card-shadow">
                <div class="animate-pulse">
                    <div class="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div class="h-32 bg-gray-200 rounded mb-4"></div>
                    <div class="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        `;
    }

    /**
     * Load a component
     */
    async loadComponent(element) {
        const componentId = element.dataset.componentId;
        const config = this.componentRegistry.get(componentId);

        if (!config || this.loadedComponents.has(componentId) || this.loadingComponents.has(componentId)) {
            return;
        }

        this.loadingComponents.add(componentId);
        const startTime = performance.now();

        try {
            console.log(`[LazyLoader] Loading component: ${componentId}`);

            // Execute the loader function
            await config.loader(element, config);

            // Mark as loaded
            this.loadedComponents.add(componentId);
            this.loadingComponents.delete(componentId);
            
            // Record load time
            config.loadTime = performance.now() - startTime;
            this.updatePerformanceMetrics(config.loadTime);

            // Remove loading class
            element.classList.remove('lazy-loading');
            element.classList.add('lazy-loaded');

            // Stop observing
            this.intersectionObserver.unobserve(element);

            console.log(`[LazyLoader] Component ${componentId} loaded in ${config.loadTime.toFixed(2)}ms`);

        } catch (error) {
            console.error(`[LazyLoader] Failed to load component ${componentId}:`, error);
            
            this.loadingComponents.delete(componentId);
            config.retryCount++;

            if (config.retryCount < config.maxRetries) {
                console.log(`[LazyLoader] Retrying component ${componentId} (attempt ${config.retryCount + 1})`);
                setTimeout(() => {
                    this.loadComponent(element);
                }, 1000 * config.retryCount); // Exponential backoff
            } else {
                this.performanceMetrics.failedLoads++;
                config.errorHandler(element, error, config);
            }
        }
    }

    /**
     * Default error handler
     */
    defaultErrorHandler(element, error, config) {
        element.innerHTML = `
            <div class="error-placeholder bg-red-50 border border-red-200 rounded-xl p-6">
                <div class="flex items-center text-red-600 mb-2">
                    <span class="text-xl mr-2">⚠️</span>
                    <span class="font-semibold">Failed to load component</span>
                </div>
                <p class="text-red-500 text-sm mb-4">
                    Component "${config.type}" failed to load after ${config.maxRetries} attempts.
                </p>
                <button 
                    onclick="window.dashboardLazyLoader.retryComponent('${config.id}')"
                    class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                    Retry Loading
                </button>
            </div>
        `;
        element.classList.add('lazy-error');
    }

    /**
     * Retry loading a failed component
     */
    retryComponent(componentId) {
        const config = this.componentRegistry.get(componentId);
        if (config) {
            config.retryCount = 0;
            config.element.classList.remove('lazy-error');
            this.addLoadingPlaceholder(config.element, config.type);
            this.intersectionObserver.observe(config.element);
        }
    }

    /**
     * Preload high-priority components
     */
    preloadHighPriorityComponents() {
        const highPriorityComponents = Array.from(this.componentRegistry.values())
            .filter(config => config.priority > 0)
            .sort((a, b) => b.priority - a.priority);

        highPriorityComponents.forEach(config => {
            if (!this.loadedComponents.has(config.id)) {
                this.loadComponent(config.element);
            }
        });

        console.log(`[LazyLoader] Preloading ${highPriorityComponents.length} high-priority components`);
    }

    /**
     * Load all remaining components (for testing or manual trigger)
     */
    loadAllComponents() {
        this.componentRegistry.forEach((config, componentId) => {
            if (!this.loadedComponents.has(componentId)) {
                this.loadComponent(config.element);
            }
        });
    }

    /**
     * Update performance metrics
     */
    updatePerformanceMetrics(loadTime) {
        const loadedCount = this.loadedComponents.size;
        const currentAvg = this.performanceMetrics.averageLoadTime;
        
        this.performanceMetrics.loadedComponents = loadedCount;
        this.performanceMetrics.averageLoadTime = 
            (currentAvg * (loadedCount - 1) + loadTime) / loadedCount;
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        const loadedPercentage = (this.performanceMetrics.loadedComponents / this.performanceMetrics.totalComponents * 100).toFixed(1);
        
        return {
            totalComponents: this.performanceMetrics.totalComponents,
            loadedComponents: this.performanceMetrics.loadedComponents,
            loadedPercentage: loadedPercentage + '%',
            averageLoadTime: this.performanceMetrics.averageLoadTime.toFixed(2) + 'ms',
            failedLoads: this.performanceMetrics.failedLoads,
            successRate: ((this.performanceMetrics.loadedComponents / (this.performanceMetrics.loadedComponents + this.performanceMetrics.failedLoads)) * 100).toFixed(1) + '%'
        };
    }

    /**
     * Cleanup resources
     */
    destroy() {
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        this.componentRegistry.clear();
        this.loadedComponents.clear();
        this.loadingComponents.clear();
    }
}

// Create global instance
window.dashboardLazyLoader = new DashboardLazyLoader();

// Chart.js specific lazy loading helpers
export class ChartLazyLoader {
    static createChartLoader(chartConfig) {
        return async (element) => {
            // Dynamic import of Chart.js if not already loaded
            if (typeof Chart === 'undefined') {
                await import('https://cdn.jsdelivr.net/npm/chart.js');
            }

            // Create canvas element
            const canvas = document.createElement('canvas');
            canvas.width = 400;
            canvas.height = 300;
            
            // Clear element and add canvas
            element.innerHTML = '';
            element.appendChild(canvas);

            // Apply performance optimizations
            const optimizedConfig = window.performanceOptimizer ? 
                window.performanceOptimizer.optimizeChartConfig(chartConfig, chartConfig.data?.datasets?.[0]?.data?.length || 0) :
                chartConfig;

            // Create chart
            new Chart(canvas.getContext('2d'), optimizedConfig);
        };
    }

    static createMetricsLoader(metricsConfig) {
        return async (element) => {
            // Simulate API call or data fetching
            const data = await ChartLazyLoader.fetchMetricsData(metricsConfig);
            
            element.innerHTML = `
                <div class="bg-white rounded-xl p-6 card-shadow">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-gray-500 text-sm font-medium">${data.title}</p>
                            <p class="text-3xl font-bold text-gray-800">${data.value}</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span class="text-2xl">${data.icon}</span>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span class="text-sm ${data.trend > 0 ? 'text-green-600' : 'text-red-600'}">
                            ${data.trend > 0 ? '+' : ''}${data.trend}% from yesterday
                        </span>
                    </div>
                </div>
            `;
        };
    }

    static async fetchMetricsData(config) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return {
            title: config.title || 'Metric',
            value: config.value || Math.floor(Math.random() * 1000),
            icon: config.icon || '📊',
            trend: (Math.random() - 0.5) * 20
        };
    }
}

export { DashboardLazyLoader };