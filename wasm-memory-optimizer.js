// BiasGuard WebAssembly Memory Optimizer
// Advanced memory management for ML inference optimization

export class WasmMemoryOptimizer {
    constructor() {
        this.memoryPools = new Map();
        this.allocationHistory = [];
        this.memoryMetrics = {
            totalAllocated: 0,
            totalDeallocated: 0,
            peakUsage: 0,
            currentUsage: 0,
            poolUtilization: new Map()
        };
        
        this.initializeMemoryPools();
        this.startMemoryMonitoring();
    }

    /**
     * Initialize specialized memory pools for different operations
     * Based on research showing WebAssembly memory optimization importance
     */
    initializeMemoryPools() {
        const poolConfigs = {
            // Statistical calculations (p-values, confidence intervals)
            statistical: {
                size: 2 * 1024 * 1024,  // 2MB
                blockSize: 1024,        // 1KB blocks
                alignment: 8,           // 8-byte alignment for doubles
                description: 'Statistical calculation buffers'
            },
            
            // Pattern matching operations
            patterns: {
                size: 1 * 1024 * 1024,  // 1MB
                blockSize: 512,         // 512B blocks
                alignment: 4,           // 4-byte alignment
                description: 'Pattern matching buffers'
            },
            
            // Intersectional analysis
            intersectional: {
                size: 512 * 1024,      // 512KB
                blockSize: 256,        // 256B blocks
                alignment: 4,
                description: 'Intersectional analysis buffers'
            },
            
            // Temporary operations
            temporary: {
                size: 256 * 1024,      // 256KB
                blockSize: 128,        // 128B blocks
                alignment: 4,
                description: 'Temporary operation buffers'
            },
            
            // Large data processing
            bulk: {
                size: 4 * 1024 * 1024, // 4MB
                blockSize: 4096,       // 4KB blocks
                alignment: 16,         // 16-byte alignment for SIMD
                description: 'Bulk data processing buffers'
            }
        };

        Object.entries(poolConfigs).forEach(([poolName, config]) => {
            this.createMemoryPool(poolName, config);
        });

        console.log('[WasmMemory] Memory pools initialized:', Array.from(this.memoryPools.keys()));
    }

    /**
     * Create a memory pool with specified configuration
     */
    createMemoryPool(name, config) {
        const buffer = new ArrayBuffer(config.size);
        const view = new Uint8Array(buffer);
        const blockCount = Math.floor(config.size / config.blockSize);
        
        const pool = {
            name,
            buffer,
            view,
            size: config.size,
            blockSize: config.blockSize,
            blockCount,
            alignment: config.alignment,
            description: config.description,
            freeBlocks: new Set(Array.from({ length: blockCount }, (_, i) => i)),
            allocatedBlocks: new Map(),
            allocations: 0,
            deallocations: 0,
            peakUsage: 0,
            currentUsage: 0
        };

        this.memoryPools.set(name, pool);
        return pool;
    }

    /**
     * Allocate memory from specified pool
     */
    allocate(poolName, size, alignment = null) {
        const pool = this.memoryPools.get(poolName);
        if (!pool) {
            throw new Error(`Memory pool '${poolName}' not found`);
        }

        const effectiveAlignment = alignment || pool.alignment;
        const blocksNeeded = Math.ceil(size / pool.blockSize);
        
        // Find contiguous free blocks
        const startBlock = this.findContiguousBlocks(pool, blocksNeeded);
        if (startBlock === -1) {
            // Try garbage collection first
            this.garbageCollect(poolName);
            const retryStartBlock = this.findContiguousBlocks(pool, blocksNeeded);
            
            if (retryStartBlock === -1) {
                throw new Error(`Insufficient memory in pool '${poolName}'. Requested: ${size} bytes, Available blocks: ${pool.freeBlocks.size}`);
            }
            return this.performAllocation(pool, retryStartBlock, blocksNeeded, size, effectiveAlignment);
        }

        return this.performAllocation(pool, startBlock, blocksNeeded, size, effectiveAlignment);
    }

