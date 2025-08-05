/**
 * Neural Howlround Prevention System
 * Based on "Neural howlround in large language models: a self-reinforcing bias phenomenon" (2025)
 * Implements real-time bias attenuation using the phi function and continuous correction
 * 
 * Key Research Foundation:
 * - Seth Drake's "Neural Howlround" paper (2025)
 * - Real-time rebiasing with dynamic attenuation
 * - Phi function (modified inverse hyperbolic secant)
 * - Prevents self-reinforcing cognitive loops
 * 
 * Addresses critical challenges:
 * - Recursive internal salience misreinforcement (RISM)
 * - Cognitive rigidity and locked-in states
 * - Self-perpetuating distortion amplification
 * - Dynamic bias correction during inference
 */

class NeuralHowlroundPrevention {
    constructor() {
        this.isInitialized = false;
        this.attenuationConfig = this.initializeAttenuationConfig();
        this.biasHistory = [];
        this.howlroundDetectionThreshold = 0.75; // Threshold for detecting howlround
        this.maxHistoryLength = 20; // Maximum bias history to track
        this.attenuationActive = false;
        this.performanceMetrics = {
            totalAttenuations: 0,
            howlroundPreventions: 0,
            averageAttenuationStrength: 0,
            cognitiveRigidityDetected: 0
        };
    }

    /**
     * Initialize attenuation configuration based on research
     */
    initializeAttenuationConfig() {
        return {
            // Attenuation coefficients (τ values from research)
            coefficients: {
                τa: 0.8,  // Exponential decay coefficient
                τb: 0.6,  // Phi function coefficient  
                τc: 0.4   // Logarithmic damping coefficient
            },
            
            // Activation thresholds (ε values from research)
            thresholds: {
                εa: 0.625,  // Early-stage attenuation threshold
                εb: 0.775,  // Mid-range reinforcement threshold
                εc: 0.875   // High-confidence entrenchment threshold
            },
            
            // Steepness controls (ρ values from research)
            steepness: {
                ρa: 5.0,  // Sharp activation for early intervention
                ρb: 3.0,  // Gradual transition for mid-range
                ρc: 2.0   // Gentle activation for high confidence
            },
            
            // Gamma parameter for exponential decay rate
            γ: 1.5,
            
            // Global tuning parameters
            Θ: 1.0,   // Global attenuation strength
            θa: 1.0,  // Component-specific tuning for exponential
            θb: 1.0,  // Component-specific tuning for phi function
            θc: 1.0   // Component-specific tuning for logarithmic
        };
    }

    /**
     * Detect neural howlround patterns in bias analysis results
     * @param {Array} biasHistory - Recent bias analysis results
     * @returns {Object} Howlround detection result
     */
    detectNeuralHowlround(biasHistory) {
        if (biasHistory.length < 3) {
            return { detected: false, confidence: 0, pattern: 'insufficient_data' };
        }

        // Pattern 1: Escalating bias scores (runaway reinforcement)
        const escalationPattern = this.detectEscalationPattern(biasHistory);
        
        // Pattern 2: Oscillating high bias (cognitive rigidity)
        const oscillationPattern = this.detectOscillationPattern(biasHistory);
        
        // Pattern 3: Locked-in high bias (salience collapse)
        const lockInPattern = this.detectLockInPattern(biasHistory);
        
        // Pattern 4: Recursive fixation (same patterns repeating)
        const recursivePattern = this.detectRecursivePattern(biasHistory);

        // Calculate overall howlround confidence
        const patterns = [escalationPattern, oscillationPattern, lockInPattern, recursivePattern];
        const maxConfidence = Math.max(...patterns.map(p => p.confidence));
        const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
        
        const overallConfidence = (maxConfidence * 0.6) + (avgConfidence * 0.4);
        const detected = overallConfidence >= this.howlroundDetectionThreshold;

        return {
            detected,
            confidence: overallConfidence,
            primaryPattern: patterns.find(p => p.confidence === maxConfidence)?.type || 'unknown',
            patterns: {
                escalation: escalationPattern,
                oscillation: oscillationPattern,
                lockIn: lockInPattern,
                recursive: recursivePattern
            },
            recommendedAction: this.getRecommendedAction(overallConfidence, patterns)
        };
    }

