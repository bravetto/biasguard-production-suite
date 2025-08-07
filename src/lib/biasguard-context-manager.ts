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
export class BiasGuardContextManager {
  private static instance: BiasGuardContextManager;
  private context: BiasGuardContext;
  private analysisCache: Map<string, CachedAnalysisResult>;
  private readonly CACHE_TTL = 300000; // 5 minutes
  private readonly MAX_HISTORY_SIZE = 100;
  private readonly MAX_CACHE_SIZE = 50;

  private constructor() {
    this.context = {
      conversationHistory: [],
      analysisResults: new Map(),
      sessionMetadata: {
        sessionId: this.generateSessionId(),
        startTime: Date.now(),
        analysisCount: 0,
        lastActivity: Date.now(),
      },
      realTimeState: {
        isMonitoring: false,
        alertLevel: 'none',
        activePatterns: [],
      },
    };
    this.analysisCache = new Map();
  }

  /**
   * 🎯 SINGLETON INSTANCE ACCESS
   */
  static getInstance(): BiasGuardContextManager {
    if (!BiasGuardContextManager.instance) {
      BiasGuardContextManager.instance = new BiasGuardContextManager();
    }
    return BiasGuardContextManager.instance;
  }

  /**
   * 🔄 CONTEXT ANALYSIS WITH CACHING
   * Main entry point for BiasGuard analysis with context management
   */
  async analyzeWithContext(request: ContextAnalysisRequest): Promise<any> {
    // Update session metadata
    this.updateSessionActivity();

    // Generate context hash for caching
    const contextHash = this.generateContextHash(request);
    
    // Check cache first
    const cachedResult = this.getCachedAnalysis(contextHash);
    if (cachedResult) {
      return cachedResult.result;
    }

    // Update conversation history
    this.updateConversationHistory(request);

    // Simulate BiasGuard analysis (would integrate with actual unified system)
    const analysisResult = await this.performBiasAnalysis(request);

    // Cache the result
    this.cacheAnalysisResult(contextHash, analysisResult);

    // Update context with results
    this.context.analysisResults.set(contextHash, analysisResult);

    return analysisResult;
  }

  /**
   * 📝 UPDATE CONVERSATION HISTORY
   */
  private updateConversationHistory(request: ContextAnalysisRequest): void {
    if (request.userPrompt) {
      this.addToHistory(`USER: ${request.userPrompt}`);
    }
    if (request.aiResponse) {
      this.addToHistory(`AI: ${request.aiResponse}`);
    }
    if (request.codeChanges?.length) {
      this.addToHistory(`CODE_CHANGES: ${request.codeChanges.join(', ')}`);
    }
    if (request.errorLogs?.length) {
      this.addToHistory(`ERRORS: ${request.errorLogs.join(', ')}`);
    }
  }

  /**
   * 📚 ADD TO HISTORY WITH SIZE MANAGEMENT
   */
  private addToHistory(entry: string): void {
    this.context.conversationHistory.push(entry);
    
    // Maintain history size limit
    if (this.context.conversationHistory.length > this.MAX_HISTORY_SIZE) {
      this.context.conversationHistory = this.context.conversationHistory.slice(-this.MAX_HISTORY_SIZE);
    }
  }

  /**
   * 🔍 PERFORM BIAS ANALYSIS
   * Placeholder for integration with unified BiasGuard system
   */
  private async performBiasAnalysis(request: ContextAnalysisRequest): Promise<any> {
    // This would integrate with the actual UnifiedBiasGuard system
    // For now, return a structured response that matches the expected interface
    
    const biasScore = this.calculateQuickBiasScore(request);
    const patterns = this.detectBasicPatterns(request);
    
    return {
      hasBias: biasScore > 0.3,
      biasScore,
      confidence: 0.85,
      patterns,
      health: {
        aiReliability: 0.9,
        conversationFlow: 0.8,
        solutionEffectiveness: 0.85,
      },
      immediateActions: patterns.length > 0 ? ['Review detected patterns', 'Consider alternative approaches'] : [],
      preventiveActions: ['Maintain conversation diversity', 'Regular bias checks'],
      contextWarning: biasScore > 0.7 ? 'High bias detected - immediate attention required' : undefined,
      source: request.source,
      timestamp: Date.now(),
    };
  }

  /**
   * 📊 CALCULATE QUICK BIAS SCORE
   */
  private calculateQuickBiasScore(request: ContextAnalysisRequest): number {
    let score = 0;
    const content = [request.aiResponse, request.userPrompt].filter(Boolean).join(' ').toLowerCase();
    
    // Mission-critical patterns (JAHmere Webb project)
    if (/court.?date|august.?25/i.test(content)) score += 0.35;
    if (/refactor|rebuild|rewrite/i.test(content)) score += 0.4;
    
    // Basic pattern detection for scoring
    if (/perfect|ideal|comprehensive|guaranteed|ultimate/i.test(content)) score += 0.3;
    if (/always|never|all|every/i.test(content)) score += 0.2;
    if (/deadline|urgent|immediately|asap/i.test(content)) score += 0.25;
    
    // Planning fallacy patterns
    if (/roadmap|timeline|phase|milestone/i.test(content)) score += 0.3;
    
    // Feature creep patterns  
    if (/framework|enterprise|comprehensive|system/i.test(content)) score += 0.25;
    
    return Math.min(score, 1.0);
  }

