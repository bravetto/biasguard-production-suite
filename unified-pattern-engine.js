/**
 * Unified Multi-Layer Pattern Detection Engine
 * Consolidates all three bias detection engines with consistent scoring methodology
 * Based on expert research and IBM Individual Fairness framework
 * 
 * Addresses critical findings:
 * - Inconsistent scoring across three engine implementations
 * - Pattern matching limited to abstract keywords only
 * - No multi-layer detection (specific + sentiment + context)
 */

class UnifiedPatternEngine {
    constructor() {
        this.isInitialized = false;
        this.patterns = this.initializeUnifiedPatterns();
        this.scoringConfig = this.initializeScoringConfig();
        this.performanceMetrics = {
            totalAnalyses: 0,
            averageProcessingTime: 0,
            accuracyScore: 0,
            criticalBiasDetected: 0
        };
    }

    /**
     * Initialize unified pattern system with multi-layer detection
     * Based on expert validation from IBM Individual Fairness research
     */
    initializeUnifiedPatterns() {
        return {
            // LAYER 1: Abstract Keywords (Policy Language)
            abstract: {
                keywords: [
                    'age', 'gender', 'race', 'ethnicity', 'religion', 'nationality',
                    'sexual orientation', 'disability', 'veteran status', 'marital status',
                    'pregnancy', 'genetic information', 'political affiliation', 'socioeconomic',
                    'income', 'education', 'geographic', 'cultural', 'linguistic'
                ],
                weight: 0.25,
                description: 'Abstract demographic and protected class identifiers'
            },

            // LAYER 2: Specific Identifiers (Critical Addition - Enhanced 2024 Research)
            specific: {
                identifiers: [
                    // Racial/Ethnic identifiers (Enhanced based on Hidden Bias Benchmark research)
                    'white people', 'black people', 'african americans', 'hispanic people',
                    'latino people', 'asian people', 'native americans', 'caucasians',
                    'minorities', 'whites', 'blacks', 'hispanics', 'asians', 'natives',
                    'immigrants', 'foreigners', 'refugees', 'citizens', 'illegals', 'aliens',
                    'people of color', 'poc', 'bipoc', 'indigenous people', 'first nations',
                    'arab people', 'middle eastern', 'indian people', 'chinese people',
                    'japanese people', 'korean people', 'vietnamese people', 'mexican people',
                    'european people', 'african people', 'american people',
                    
                    // Gender identifiers (Enhanced with intersectional patterns)
                    'men', 'women', 'males', 'females', 'boys', 'girls', 'guys', 'ladies',
                    'gentlemen', 'transgender', 'non-binary', 'lgbtq', 'gay', 'lesbian',
                    'straight', 'heterosexual', 'homosexual', 'queer', 'bisexual',
                    'trans women', 'trans men', 'cisgender', 'cis women', 'cis men',
                    'gender fluid', 'gender non-conforming', 'two-spirit',
                    
                    // Religious identifiers (Expanded based on bias research)
                    'muslims', 'christians', 'jews', 'hindus', 'buddhists', 'atheists',
                    'catholics', 'protestants', 'evangelicals', 'orthodox', 'mormons',
                    'jehovah witnesses', 'sikhs', 'jains', 'zoroastrians', 'pagans',
                    'secular people', 'non-religious', 'agnostics', 'believers', 'faithful',
                    
                    // Age identifiers (Enhanced with adultification bias patterns)
                    'elderly', 'seniors', 'teenagers', 'millennials', 'boomers', 'gen z',
                    'young people', 'old people', 'middle-aged', 'children', 'kids',
                    'adolescents', 'toddlers', 'infants', 'minors', 'adults',
                    'young adults', 'older adults', 'senior citizens', 'retirees',
                    
                    // Socioeconomic identifiers (Expanded based on equity research)
                    'poor people', 'rich people', 'wealthy', 'homeless', 'working class',
                    'middle class', 'upper class', 'blue collar', 'white collar',
                    'low income', 'high income', 'privileged', 'underprivileged',
                    'disadvantaged', 'elite', 'bourgeois', 'proletariat', 'underclass',
                    'welfare recipients', 'taxpayers', 'unemployed', 'jobless',
                    
                    // Ability/Disability identifiers (New category based on 2024 research)
                    'disabled people', 'people with disabilities', 'handicapped',
                    'able-bodied', 'neurotypical', 'neurodivergent', 'autistic people',
                    'mentally ill', 'physically disabled', 'visually impaired', 'deaf people',
                    'hearing impaired', 'wheelchair users', 'amputees',
                    
                    // Geographic/Cultural identifiers (Enhanced)
                    'urban people', 'rural people', 'city dwellers', 'country people',
                    'suburban people', 'northerners', 'southerners', 'coastal elites',
                    'midwest people', 'west coast people', 'east coast people',
                    'small town people', 'big city people', 'inner city people'
                ],
                weight: 0.45, // Increased weight based on research showing higher impact
                description: 'Specific demographic group identifiers with intersectional patterns'
            },

            // LAYER 3: Negative Sentiment Terms (Enhanced based on 2024 research)
            sentiment: {
                negative: [
                    // Direct negative terms (from original research)
                    'suck', 'sucks', 'terrible', 'awful', 'horrible', 'disgusting',
                    'inferior', 'worthless', 'useless', 'stupid', 'dumb', 'idiotic',
                    'bad', 'worse', 'worst', 'hate', 'despise', 'loathe', 'detest',
                    
                    // Threat/danger terms (enhanced based on adultification bias research)
                    'dangerous', 'threatening', 'violent', 'aggressive', 'criminal',
                    'menacing', 'hostile', 'intimidating', 'scary', 'frightening',
                    'predatory', 'suspicious', 'sketchy', 'shady', 'risky',
                    
                    // Character defamation terms (from hidden bias benchmark research)
                    'lazy', 'incompetent', 'untrustworthy', 'dishonest', 'corrupt',
                    'unreliable', 'irresponsible', 'unprofessional', 'unqualified',
                    'inadequate', 'deficient', 'flawed', 'broken', 'damaged',
                    
                    // Purity/cleanliness bias terms (cultural bias indicators)
                    'dirty', 'filthy', 'unclean', 'impure', 'contaminated', 'tainted',
                    'polluted', 'infected', 'diseased', 'sick', 'unhealthy',
                    
                    // Civilization hierarchy terms (from demographic instruction research)
                    'savage', 'barbaric', 'primitive', 'backward', 'uncivilized',
                    'undeveloped', 'unsophisticated', 'crude', 'rough', 'wild',
                    
                    // Economic/social status terms (from equity research)
                    'cheap', 'trashy', 'ghetto', 'low-class', 'common', 'vulgar',
                    'tacky', 'sleazy', 'seedy', 'sketchy', 'dodgy',
                    
                    // Intelligence/capability terms (enhanced patterns)
                    'ignorant', 'uneducated', 'illiterate', 'clueless', 'dense',
                    'slow', 'simple', 'basic', 'limited', 'restricted', 'constrained'
                ],
                positive: [
                    // Positive terms that can create bias through contrast
                    'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
                    'superior', 'better', 'best', 'love', 'adore', 'respect',
                    'safe', 'peaceful', 'gentle', 'kind', 'honest', 'trustworthy',
                    'hardworking', 'competent', 'intelligent', 'smart', 'brilliant',
                    
                    // Purity/cleanliness positive terms
                    'clean', 'pure', 'pristine', 'spotless', 'immaculate',
                    'refined', 'polished', 'sophisticated', 'elegant', 'classy',
                    
                    // Civilization positive terms
                    'civilized', 'advanced', 'progressive', 'developed', 'modern',
                    'sophisticated', 'cultured', 'educated', 'enlightened',
                    
                    // Economic/social positive terms
                    'wealthy', 'successful', 'accomplished', 'prestigious', 'elite',
                    'high-class', 'upscale', 'premium', 'exclusive', 'privileged'
                ],
                weight: 0.25, // Increased weight based on sentiment amplification research
                description: 'Sentiment terms that amplify bias when combined with identifiers'
            },

            // LAYER 4: Context Amplifiers (Enhanced based on multi-hop QA research)
            context: {
                amplifiers: [
                    // Quantifier amplifiers (original + enhanced)
                    'all', 'every', 'most', 'many', 'some', 'few', 'never', 'always',
                    'none', 'no', 'any', 'each', 'several', 'numerous', 'countless',
                    'majority', 'minority', 'everyone', 'nobody', 'somebody', 'anybody',
                    
                    // Frequency amplifiers (enhanced patterns)
                    'typically', 'usually', 'generally', 'commonly', 'often', 'rarely',
                    'frequently', 'occasionally', 'sometimes', 'seldom', 'constantly',
                    'repeatedly', 'consistently', 'regularly', 'habitually', 'routinely',
                    
                    // Tendency amplifiers (from bias research)
                    'tend to', 'likely to', 'prone to', 'known for', 'famous for',
                    'inclined to', 'apt to', 'bound to', 'destined to', 'expected to',
                    'supposed to', 'meant to', 'designed to', 'built to', 'made to',
                    
                    // Inherency amplifiers (critical for bias detection)
                    'naturally', 'inherently', 'genetically', 'biologically', 'culturally',
                    'instinctively', 'innately', 'fundamentally', 'essentially', 'basically',
                    'intrinsically', 'by nature', 'born to', 'bred to', 'raised to',
                    
                    // Modal amplifiers (from linguistic bias research)
                    'should', 'shouldn\'t', 'must', 'mustn\'t', 'can\'t', 'cannot',
                    'will', 'won\'t', 'would', 'wouldn\'t', 'could', 'couldn\'t',
                    'might', 'may', 'shall', 'ought to', 'have to', 'need to',
                    
                    // Causal amplifiers (new category from 2024 research)
                    'because', 'since', 'due to', 'owing to', 'thanks to', 'as a result',
                    'consequently', 'therefore', 'thus', 'hence', 'so', 'leads to',
                    'causes', 'results in', 'brings about', 'creates', 'produces',
                    
                    // Comparative amplifiers (enhanced for bias detection)
                    'more than', 'less than', 'better than', 'worse than', 'unlike',
                    'compared to', 'in contrast to', 'as opposed to', 'rather than',
                    'instead of', 'different from', 'similar to', 'just like'
                ],
                weight: 0.20, // Increased weight based on context amplification research
                description: 'Context terms that amplify bias strength and create generalizations'
            }
        };
    }

