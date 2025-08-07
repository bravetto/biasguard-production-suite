/**
 * 🛡️ BIASGUARD CONTEXT MANAGER
 * Zero-dependency context management for bias detection system
 * JAHmere Webb Freedom Portal - August 25th, 2025 Mission Critical
 */
export interface BiasGuardContext {
    conversationHistory: string[];
    analysisResults: Map<string, any>;
    sessionMetadata: {
        sessionId: string;
        startTime: number;
        analysisCount: number;
        lastActivity: number;
    };
    realTimeState: {
        isMonitoring: boolean;
        alertLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
        activePatterns: string[];
    };
}
export interface ContextAnalysisRequest {
    aiResponse?: string;
    userPrompt?: string;
    codeChanges?: string[];
    errorLogs?: string[];
    source: 'agent' | 'api' | 'injection' | 'manual';
    sessionId?: string;
}
export interface CachedAnalysisResult {
    result: any;
    timestamp: number;
    contextHash: string;
    confidence: number;
    expiresAt: number;
}
/**
 * 🎯 BIASGUARD CONTEXT MANAGER
 * Singleton pattern for system-wide context management
 * Zero external dependencies - pure TypeScript implementation
 */
export declare class BiasGuardContextManager {
    private static instance;
    private context;
    private analysisCache;
    private readonly CACHE_TTL;
    private readonly MAX_HISTORY_SIZE;
    private readonly MAX_CACHE_SIZE;
    private constructor();
    /**
     * 🎯 SINGLETON INSTANCE ACCESS
     */
    static getInstance(): BiasGuardContextManager;
    /**
     * 🔄 CONTEXT ANALYSIS WITH CACHING
     * Main entry point for BiasGuard analysis with context management
     */
    analyzeWithContext(request: ContextAnalysisRequest): Promise<any>;
    /**
     * 📝 UPDATE CONVERSATION HISTORY
     */
    private updateConversationHistory;
    /**
     * 📚 ADD TO HISTORY WITH SIZE MANAGEMENT
     */
    private addToHistory;
    /**
     * 🔍 PERFORM BIAS ANALYSIS
     * Placeholder for integration with unified BiasGuard system
     */
    private performBiasAnalysis;
    /**
     * 📊 CALCULATE QUICK BIAS SCORE
     */
    private calculateQuickBiasScore;
    /**
     * 🎯 DETECT BASIC PATTERNS
     */
    private detectBasicPatterns;
    /**
     * 💾 CACHE MANAGEMENT
     */
    private getCachedAnalysis;
    private cacheAnalysisResult;
    /**
     * 🔑 UTILITY METHODS
     */
    private generateContextHash;
    private generateSessionId;
    private updateSessionActivity;
    /**
     * 🎯 PUBLIC API METHODS
     */
    getContext(): BiasGuardContext;
    getConversationHistory(): string[];
    clearHistory(): void;
    clearCache(): void;
    startRealTimeMonitoring(): void;
    stopRealTimeMonitoring(): void;
    getSessionStats(): any;
    private getMemoryUsage;
    /**
     * 📊 SUBSCRIBE TO CONTEXT CHANGES (Placeholder for real-time monitoring)
     */
    subscribe(callback: (context: any) => void): () => void;
    /**
     * 📈 GET CONTEXT INSIGHTS (Placeholder for trend analysis)
     */
    getContextInsights(): any;
    /**
     * 🧹 CLEANUP AND DISPOSAL
     */
    dispose(): void;
}
export declare const biasGuardContextManager: BiasGuardContextManager;
//# sourceMappingURL=biasguard-context-manager.d.ts.map