  /**
   * 🎯 DETECT BASIC PATTERNS
   */
  private detectBasicPatterns(request: ContextAnalysisRequest): any[] {
    const patterns: any[] = [];
    const content = [request.aiResponse, request.userPrompt].filter(Boolean).join(' ').toLowerCase();
    
    // Mission-critical patterns
    if (/court.?date|august.?25/i.test(content)) {
      patterns.push({
        type: 'mission-pressure',
        severity: 'high',
        confidence: 0.95,
        description: 'Mission deadline pressure detected',
        intervention: 'Stay focused on deliverables, avoid scope creep',
      });
    }
    
    if (/refactor|rebuild|rewrite/i.test(content)) {
      patterns.push({
        type: 'rewrite-trap',
        severity: 'critical',
        confidence: 0.9,
        description: 'Rewrite bias detected - improve existing instead',
        intervention: 'Improve existing code, avoid starting over',
      });
    }
    
    if (/perfect|ideal|comprehensive/i.test(content)) {
      patterns.push({
        type: 'perfectionism',
        severity: 'medium',
        confidence: 0.8,
        description: 'Perfectionism bias detected',
        intervention: 'Focus on functional over perfect',
      });
    }
    
    if (/deadline|urgent|immediately/i.test(content)) {
      patterns.push({
        type: 'planning-fallacy',
        severity: 'high',
        confidence: 0.9,
        description: 'Time pressure bias detected',
        intervention: 'Reassess timeline and priorities',
      });
    }
    
    if (/framework|enterprise|comprehensive|system/i.test(content)) {
      patterns.push({
        type: 'feature-creep',
        severity: 'medium',
        confidence: 0.75,
        description: 'Feature creep bias detected',
        intervention: 'Simplify approach, solve one problem at a time',
      });
    }
    
    return patterns;
  }

  /**
   * 💾 CACHE MANAGEMENT
   */
  private getCachedAnalysis(contextHash: string): CachedAnalysisResult | null {
    const cached = this.analysisCache.get(contextHash);
    if (!cached || Date.now() > cached.expiresAt) {
      if (cached) this.analysisCache.delete(contextHash);
      return null;
    }
    return cached;
  }

  private cacheAnalysisResult(contextHash: string, result: any): void {
    // Manage cache size
    if (this.analysisCache.size >= this.MAX_CACHE_SIZE) {
      const oldestKey = this.analysisCache.keys().next().value;
      this.analysisCache.delete(oldestKey);
    }

    this.analysisCache.set(contextHash, {
      result,
      timestamp: Date.now(),
      contextHash,
      confidence: result.confidence || 0.8,
      expiresAt: Date.now() + this.CACHE_TTL,
    });
  }

  /**
   * 🔑 UTILITY METHODS
   */
  private generateContextHash(request: ContextAnalysisRequest): string {
    const hashInput = JSON.stringify({
      aiResponse: request.aiResponse?.substring(0, 100),
      userPrompt: request.userPrompt?.substring(0, 100),
      source: request.source,
    });
    
    // Simple hash function (would use crypto in production)
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private generateSessionId(): string {
    return `bg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private updateSessionActivity(): void {
    this.context.sessionMetadata.lastActivity = Date.now();
    this.context.sessionMetadata.analysisCount++;
  }

  /**
   * 🎯 PUBLIC API METHODS
   */
  getContext(): BiasGuardContext {
    return { ...this.context }; // Return copy to prevent mutation
  }

  getConversationHistory(): string[] {
    return [...this.context.conversationHistory];
  }

  clearHistory(): void {
    this.context.conversationHistory = [];
  }

  clearCache(): void {
    this.analysisCache.clear();
  }

  startRealTimeMonitoring(): void {
    this.context.realTimeState.isMonitoring = true;
    this.context.realTimeState.alertLevel = 'low';
  }

  stopRealTimeMonitoring(): void {
    this.context.realTimeState.isMonitoring = false;
    this.context.realTimeState.alertLevel = 'none';
    this.context.realTimeState.activePatterns = [];
  }

  getSessionStats(): any {
    return {
      sessionId: this.context.sessionMetadata.sessionId,
      duration: Date.now() - this.context.sessionMetadata.startTime,
      analysisCount: this.context.sessionMetadata.analysisCount,
      cacheHitRate: this.analysisCache.size > 0 ? 0.8 : 0, // Placeholder calculation
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private getMemoryUsage(): any {
    return {
      historyEntries: this.context.conversationHistory.length,
      cachedAnalyses: this.analysisCache.size,
      estimatedBytes: JSON.stringify(this.context).length + JSON.stringify([...this.analysisCache.values()]).length,
    };
  }

  /**
   * 📊 SUBSCRIBE TO CONTEXT CHANGES (Placeholder for real-time monitoring)
   */
  subscribe(callback: (context: any) => void): () => void {
    // Placeholder implementation - would integrate with actual event system
    console.log('🔄 BiasGuard Context Manager subscription started');
    return () => {
      console.log('🔄 BiasGuard Context Manager subscription stopped');
    };
  }

  /**
   * 📈 GET CONTEXT INSIGHTS (Placeholder for trend analysis)
   */
  getContextInsights(): any {
    // Placeholder implementation - would analyze historical context data
    return {
      historical: {
        trendDirection: 'stable',
        mostCommonPatterns: ['perfectionism', 'planning-fallacy'],
      },
      currentSession: {
        averageBias: 0.3,
      },
      recommendations: ['Focus on functional over perfect', 'Avoid timeline pressure'],
    };
  }

  /**
   * 🧹 CLEANUP AND DISPOSAL
   */
  dispose(): void {
    this.clearHistory();
    this.clearCache();
    this.stopRealTimeMonitoring();
    console.log('🧹 BiasGuard Context Manager disposed');
  }
}

// Export singleton instance for convenience
export const biasGuardContextManager = BiasGuardContextManager.getInstance();