    /**
     * Initialize unified scoring configuration
     * Addresses inconsistent scoring across engines
     */
    initializeScoringConfig() {
        return {
            // Base scoring weights (updated based on 2024 research)
            layerWeights: {
                abstract: 0.20,      // Reduced - less reliable indicator
                specific: 0.45,      // Increased - most critical for detection
                sentiment: 0.25,     // Increased - stronger amplification effect
                context: 0.20        // Increased - significant bias amplifier
            },
            
            // Combination bonuses (enhanced based on multi-layer research)
            combinationBonuses: {
                specific_sentiment: 0.40,      // "white people suck" - increased for critical cases
                specific_context: 0.30,        // "all women are..." - enhanced generalization detection
                sentiment_context: 0.25,       // "always terrible" - stronger sentiment amplification
                abstract_specific: 0.15,       // New: "race + white people" combinations
                abstract_sentiment: 0.10,      // New: "gender + terrible" combinations
                abstract_context: 0.10,        // New: "age + always" combinations
                triple_combination: 0.60,      // Increased - all three layers present
                quad_combination: 0.80         // New: all four layers present (maximum bias)
            },
            
            // Severity mapping
            severityThresholds: {
                critical: 0.70,  // 70%+ bias score
                high: 0.50,      // 50-69% bias score
                medium: 0.30,    // 30-49% bias score
                low: 0.15        // 15-29% bias score
            },
            
            // Dynamic severity mapping based on pattern interaction
            dynamicWeighting: true,
            
            // Context-aware weighting
            contextAwareWeighting: true
        };
    }