    /**
     * Find contiguous free blocks
     */
    findContiguousBlocks(pool, blocksNeeded) {
        const freeBlocksArray = Array.from(pool.freeBlocks).sort((a, b) => a - b);
        
        for (let i = 0; i <= freeBlocksArray.length - blocksNeeded; i++) {
            let isContiguous = true;
            const startBlock = freeBlocksArray[i];
            
            for (let j = 1; j < blocksNeeded; j++) {
                if (freeBlocksArray[i + j] !== startBlock + j) {
                    isContiguous = false;
                    break;
                }
            }
            
            if (isContiguous) {
                return startBlock;
            }
        }
        
        return -1;
    }

    /**
     * Perform the actual allocation
     */
    performAllocation(pool, startBlock, blocksNeeded, size, alignment) {
        const offset = startBlock * pool.blockSize;
        const alignedOffset = this.alignOffset(offset, alignment);
        
        // Mark blocks as allocated
        for (let i = 0; i < blocksNeeded; i++) {
            pool.freeBlocks.delete(startBlock + i);
        }

        const allocation = {
            pool: pool.name,
            startBlock,
            blocksNeeded,
            offset: alignedOffset,
            size,
            timestamp: Date.now(),
            id: this.generateAllocationId()
        };

        pool.allocatedBlocks.set(allocation.id, allocation);
        pool.allocations++;
        pool.currentUsage += size;
        pool.peakUsage = Math.max(pool.peakUsage, pool.currentUsage);

        // Update global metrics
        this.memoryMetrics.totalAllocated += size;
        this.memoryMetrics.currentUsage += size;
        this.memoryMetrics.peakUsage = Math.max(this.memoryMetrics.peakUsage, this.memoryMetrics.currentUsage);

        // Record allocation history
        this.allocationHistory.push(allocation);

        return {
            id: allocation.id,
            buffer: pool.buffer.slice(alignedOffset, alignedOffset + size),
            view: new Uint8Array(pool.buffer, alignedOffset, size),
            offset: alignedOffset,
            size,
            pool: pool.name
        };
    }

    /**
     * Deallocate memory
     */
    deallocate(allocationId) {
        let targetPool = null;
        let allocation = null;

        // Find the allocation across all pools
        for (const pool of this.memoryPools.values()) {
            if (pool.allocatedBlocks.has(allocationId)) {
                targetPool = pool;
                allocation = pool.allocatedBlocks.get(allocationId);
                break;
            }
        }

        if (!targetPool || !allocation) {
            console.warn(`[WasmMemory] Allocation ${allocationId} not found for deallocation`);
            return false;
        }

        // Free the blocks
        for (let i = 0; i < allocation.blocksNeeded; i++) {
            targetPool.freeBlocks.add(allocation.startBlock + i);
        }

        // Remove from allocated blocks
        targetPool.allocatedBlocks.delete(allocationId);
        targetPool.deallocations++;
        targetPool.currentUsage -= allocation.size;

        // Update global metrics
        this.memoryMetrics.totalDeallocated += allocation.size;
        this.memoryMetrics.currentUsage -= allocation.size;

        console.log(`[WasmMemory] Deallocated ${allocation.size} bytes from pool '${targetPool.name}'`);
        return true;
    }

    /**
     * Align offset to specified boundary
     */
    alignOffset(offset, alignment) {
        return Math.ceil(offset / alignment) * alignment;
    }