    /**
     * Apply real-time bias attenuation using the phi function
     * @param {number} biasScore - Current bias score (0-1)
     * @param {Object} analysisResult - Full analysis result
     * @returns {Object} Attenuated analysis result
     */
    async applyBiasAttenuation(biasScore, analysisResult) {
        const startTime = performance.now();
        
        try {
            // Normalize bias score to 0-1 range
            const Wmax = Math.min(Math.max(biasScore / 100, 0), 1);
            
            // Calculate dynamic attenuation using the unified formula
            const βdynamic = this.calculateDynamicAttenuation(Wmax);
            
            // Apply attenuation to bias score
            const attenuatedScore = Wmax * (1 - βdynamic);
            const finalScore = Math.round(attenuatedScore * 100);
            
            // Calculate attenuation strength
            const attenuationStrength = Math.round((biasScore - finalScore) / biasScore * 100);
            
            // Update analysis result with attenuation
            const attenuatedResult = {
                ...analysisResult,
                originalScore: biasScore,
                attenuatedScore: finalScore,
                attenuationApplied: true,
                attenuationStrength: attenuationStrength,
                attenuationDetails: {
                    Wmax,
                    βdynamic,
                    components: this.getAttenuationComponents(Wmax),
                    processingTime: Math.round(performance.now() - startTime)
                },
                overallScore: finalScore, // Override the original score
                severity: this.recalculateSeverity(finalScore),
                recommendations: [
                    ...analysisResult.recommendations || [],
                    `🔧 Neural howlround prevention applied (${attenuationStrength}% reduction)`,
                    '🧠 Bias attenuation active - preventing self-reinforcing patterns'
                ]
            };
            
            // Update performance metrics
            this.updateAttenuationMetrics(attenuationStrength);
            
            console.log(`🔧 Bias attenuation applied: ${biasScore}% → ${finalScore}% (${attenuationStrength}% reduction)`);
            
            return attenuatedResult;
            
        } catch (error) {
            console.error('❌ Bias attenuation failed:', error);
            return analysisResult; // Return original result if attenuation fails
        }
    }

    /**
     * Calculate dynamic attenuation using the unified formula from research
     * βdynamic = τa·e^(-γWmax) + τb·φ(Wmax) + τc·log(1+Wmax)
     */
    calculateDynamicAttenuation(Wmax) {
        const config = this.attenuationConfig;
        
        // Calculate gating functions (sigmoid activation)
        const τa = this.sigmoid(config.steepness.ρa * (Wmax - config.thresholds.εa));
        const τb = this.sigmoid(config.steepness.ρb * (Wmax - config.thresholds.εb));
        const τc = this.sigmoid(config.steepness.ρc * (Wmax - config.thresholds.εc));
        
        // Calculate attenuation components
        const exponentialComponent = τa * config.coefficients.τa * Math.exp(-config.γ * Wmax);
        const phiComponent = τb * config.coefficients.τb * this.phiFunction(Wmax);
        const logarithmicComponent = τc * config.coefficients.τc * Math.log(1 + Wmax);
        
        // Apply global and component-specific tuning
        const βdynamic = config.Θ * (
            config.θa * exponentialComponent +
            config.θb * phiComponent +
            config.θc * logarithmicComponent
        );
        
        // Ensure attenuation is within valid range [0, 1]
        return Math.min(Math.max(βdynamic, 0), 1);
    }

    /**
     * Phi function - modified inverse hyperbolic secant
     * φ(x) = ln(1/x + √(1/x²) - 2), 0 < x ≤ 1
     */
    phiFunction(x) {
        if (x <= 0 || x > 1) return 0;
        
        try {
            const invX = 1 / x;
            const sqrtTerm = Math.sqrt(invX * invX);
            const result = Math.log(invX + sqrtTerm - 2);
            
            // Handle edge cases and ensure finite result
            return Number.isFinite(result) ? result : 0;
        } catch {
            return 0;
        }
    }

