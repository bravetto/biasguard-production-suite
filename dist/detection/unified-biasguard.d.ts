/**
 * 🎯 UNIFIED BIASGUARD SYSTEM
 * Streamlined bias detection combining all proven patterns
 * Eliminates complexity while maintaining full capability
 */
export interface UnifiedBiasResult {
    hasBias: boolean;
    biasScore: number;
    confidence: number;
    patterns: DetectedPattern[];
    health: {
        aiReliability: number;
        conversationFlow: number;
        solutionEffectiveness: number;
    };
    immediateActions: string[];
    preventiveActions: string[];
    contextWarning?: string;
}
export interface DetectedPattern {
    type: 'success-declaration' | 'terminal-worship' | 'pattern-blindness' | 'planning-fallacy' | 'feature-creep' | 'authority-bias';
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    description: string;
    intervention: string;
    location?: string;
}
export declare class UnifiedBiasGuard {
    private aria;
    private conversationHistory;
    private analysisCache;
    private lastAnalysis?;
    constructor();
    /**
     * 🎯 UNIFIED BIAS ANALYSIS
     * Single entry point for all bias detection
     */
    analyze(context: {
        aiResponse?: string;
        userPrompt?: string;
        conversationHistory?: string[];
        codeChanges?: string[];
        errorLogs?: string[];
    }): Promise<UnifiedBiasResult>;
    /**
     * 🔍 DETECT ALL BIAS PATTERNS
     * Unified pattern detection combining all proven methods
     */
    private detectAllPatterns;
    /**
     * 🧮 CALCULATE BIAS SCORE
     * Unified scoring algorithm
     */
    private calculateBiasScore;
    /**
     * 🏥 CALCULATE SYSTEM HEALTH
     */
    private calculateSystemHealth;
    /**
     * 🎬 GENERATE ACTIONS
     */
    private generateActions;
    /**
     * 🚨 GENERATE CONTEXT WARNING
     */
    private generateContextWarning;
    /**
     * 🔧 HELPER METHODS
     */
    private detectSuccessDeclaration;
    private detectTerminalWorship;
    private calculateConfidence;
    private generateCacheKey;
    /**
     * 📊 GET FORMATTED RESULT
     * For easy display in UI/extension
     */
    getFormattedResult(): string;
    /**
     * 🧹 CLEANUP
     */
    dispose(): void;
}
//# sourceMappingURL=unified-biasguard.d.ts.map