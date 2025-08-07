"use strict";
/**
 * 🎯 UNIFIED BIASGUARD SYSTEM
 * Streamlined bias detection combining all proven patterns
 * Eliminates complexity while maintaining full capability
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnifiedBiasGuard = void 0;
const aria_protocol_1 = require("../core/aria-protocol");
class UnifiedBiasGuard {
    constructor() {
        this.conversationHistory = [];
        this.analysisCache = new Map();
        this.aria = new aria_protocol_1.ARIAProtocol({
            constraints: {
                maxAttemptsSameSolution: 3,
                requireAlternativeApproachAfter: 5,
                contextWindowResetTrigger: 50,
            }
        });
    }
    /**
     * 🎯 UNIFIED BIAS ANALYSIS
     * Single entry point for all bias detection
     */
    async analyze(context) {
        // Update conversation history
        if (context.conversationHistory) {
            this.conversationHistory = context.conversationHistory;
        }
        if (context.userPrompt) {
            this.conversationHistory.push(`USER: ${context.userPrompt}`);
        }
        if (context.aiResponse) {
            this.conversationHistory.push(`AI: ${context.aiResponse}`);
        }
        // Check cache for recent analysis
        const cacheKey = this.generateCacheKey(context);
        if (this.analysisCache.has(cacheKey)) {
            return this.analysisCache.get(cacheKey);
        }
        // Run ARIA analysis for conversation patterns
        const ariaAnalysis = this.aria.analyzeConversation(this.conversationHistory, context.aiResponse);
        // Detect all bias patterns
        const patterns = this.detectAllPatterns(context, ariaAnalysis);
        // Calculate scores and health
        const biasScore = this.calculateBiasScore(patterns, ariaAnalysis);
        const health = this.calculateSystemHealth(patterns, ariaAnalysis);
        // Generate actions
        const { immediateActions, preventiveActions } = this.generateActions(patterns, ariaAnalysis);
        // Context warning
        const contextWarning = this.generateContextWarning(context);
        const result = {
            hasBias: patterns.length > 0 || biasScore > 0.3,
            biasScore,
            confidence: this.calculateConfidence(patterns, ariaAnalysis),
            patterns,
            health,
            immediateActions,
            preventiveActions,
            contextWarning
        };
        // Cache result
        this.analysisCache.set(cacheKey, result);
        this.lastAnalysis = result;
        // Cleanup old cache entries
        if (this.analysisCache.size > 20) {
            const firstKey = this.analysisCache.keys().next().value;
            if (firstKey) {
                this.analysisCache.delete(firstKey);
            }
        }
        return result;
    }
    /**
     * 🔍 DETECT ALL BIAS PATTERNS
     * Unified pattern detection combining all proven methods
     */
    detectAllPatterns(context, ariaAnalysis) {
        const patterns = [];
        const response = context.aiResponse || '';
        const lowerResponse = response.toLowerCase();
        // 1. SUCCESS DECLARATION BIAS
        if (this.detectSuccessDeclaration(lowerResponse)) {
            patterns.push({
                type: 'success-declaration',
                severity: 'high',
                confidence: 0.9,
                description: 'AI declaring victory before user confirmation',
                intervention: '⚠️ HOLD: Wait for user verification before declaring success',
                location: 'ai-response'
            });
        }
        // 2. TERMINAL WORSHIP BIAS
        if (this.detectTerminalWorship(lowerResponse)) {
            patterns.push({
                type: 'terminal-worship',
                severity: 'medium',
                confidence: 0.8,
                description: 'Over-reliance on logs vs actual user experience',
                intervention: '💡 VERIFY: Check actual user experience, not just terminal output',
                location: 'ai-response'
            });
        }
        // 3. PATTERN BLINDNESS (from ARIA)
        ariaAnalysis.risks.forEach(risk => {
            if (risk.type === 'neural_howlround') {
                patterns.push({
                    type: 'pattern-blindness',
                    severity: risk.level,
                    confidence: risk.confidence,
                    description: risk.description,
                    intervention: '🔄 CHALLENGE: ' + risk.recommendation,
                    location: 'conversation-flow'
                });
            }
        });
        // 4. PLANNING FALLACY
        if (/phase \d+|roadmap|timeline|sprint/i.test(response)) {
            patterns.push({
                type: 'planning-fallacy',
                severity: 'medium',
                confidence: 0.85,
                description: 'Timeline language detected - planning fallacy risk',
                intervention: '📅 SIMPLIFY: Remove timeline language, focus on immediate next step',
                location: 'ai-response'
            });
        }
        // 5. FEATURE CREEP
        if (/comprehensive|framework|system|enterprise/i.test(response)) {
            patterns.push({
                type: 'feature-creep',
                severity: 'medium',
                confidence: 0.75,
                description: 'Complexity inflation detected',
                intervention: '🎯 FOCUS: Simplify approach, solve one problem at a time',
                location: 'ai-response'
            });
        }
        // 6. AUTHORITY BIAS
        if (/standards|enforcement|approval|mandatory/i.test(response)) {
            patterns.push({
                type: 'authority-bias',
                severity: 'low',
                confidence: 0.7,
                description: 'Authoritative language detected',
                intervention: '💬 SOFTEN: Use suggestion language instead of mandates',
                location: 'ai-response'
            });
        }
        return patterns;
    }
    /**
     * 🧮 CALCULATE BIAS SCORE
     * Unified scoring algorithm
     */
    calculateBiasScore(patterns, ariaAnalysis) {
        let score = 0;
        // Pattern-based scoring
        patterns.forEach(pattern => {
            const severityWeights = { low: 0.1, medium: 0.3, high: 0.6, critical: 1.0 };
            score += severityWeights[pattern.severity] * pattern.confidence;
        });
        // ARIA-based scoring
        score += ariaAnalysis.repetitionScore * 0.4;
        // Conversation length penalty
        if (this.conversationHistory.length > 20) {
            score += 0.2;
        }
        return Math.min(1.0, score);
    }
    /**
     * 🏥 CALCULATE SYSTEM HEALTH
     */
    calculateSystemHealth(patterns, ariaAnalysis) {
        const criticalPatterns = patterns.filter(p => p.severity === 'critical').length;
        const highPatterns = patterns.filter(p => p.severity === 'high').length;
        const aiReliability = Math.max(0, 1 - (criticalPatterns * 0.5 + highPatterns * 0.3));
        const conversationFlow = Math.max(0, 1 - ariaAnalysis.repetitionScore);
        const solutionEffectiveness = ariaAnalysis.solutionVariation;
        return {
            aiReliability,
            conversationFlow,
            solutionEffectiveness
        };
    }
    /**
     * 🎬 GENERATE ACTIONS
     */
    generateActions(patterns, ariaAnalysis) {
        const immediateActions = [];
        const preventiveActions = [];
        // Pattern-based actions
        patterns.forEach(pattern => {
            immediateActions.push(pattern.intervention);
            // Generate preventive action
            switch (pattern.type) {
                case 'success-declaration':
                    preventiveActions.push('Always ask "Does this work as expected?" instead of declaring success');
                    break;
                case 'terminal-worship':
                    preventiveActions.push('Include user experience validation in all solutions');
                    break;
                case 'pattern-blindness':
                    preventiveActions.push('Regularly challenge current approach with alternatives');
                    break;
                case 'planning-fallacy':
                    preventiveActions.push('Focus on immediate next steps, avoid long-term planning');
                    break;
                case 'feature-creep':
                    preventiveActions.push('Start with minimal viable solution, iterate');
                    break;
                case 'authority-bias':
                    preventiveActions.push('Use collaborative language, avoid mandates');
                    break;
            }
        });
        // ARIA-based actions
        if (ariaAnalysis.interventionRequired) {
            const interventions = this.aria.generateInterventions(ariaAnalysis);
            interventions.forEach(intervention => {
                immediateActions.push('🧠 ARIA: ' + intervention.message);
            });
        }
        return {
            immediateActions: [...new Set(immediateActions)],
            preventiveActions: [...new Set(preventiveActions)]
        };
    }
    /**
     * 🚨 GENERATE CONTEXT WARNING
     */
    generateContextWarning(context) {
        const response = context.aiResponse || '';
        const words = response.split(' ').length;
        if (words > 200) {
            return '📊 CONTEXT-HEAVY: Response too long, may waste context window';
        }
        else if (words > 100) {
            return '📈 CONTEXT-WATCH: Monitor response length';
        }
        return undefined;
    }
    /**
     * 🔧 HELPER METHODS
     */
    detectSuccessDeclaration(text) {
        return /mission accomplished|success|resolved|working|fixed|complete|ready to deploy|problem solved/i.test(text);
    }
    detectTerminalWorship(text) {
        return /terminal shows|server logs|compilation successful|build passes|curl response|no errors in terminal/i.test(text);
    }
    calculateConfidence(patterns, ariaAnalysis) {
        if (patterns.length === 0)
            return 0.95; // High confidence in "no bias"
        const avgPatternConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
        const ariaConfidence = ariaAnalysis.risks.length > 0 ?
            ariaAnalysis.risks.reduce((sum, r) => sum + r.confidence, 0) / ariaAnalysis.risks.length : 1;
        return (avgPatternConfidence + ariaConfidence) / 2;
    }
    generateCacheKey(context) {
        const key = [
            context.aiResponse?.slice(0, 50) || '',
            context.userPrompt?.slice(0, 30) || '',
            this.conversationHistory.length.toString()
        ].join('|');
        return btoa(key).slice(0, 20); // Simple hash
    }
    /**
     * 📊 GET FORMATTED RESULT
     * For easy display in UI/extension
     */
    getFormattedResult() {
        if (!this.lastAnalysis)
            return 'No analysis available';
        const { biasScore, patterns, contextWarning } = this.lastAnalysis;
        const level = biasScore < 0.3 ? '🟢 GOOD' : biasScore < 0.6 ? '🟡 BIAS' : '🔴 FIX';
        const score = Math.round(biasScore * 100);
        let result = `[BiasGuard] ${level} (${score}%)`;
        if (contextWarning)
            result += ` ${contextWarning}`;
        if (patterns.length > 0) {
            const issues = patterns.map(p => p.intervention).join(' | ');
            result += `\n${issues}`;
        }
        return result;
    }
    /**
     * 🧹 CLEANUP
     */
    dispose() {
        this.analysisCache.clear();
        this.conversationHistory = [];
        this.lastAnalysis = undefined;
    }
}
exports.UnifiedBiasGuard = UnifiedBiasGuard;
//# sourceMappingURL=unified-biasguard.js.map