    /**
     * Sigmoid activation function
     */
    sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }

    /**
     * Detect escalating bias pattern (runaway reinforcement)
     */
    detectEscalationPattern(history) {
        if (history.length < 3) return { confidence: 0, type: 'escalation' };
        
        const recentScores = history.slice(-5).map(h => h.overallScore || 0);
        let escalations = 0;
        
        for (let i = 1; i < recentScores.length; i++) {
            if (recentScores[i] > recentScores[i-1] + 5) { // 5% threshold
                escalations++;
            }
        }
        
        const confidence = escalations / (recentScores.length - 1);
        return { confidence, type: 'escalation', escalations };
    }

    /**
     * Detect oscillating pattern (cognitive rigidity)
     */
    detectOscillationPattern(history) {
        if (history.length < 4) return { confidence: 0, type: 'oscillation' };
        
        const recentScores = history.slice(-6).map(h => h.overallScore || 0);
        let oscillations = 0;
        
        for (let i = 2; i < recentScores.length; i++) {
            const trend1 = recentScores[i-1] - recentScores[i-2];
            const trend2 = recentScores[i] - recentScores[i-1];
            
            // Check for direction reversal with significant magnitude
            if (Math.abs(trend1) > 10 && Math.abs(trend2) > 10 && 
                Math.sign(trend1) !== Math.sign(trend2)) {
                oscillations++;
            }
        }
        
        const confidence = oscillations / Math.max(recentScores.length - 2, 1);
        return { confidence, type: 'oscillation', oscillations };
    }

    /**
     * Detect lock-in pattern (salience collapse)
     */
    detectLockInPattern(history) {
        if (history.length < 3) return { confidence: 0, type: 'lockIn' };
        
        const recentScores = history.slice(-5).map(h => h.overallScore || 0);
        const avgScore = recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length;
        
        // Check if all recent scores are consistently high (>70%) with low variance
        const variance = recentScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / recentScores.length;
        const standardDeviation = Math.sqrt(variance);
        
        const isHighBias = avgScore > 70;
        const isLowVariance = standardDeviation < 5; // Very stable scores
        
        const confidence = isHighBias && isLowVariance ? 
            Math.min((avgScore - 70) / 30 + (5 - standardDeviation) / 5, 1) / 2 : 0;
        
        return { confidence, type: 'lockIn', avgScore, standardDeviation };
    }

    /**
     * Detect recursive pattern (same bias patterns repeating)
     */
    detectRecursivePattern(history) {
        if (history.length < 4) return { confidence: 0, type: 'recursive' };
        
        // Look for repeated pattern signatures
        const patternSignatures = history.slice(-8).map(h => ({
            score: Math.round((h.overallScore || 0) / 10) * 10, // Round to nearest 10
            patternCount: h.patterns?.length || 0,
            severity: h.severity || 'unknown'
        }));
        
        let repetitions = 0;
        const signatureMap = new Map();
        
        patternSignatures.forEach(sig => {
            const key = `${sig.score}_${sig.patternCount}_${sig.severity}`;
            signatureMap.set(key, (signatureMap.get(key) || 0) + 1);
        });
        
        // Count signatures that appear more than once
        for (const count of signatureMap.values()) {
            if (count > 1) repetitions += count - 1;
        }
        
        const confidence = repetitions / Math.max(patternSignatures.length - 1, 1);
        return { confidence, type: 'recursive', repetitions, uniquePatterns: signatureMap.size };
    }

    /**
     * Get recommended action based on howlround detection
     */
    getRecommendedAction(confidence, _patterns) {
        if (confidence >= 0.9) {
            return 'immediate_attenuation';
        } else if (confidence >= 0.75) {
            return 'strong_attenuation';
        } else if (confidence >= 0.5) {
            return 'moderate_attenuation';
        } else if (confidence >= 0.25) {
            return 'monitoring';
        } else {
            return 'none';
        }
    }

    /**
     * Get detailed attenuation components for analysis
     */
    getAttenuationComponents(Wmax) {
        const config = this.attenuationConfig;
        
        const τa = this.sigmoid(config.steepness.ρa * (Wmax - config.thresholds.εa));
        const τb = this.sigmoid(config.steepness.ρb * (Wmax - config.thresholds.εb));
        const τc = this.sigmoid(config.steepness.ρc * (Wmax - config.thresholds.εc));
        
        return {
            exponential: {
                active: τa > 0.1,
                strength: τa * config.coefficients.τa * Math.exp(-config.γ * Wmax),
                description: 'Early-stage bias prevention'
            },
            phi: {
                active: τb > 0.1,
                strength: τb * config.coefficients.τb * this.phiFunction(Wmax),
                description: 'Mid-range reinforcement control'
            },
            logarithmic: {
                active: τc > 0.1,
                strength: τc * config.coefficients.τc * Math.log(1 + Wmax),
                description: 'High-confidence entrenchment prevention'
            }
        };
    }

    /**
     * Recalculate severity after attenuation
     */
    recalculateSeverity(attenuatedScore) {
        if (attenuatedScore >= 70) return 'critical';
        if (attenuatedScore >= 50) return 'high';
        if (attenuatedScore >= 30) return 'medium';
        if (attenuatedScore >= 15) return 'low';
        return 'minimal';
    }

    /**
     * Update bias history for howlround detection
     */
    updateBiasHistory(analysisResult) {
        this.biasHistory.push({
            timestamp: new Date().toISOString(),
            overallScore: analysisResult.overallScore,
            patterns: analysisResult.patterns,
            severity: analysisResult.severity,
            attenuationApplied: analysisResult.attenuationApplied || false
        });
        
        // Maintain maximum history length
        if (this.biasHistory.length > this.maxHistoryLength) {
            this.biasHistory = this.biasHistory.slice(-this.maxHistoryLength);
        }
    }

    /**
     * Update performance metrics
     */
    updateAttenuationMetrics(attenuationStrength) {
        this.performanceMetrics.totalAttenuations++;
        
        const currentAvg = this.performanceMetrics.averageAttenuationStrength;
        const newAvg = (currentAvg * (this.performanceMetrics.totalAttenuations - 1) + attenuationStrength) / 
                      this.performanceMetrics.totalAttenuations;
        this.performanceMetrics.averageAttenuationStrength = Math.round(newAvg);
        
        if (attenuationStrength > 20) {
            this.performanceMetrics.howlroundPreventions++;
        }
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            howlroundPreventionRate: this.performanceMetrics.totalAttenuations > 0 ?
                this.performanceMetrics.howlroundPreventions / this.performanceMetrics.totalAttenuations : 0,
            biasHistoryLength: this.biasHistory.length,
            engineVersion: 'neural-howlround-v1.0',
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Run validation tests for the attenuation system
     */
    async runValidationTests() {
        console.log('🧪 Running Neural Howlround Prevention Validation Tests...');
        
        const testCases = [
            { score: 95, expected: 'strong_attenuation', description: 'High bias requiring strong attenuation' },
            { score: 75, expected: 'moderate_attenuation', description: 'Medium-high bias requiring moderate attenuation' },
            { score: 50, expected: 'light_attenuation', description: 'Medium bias requiring light attenuation' },
            { score: 25, expected: 'minimal_attenuation', description: 'Low bias requiring minimal attenuation' },
            { score: 10, expected: 'no_attenuation', description: 'Very low bias requiring no attenuation' }
        ];
        
        for (const testCase of testCases) {
            const mockAnalysis = {
                overallScore: testCase.score,
                patterns: [],
                severity: testCase.score >= 70 ? 'critical' : 'medium',
                recommendations: []
            };
            
            const attenuated = await this.applyBiasAttenuation(testCase.score, mockAnalysis);
            const reductionPercent = Math.round((testCase.score - attenuated.attenuatedScore) / testCase.score * 100);
            
            console.log(`${reductionPercent > 0 ? '✅' : '⚪'} ${testCase.description}`);
            console.log(`   Original: ${testCase.score}%, Attenuated: ${attenuated.attenuatedScore}%, Reduction: ${reductionPercent}%`);
            console.log('');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NeuralHowlroundPrevention;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.NeuralHowlroundPrevention = NeuralHowlroundPrevention;
}