    /**
     * Generate unique allocation ID
     */
    generateAllocationId() {
        return `alloc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Garbage collection for a specific pool
     */
    garbageCollect(poolName) {
        const pool = this.memoryPools.get(poolName);
        if (!pool) return;

        const beforeFreeBlocks = pool.freeBlocks.size;
        
        // Find and remove expired allocations (older than 5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        const expiredAllocations = [];

        pool.allocatedBlocks.forEach((allocation, id) => {
            if (allocation.timestamp < fiveMinutesAgo) {
                expiredAllocations.push(id);
            }
        });

        // Deallocate expired allocations
        expiredAllocations.forEach(id => {
            this.deallocate(id);
        });

        const afterFreeBlocks = pool.freeBlocks.size;
        const freedBlocks = afterFreeBlocks - beforeFreeBlocks;

        if (freedBlocks > 0) {
            console.log(`[WasmMemory] Garbage collected ${freedBlocks} blocks from pool '${poolName}'`);
        }
    }

    /**
     * Optimize memory layout by defragmenting pools
     */
    defragmentPool(poolName) {
        const pool = this.memoryPools.get(poolName);
        if (!pool) return;

        console.log(`[WasmMemory] Defragmenting pool '${poolName}'`);

        // Get all active allocations
        const activeAllocations = Array.from(pool.allocatedBlocks.values())
            .sort((a, b) => a.startBlock - b.startBlock);

        // Compact allocations to the beginning of the pool
        let currentBlock = 0;
        const newAllocations = new Map();

        activeAllocations.forEach(allocation => {
            if (allocation.startBlock !== currentBlock) {
                // Move allocation to new position
                const oldOffset = allocation.startBlock * pool.blockSize;
                const newOffset = currentBlock * pool.blockSize;
                
                // Copy data to new location
                pool.view.copyWithin(newOffset, oldOffset, oldOffset + allocation.size);
                
                // Update allocation record
                allocation.startBlock = currentBlock;
                allocation.offset = newOffset;
            }
            
            newAllocations.set(allocation.id, allocation);
            currentBlock += allocation.blocksNeeded;
        });

        // Update free blocks
        pool.freeBlocks.clear();
        for (let i = currentBlock; i < pool.blockCount; i++) {
            pool.freeBlocks.add(i);
        }

        pool.allocatedBlocks = newAllocations;
        console.log(`[WasmMemory] Pool '${poolName}' defragmented. Free blocks: ${pool.freeBlocks.size}`);
    }

    /**
     * Get memory usage statistics
     */
    getMemoryStats() {
        const poolStats = {};
        
        this.memoryPools.forEach((pool, name) => {
            const usedBlocks = pool.blockCount - pool.freeBlocks.size;
            const utilization = (usedBlocks / pool.blockCount * 100).toFixed(2);
            
            poolStats[name] = {
                size: pool.size,
                blockSize: pool.blockSize,
                totalBlocks: pool.blockCount,
                usedBlocks,
                freeBlocks: pool.freeBlocks.size,
                utilization: utilization + '%',
                currentUsage: pool.currentUsage,
                peakUsage: pool.peakUsage,
                allocations: pool.allocations,
                deallocations: pool.deallocations,
                description: pool.description
            };
        });

        return {
            global: {
                totalAllocated: this.memoryMetrics.totalAllocated,
                totalDeallocated: this.memoryMetrics.totalDeallocated,
                currentUsage: this.memoryMetrics.currentUsage,
                peakUsage: this.memoryMetrics.peakUsage,
                allocationHistory: this.allocationHistory.length
            },
            pools: poolStats
        };
    }

    /**
     * Start memory monitoring
     */
    startMemoryMonitoring() {
        // Monitor every 30 seconds
        setInterval(() => {
            this.updatePoolUtilization();
            this.checkMemoryLeaks();
        }, 30000);

        // Garbage collection every 5 minutes
        setInterval(() => {
            this.memoryPools.forEach((pool, name) => {
                this.garbageCollect(name);
            });
        }, 5 * 60 * 1000);

        console.log('[WasmMemory] Memory monitoring started');
    }

    /**
     * Update pool utilization metrics
     */
    updatePoolUtilization() {
        this.memoryPools.forEach((pool, name) => {
            const usedBlocks = pool.blockCount - pool.freeBlocks.size;
            const utilization = usedBlocks / pool.blockCount;
            this.memoryMetrics.poolUtilization.set(name, utilization);
        });
    }

    /**
     * Check for potential memory leaks
     */
    checkMemoryLeaks() {
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        let suspiciousAllocations = 0;

        this.memoryPools.forEach(pool => {
            pool.allocatedBlocks.forEach(allocation => {
                if (allocation.timestamp < oneHourAgo) {
                    suspiciousAllocations++;
                }
            });
        });

        if (suspiciousAllocations > 0) {
            console.warn(`[WasmMemory] Found ${suspiciousAllocations} allocations older than 1 hour - potential memory leak`);
        }
    }

    /**
     * Create optimized buffer for bias detection operations
     */
    createBiasDetectionBuffer(textLength, analysisType = 'standard') {
        const bufferSizes = {
            standard: textLength * 4,      // 4x text length for pattern matching
            advanced: textLength * 8,      // 8x for intersectional analysis
            statistical: textLength * 2    // 2x for statistical calculations
        };

        const size = bufferSizes[analysisType] || bufferSizes.standard;
        const poolName = analysisType === 'statistical' ? 'statistical' : 
                        analysisType === 'advanced' ? 'intersectional' : 'patterns';

        return this.allocate(poolName, size);
    }

    /**
     * Optimize WebAssembly memory for bias detection engine
     */
    optimizeBiasEngine(biasEngine) {
        const originalAnalyzeAdvanced = biasEngine.analyzeAdvanced;
        
        biasEngine.analyzeAdvanced = async (text, options = {}) => {
            const buffer = this.createBiasDetectionBuffer(text.length, 'advanced');
            
            try {
                // Store original text in optimized buffer
                const textEncoder = new TextEncoder();
                const encodedText = textEncoder.encode(text);
                buffer.view.set(encodedText);
                
                // Perform analysis
                const result = await originalAnalyzeAdvanced.call(biasEngine, text, options);
                
                return result;
            } finally {
                // Always deallocate buffer
                this.deallocate(buffer.id);
            }
        };

        console.log('[WasmMemory] BiasMLEngine optimized with memory management');
    }

    /**
     * Export memory usage report
     */
    exportMemoryReport() {
        const stats = this.getMemoryStats();
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                totalPools: this.memoryPools.size,
                globalUsage: `${(stats.global.currentUsage / 1024 / 1024).toFixed(2)} MB`,
                peakUsage: `${(stats.global.peakUsage / 1024 / 1024).toFixed(2)} MB`,
                efficiency: `${((stats.global.totalDeallocated / stats.global.totalAllocated) * 100).toFixed(2)}%`
            },
            pools: stats.pools,
            recommendations: this.generateOptimizationRecommendations(stats)
        };

        return report;
    }

    /**
     * Generate optimization recommendations
     */
    generateOptimizationRecommendations(stats) {
        const recommendations = [];

        Object.entries(stats.pools).forEach(([poolName, poolStats]) => {
            const utilization = parseFloat(poolStats.utilization);
            
            if (utilization > 90) {
                recommendations.push({
                    type: 'warning',
                    pool: poolName,
                    message: `Pool '${poolName}' is ${utilization}% utilized. Consider increasing pool size.`
                });
            } else if (utilization < 10) {
                recommendations.push({
                    type: 'info',
                    pool: poolName,
                    message: `Pool '${poolName}' is only ${utilization}% utilized. Consider reducing pool size.`
                });
            }

            if (poolStats.allocations > poolStats.deallocations * 2) {
                recommendations.push({
                    type: 'warning',
                    pool: poolName,
                    message: `Pool '${poolName}' has more allocations than deallocations. Check for memory leaks.`
                });
            }
        });

        return recommendations;
    }

    /**
     * Cleanup all resources
     */
    destroy() {
        // Deallocate all active allocations
        this.memoryPools.forEach(pool => {
            const allocations = Array.from(pool.allocatedBlocks.keys());
            allocations.forEach(id => this.deallocate(id));
        });

        this.memoryPools.clear();
        this.allocationHistory = [];
        
        console.log('[WasmMemory] Memory optimizer destroyed');
    }
}

// Export singleton instance
export const wasmMemoryOptimizer = new WasmMemoryOptimizer();