    /**
     * Unified analysis method that works across all engines
     * @param {string} text - Text to analyze
     * @param {Object} options - Analysis options
     * @returns {Object} Unified analysis result
     */
    async analyzeUnified(text, _options = {}) {
        const startTime = performance.now();
        const analysisId = `unified_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
            // Preprocess text
            const preprocessed = this.preprocessText(text);
            
            // Multi-layer pattern detection
            const layerResults = await this.detectMultiLayerPatterns(preprocessed);
            
            // Calculate unified bias score
            const biasScore = this.calculateUnifiedScore(layerResults);
            
            // Determine severity and risk level
            const severity = this.determineSeverity(biasScore);
            const riskLevel = this.calculateRiskLevel(biasScore);
            
            // Generate recommendations
            const recommendations = this.generateUnifiedRecommendations(layerResults, severity);
            
            // Create analysis result
            const analysisResult = {
                analysisId,
                overallScore: Math.round(biasScore * 100),
                severity: severity.level,
                riskLevel,
                patterns: layerResults.detectedPatterns,
                layerBreakdown: layerResults.layerScores,
                recommendations,
                metadata: {
                    processingTime: Math.round(performance.now() - startTime),
                    timestamp: new Date().toISOString(),
                    textLength: text.length,
                    patternsDetected: layerResults.totalPatterns,
                    engineVersion: 'unified-v1.0'
                }
            };
            
            // Update performance metrics
            this.updatePerformanceMetrics(analysisResult);
            
            return analysisResult;
            
        } catch (error) {
            console.error('Unified analysis failed:', error);
            return {
                analysisId,
                error: error.message,
                overallScore: 0,
                severity: 'unknown',
                patterns: [],
                recommendations: [],
                metadata: {
                    processingTime: Math.round(performance.now() - startTime),
                    timestamp: new Date().toISOString(),
                    error: true
                }
            };
        }
    }

    /**
     * Preprocess text for unified analysis
     */
    preprocessText(text) {
        const normalized = text.toLowerCase().trim();
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = normalized.split(/\s+/).filter(w => w.length > 0);
        
        return {
            original: text,
            normalized,
            sentences,
            words,
            wordCount: words.length,
            sentenceCount: sentences.length
        };
    }

    /**
     * Multi-layer pattern detection - core improvement
     */
    async detectMultiLayerPatterns(preprocessed) {
        const layerScores = {};
        const detectedPatterns = [];
        let totalPatterns = 0;
        
        // LAYER 1: Abstract Keywords
        const abstractMatches = this.detectAbstractPatterns(preprocessed);
        layerScores.abstract = abstractMatches.score;
        if (abstractMatches.matches.length > 0) {
            detectedPatterns.push({
                type: 'abstract',
                matches: abstractMatches.matches,
                score: abstractMatches.score,
                description: 'Abstract demographic identifiers detected'
            });
            totalPatterns += abstractMatches.matches.length;
        }
        
        // LAYER 2: Specific Identifiers (Critical)
        const specificMatches = this.detectSpecificPatterns(preprocessed);
        layerScores.specific = specificMatches.score;
        if (specificMatches.matches.length > 0) {
            detectedPatterns.push({
                type: 'specific',
                matches: specificMatches.matches,
                score: specificMatches.score,
                description: 'Specific demographic group identifiers detected'
            });
            totalPatterns += specificMatches.matches.length;
        }
        
        // LAYER 3: Sentiment Analysis
        const sentimentMatches = this.detectSentimentPatterns(preprocessed);
        layerScores.sentiment = sentimentMatches.score;
        if (sentimentMatches.matches.length > 0) {
            detectedPatterns.push({
                type: 'sentiment',
                matches: sentimentMatches.matches,
                score: sentimentMatches.score,
                description: 'Biased sentiment terms detected'
            });
            totalPatterns += sentimentMatches.matches.length;
        }
        
        // LAYER 4: Context Amplifiers
        const contextMatches = this.detectContextPatterns(preprocessed);
        layerScores.context = contextMatches.score;
        if (contextMatches.matches.length > 0) {
            detectedPatterns.push({
                type: 'context',
                matches: contextMatches.matches,
                score: contextMatches.score,
                description: 'Context amplifiers detected'
            });
            totalPatterns += contextMatches.matches.length;
        }
        
        return {
            layerScores,
            detectedPatterns,
            totalPatterns
        };
    }

    /**
     * Detect abstract pattern matches
     */
    detectAbstractPatterns(preprocessed) {
        const matches = [];
        const keywords = this.patterns.abstract.keywords;
        
        keywords.forEach(keyword => {
            if (preprocessed.normalized.includes(keyword.toLowerCase())) {
                matches.push({
                    keyword,
                    positions: this.findWordPositions(preprocessed.normalized, keyword.toLowerCase())
                });
            }
        });
        
        const score = Math.min(matches.length * 0.15, 1.0);
        return { matches, score };
    }

    /**
     * Detect specific identifier patterns (Critical fix)
     */
    detectSpecificPatterns(preprocessed) {
        const matches = [];
        const identifiers = this.patterns.specific.identifiers;
        
        identifiers.forEach(identifier => {
            if (preprocessed.normalized.includes(identifier.toLowerCase())) {
                matches.push({
                    identifier,
                    positions: this.findWordPositions(preprocessed.normalized, identifier.toLowerCase()),
                    context: this.extractContext(preprocessed.original, identifier)
                });
            }
        });
        
        // Higher scoring for specific identifiers (addresses "white people suck" = 0% issue)
        const score = Math.min(matches.length * 0.35, 1.0);
        return { matches, score };
    }

    /**
     * Detect sentiment patterns
     */
    detectSentimentPatterns(preprocessed) {
        const matches = [];
        const negativeTerms = this.patterns.sentiment.negative;
        const positiveTerms = this.patterns.sentiment.positive;
        
        negativeTerms.forEach(term => {
            if (preprocessed.normalized.includes(term.toLowerCase())) {
                matches.push({
                    term,
                    sentiment: 'negative',
                    positions: this.findWordPositions(preprocessed.normalized, term.toLowerCase())
                });
            }
        });
        
        positiveTerms.forEach(term => {
            if (preprocessed.normalized.includes(term.toLowerCase())) {
                matches.push({
                    term,
                    sentiment: 'positive',
                    positions: this.findWordPositions(preprocessed.normalized, term.toLowerCase())
                });
            }
        });
        
        const score = Math.min(matches.length * 0.20, 1.0);
        return { matches, score };
    }

    /**
     * Detect context amplifier patterns
     */
    detectContextPatterns(preprocessed) {
        const matches = [];
        const amplifiers = this.patterns.context.amplifiers;
        
        amplifiers.forEach(amplifier => {
            if (preprocessed.normalized.includes(amplifier.toLowerCase())) {
                matches.push({
                    amplifier,
                    positions: this.findWordPositions(preprocessed.normalized, amplifier.toLowerCase())
                });
            }
        });
        
        const score = Math.min(matches.length * 0.10, 1.0);
        return { matches, score };
    }

    /**
     * Calculate unified bias score with combination bonuses
     * This is the key improvement that addresses scoring inconsistencies
     */
    calculateUnifiedScore(layerResults) {
        const { layerScores } = layerResults;
        const config = this.scoringConfig;
        
        // Base score from individual layers
        let baseScore = 0;
        baseScore += layerScores.abstract * config.layerWeights.abstract;
        baseScore += layerScores.specific * config.layerWeights.specific;
        baseScore += layerScores.sentiment * config.layerWeights.sentiment;
        baseScore += layerScores.context * config.layerWeights.context;
        
        // Combination bonuses (enhanced for detecting complex bias)
        let combinationBonus = 0;
        
        // Primary combinations (most critical)
        if (layerScores.specific > 0 && layerScores.sentiment > 0) {
            combinationBonus += config.combinationBonuses.specific_sentiment;
        }
        
        if (layerScores.specific > 0 && layerScores.context > 0) {
            combinationBonus += config.combinationBonuses.specific_context;
        }
        
        if (layerScores.sentiment > 0 && layerScores.context > 0) {
            combinationBonus += config.combinationBonuses.sentiment_context;
        }
        
        // Secondary combinations (new patterns from 2024 research)
        if (layerScores.abstract > 0 && layerScores.specific > 0) {
            combinationBonus += config.combinationBonuses.abstract_specific;
        }
        
        if (layerScores.abstract > 0 && layerScores.sentiment > 0) {
            combinationBonus += config.combinationBonuses.abstract_sentiment;
        }
        
        if (layerScores.abstract > 0 && layerScores.context > 0) {
            combinationBonus += config.combinationBonuses.abstract_context;
        }
        
        // Multi-layer combinations (highest severity)
        if (layerScores.specific > 0 && layerScores.sentiment > 0 && layerScores.context > 0) {
            combinationBonus += config.combinationBonuses.triple_combination;
        }
        
        // Quad combination bonus (maximum bias detection)
        if (layerScores.abstract > 0 && layerScores.specific > 0 && 
            layerScores.sentiment > 0 && layerScores.context > 0) {
            combinationBonus += config.combinationBonuses.quad_combination;
        }
        
        // Final score with combination bonuses
        const finalScore = Math.min(baseScore + combinationBonus, 1.0);
        
        return finalScore;
    }

    /**
     * Determine severity level
     */
    determineSeverity(biasScore) {
        const thresholds = this.scoringConfig.severityThresholds;
        
        if (biasScore >= thresholds.critical) {
            return { level: 'critical', color: '#dc2626', emoji: '🚨' };
        } else if (biasScore >= thresholds.high) {
            return { level: 'high', color: '#f59e0b', emoji: '⚠️' };
        } else if (biasScore >= thresholds.medium) {
            return { level: 'medium', color: '#3b82f6', emoji: '📊' };
        } else if (biasScore >= thresholds.low) {
            return { level: 'low', color: '#059669', emoji: '⚡' };
        } else {
            return { level: 'minimal', color: '#10b981', emoji: '✅' };
        }
    }

    /**
     * Calculate risk level
     */
    calculateRiskLevel(biasScore) {
        if (biasScore >= 0.70) return { level: 'HIGH', color: '#dc2626', emoji: '🚨' };
        if (biasScore >= 0.30) return { level: 'MODERATE', color: '#f59e0b', emoji: '⚠️' };
        return { level: 'LOW', color: '#059669', emoji: '✅' };
    }

    /**
     * Generate unified recommendations
     */
    generateUnifiedRecommendations(layerResults, severity) {
        const recommendations = [];
        const { detectedPatterns } = layerResults;
        
        // Critical severity recommendations
        if (severity.level === 'critical') {
            recommendations.push('🚨 CRITICAL: Remove direct demographic-based discriminatory language');
            recommendations.push('⚖️ Implement immediate bias review and correction procedures');
            recommendations.push('🔍 Conduct comprehensive bias audit of related content');
        }
        
        // Pattern-specific recommendations
        detectedPatterns.forEach(pattern => {
            switch (pattern.type) {
                case 'specific':
                    recommendations.push('👥 Replace specific demographic identifiers with inclusive language');
                    break;
                case 'sentiment':
                    recommendations.push('💭 Remove negative sentiment terms associated with demographic groups');
                    break;
                case 'context':
                    recommendations.push('🎯 Avoid generalizing context terms with demographic identifiers');
                    break;
                case 'abstract':
                    recommendations.push('📋 Review abstract demographic references for potential bias');
                    break;
            }
        });
        
        // General recommendations
        if (recommendations.length === 0) {
            recommendations.push('✅ No significant bias patterns detected');
            recommendations.push('🔄 Continue monitoring for emerging bias patterns');
        }
        
        return recommendations.slice(0, 8); // Limit to top 8 recommendations
    }

    /**
     * Helper method to find word positions
     */
    findWordPositions(text, word) {
        const positions = [];
        let index = text.indexOf(word);
        while (index !== -1) {
            positions.push(index);
            index = text.indexOf(word, index + 1);
        }
        return positions;
    }

    /**
     * Helper method to extract context around matches
     */
    extractContext(text, term, contextLength = 50) {
        const index = text.toLowerCase().indexOf(term.toLowerCase());
        if (index === -1) return '';
        
        const start = Math.max(0, index - contextLength);
        const end = Math.min(text.length, index + term.length + contextLength);
        
        return text.substring(start, end);
    }

    /**
     * Update performance metrics
     */
    updatePerformanceMetrics(analysisResult) {
        this.performanceMetrics.totalAnalyses++;
        
        // Update average processing time
        const currentAvg = this.performanceMetrics.averageProcessingTime;
        const newTime = analysisResult.metadata.processingTime;
        this.performanceMetrics.averageProcessingTime = 
            Math.round((currentAvg * (this.performanceMetrics.totalAnalyses - 1) + newTime) / this.performanceMetrics.totalAnalyses);
        
        // Update critical bias detection count
        if (analysisResult.severity === 'critical') {
            this.performanceMetrics.criticalBiasDetected++;
        }
        
        // Update accuracy score (simplified metric)
        this.performanceMetrics.accuracyScore = 
            Math.round((this.performanceMetrics.criticalBiasDetected / this.performanceMetrics.totalAnalyses) * 100);
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            engineVersion: 'unified-v1.0',
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Test the unified engine with known bias cases
     */
    async runValidationTests() {
        const testCases = [
            {
                text: "white people suck",
                expectedScore: 85, // Should be high, not 0% - critical test case
                description: "Critical test case from improvement plan (specific + sentiment)"
            },
            {
                text: "all women are bad at math",
                expectedScore: 75,
                description: "Triple combination: context + specific + sentiment"
            },
            {
                text: "Our hiring process evaluates candidates based on skills",
                expectedScore: 5,
                description: "Clean text should score low"
            },
            {
                text: "black people are naturally violent and dangerous",
                expectedScore: 90,
                description: "Quad combination: all four bias layers present"
            },
            {
                text: "muslims are typically terrorists and should be banned",
                expectedScore: 88,
                description: "Enhanced specific identifiers + context + sentiment + modal"
            },
            {
                text: "disabled people are inherently less capable than normal people",
                expectedScore: 82,
                description: "New disability category + inherency amplifier + comparison"
            },
            {
                text: "poor people are lazy because they don't work hard enough",
                expectedScore: 78,
                description: "Socioeconomic bias + causal amplifier + character defamation"
            },
            {
                text: "transgender individuals are mentally ill and dangerous to children",
                expectedScore: 92,
                description: "Intersectional bias + medical stigma + threat amplification"
            },
            {
                text: "The policy affects various demographic groups differently",
                expectedScore: 12,
                description: "Abstract terms only - should remain low"
            },
            {
                text: "elderly people are usually confused and need constant supervision",
                expectedScore: 68,
                description: "Age bias + frequency amplifier + capability diminishment"
            }
        ];
        
        console.log('🧪 Running Unified Pattern Engine Validation Tests...');
        
        for (const testCase of testCases) {
            const result = await this.analyzeUnified(testCase.text);
            const passed = Math.abs(result.overallScore - testCase.expectedScore) <= 15;
            
            console.log(`${passed ? '✅' : '❌'} ${testCase.description}`);
            console.log(`   Text: "${testCase.text}"`);
            console.log(`   Expected: ${testCase.expectedScore}%, Got: ${result.overallScore}%`);
            console.log(`   Severity: ${result.severity}`);
            console.log('');
        }
        
        return testCases;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedPatternEngine;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.UnifiedPatternEngine = UnifiedPatternEngine;
}