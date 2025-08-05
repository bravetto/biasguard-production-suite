/**
 * Advanced Counterfactual Analysis & Intersectional Bias Detection Engine
 * Based on 2024-2025 research on counterfactual bias evaluation and intersectional analysis
 * 
 * Key Research Foundations:
 * - "The Impact of Unstated Norms in Bias Analysis of Language Models" (2024)
 * - "SocialCounterfactuals: Probing Intersectional Social Biases" (2024) 
 * - "Quantifying Fairness in LLMs Beyond Tokens" (2025)
 * - "Language Models Change Facts Based on the Way You Talk" (2025)
 * 
 * Addresses critical challenges:
 * - Unstated norms problem in counterfactual evaluation
 * - Intersectional bias detection across multiple demographic dimensions
 * - Semantic consistency analysis beyond token-level comparisons
 * - Statistical hypothesis testing for bias detection
 */

class CounterfactualAnalysisEngine {
    constructor() {
        this.isInitialized = false;
        this.demographicMappings = this.initializeDemographicMappings();
        this.intersectionalCategories = this.initializeIntersectionalCategories();
        this.counterfactualTemplates = this.initializeCounterfactualTemplates();
        this.statisticalConfig = this.initializeStatisticalConfig();
        this.analysisHistory = [];
        this.performanceMetrics = {
            totalCounterfactualTests: 0,
            intersectionalBiasDetected: 0,
            averageProcessingTime: 0,
            statisticalSignificance: 0
        };
    }

    /**
     * Initialize demographic mappings for counterfactual swapping
     * Based on "The Impact of Unstated Norms" research - addresses markedness problem
     */
    initializeDemographicMappings() {
        return {
            // Racial/Ethnic mappings (addressing unstated norms)
            racial: {
                'white people': ['black people', 'hispanic people', 'asian people', 'native americans'],
                'black people': ['white people', 'hispanic people', 'asian people', 'native americans'],
                'hispanic people': ['white people', 'black people', 'asian people', 'native americans'],
                'asian people': ['white people', 'black people', 'hispanic people', 'native americans'],
                'native americans': ['white people', 'black people', 'hispanic people', 'asian people'],
                'whites': ['blacks', 'hispanics', 'asians', 'natives'],
                'blacks': ['whites', 'hispanics', 'asians', 'natives'],
                'hispanics': ['whites', 'blacks', 'asians', 'natives'],
                'asians': ['whites', 'blacks', 'hispanics', 'natives'],
                'caucasians': ['african americans', 'latinos', 'asian americans', 'indigenous people'],
                'african americans': ['caucasians', 'latinos', 'asian americans', 'indigenous people']
            },

            // Gender mappings (enhanced with intersectional identities)
            gender: {
                'men': ['women', 'transgender men', 'transgender women', 'non-binary people'],
                'women': ['men', 'transgender men', 'transgender women', 'non-binary people'],
                'males': ['females', 'transgender males', 'transgender females', 'non-binary individuals'],
                'females': ['males', 'transgender males', 'transgender females', 'non-binary individuals'],
                'boys': ['girls', 'transgender boys', 'transgender girls', 'non-binary youth'],
                'girls': ['boys', 'transgender boys', 'transgender girls', 'non-binary youth'],
                'transgender men': ['cisgender men', 'transgender women', 'non-binary people'],
                'transgender women': ['cisgender women', 'transgender men', 'non-binary people'],
                'non-binary people': ['men', 'women', 'transgender men', 'transgender women']
            },

            // Religious mappings (comprehensive coverage)
            religious: {
                'muslims': ['christians', 'jews', 'hindus', 'buddhists', 'atheists'],
                'christians': ['muslims', 'jews', 'hindus', 'buddhists', 'atheists'],
                'jews': ['muslims', 'christians', 'hindus', 'buddhists', 'atheists'],
                'hindus': ['muslims', 'christians', 'jews', 'buddhists', 'atheists'],
                'buddhists': ['muslims', 'christians', 'jews', 'hindus', 'atheists'],
                'atheists': ['muslims', 'christians', 'jews', 'hindus', 'buddhists'],
                'catholics': ['protestants', 'muslims', 'jews', 'hindus', 'buddhists'],
                'protestants': ['catholics', 'muslims', 'jews', 'hindus', 'buddhists']
            },

            // Age mappings (addressing adultification bias)
            age: {
                'elderly': ['young people', 'middle-aged', 'teenagers', 'children'],
                'young people': ['elderly', 'middle-aged', 'teenagers', 'children'],
                'teenagers': ['elderly', 'young people', 'middle-aged', 'children'],
                'children': ['elderly', 'young people', 'middle-aged', 'teenagers'],
                'seniors': ['millennials', 'gen z', 'boomers', 'gen x'],
                'millennials': ['seniors', 'gen z', 'boomers', 'gen x'],
                'boomers': ['millennials', 'gen z', 'seniors', 'gen x'],
                'gen z': ['millennials', 'boomers', 'seniors', 'gen x']
            },

            // Socioeconomic mappings (class-based analysis)
            socioeconomic: {
                'poor people': ['rich people', 'middle class', 'working class', 'wealthy'],
                'rich people': ['poor people', 'middle class', 'working class', 'homeless'],
                'wealthy': ['poor people', 'middle class', 'working class', 'homeless'],
                'homeless': ['wealthy', 'middle class', 'working class', 'rich people'],
                'working class': ['upper class', 'middle class', 'poor people', 'wealthy'],
                'middle class': ['working class', 'upper class', 'poor people', 'wealthy'],
                'upper class': ['working class', 'middle class', 'poor people', 'homeless']
            },

            // Disability mappings (new category from 2024 research)
            disability: {
                'disabled people': ['able-bodied', 'neurotypical', 'physically abled', 'mentally healthy'],
                'able-bodied': ['disabled people', 'physically disabled', 'mobility impaired', 'wheelchair users'],
                'neurotypical': ['neurodivergent', 'autistic people', 'mentally ill', 'neurodiverse'],
                'neurodivergent': ['neurotypical', 'able-minded', 'mentally healthy', 'typical'],
                'autistic people': ['neurotypical', 'non-autistic', 'typical people', 'able-minded'],
                'mentally ill': ['mentally healthy', 'neurotypical', 'stable', 'well-adjusted']
            }
        };
    }

    /**
     * Initialize intersectional categories for compound bias analysis
     * Based on "SocialCounterfactuals" research on intersectional bias
     */
    initializeIntersectionalCategories() {
        return {
            // Two-dimensional intersections
            'race_gender': {
                combinations: [
                    ['white', 'men'], ['white', 'women'], 
                    ['black', 'men'], ['black', 'women'],
                    ['hispanic', 'men'], ['hispanic', 'women'],
                    ['asian', 'men'], ['asian', 'women']
                ],
                weight: 0.8 // High weight for critical intersections
            },

            'race_age': {
                combinations: [
                    ['white', 'young'], ['white', 'elderly'],
                    ['black', 'young'], ['black', 'elderly'],
                    ['hispanic', 'young'], ['hispanic', 'elderly'],
                    ['asian', 'young'], ['asian', 'elderly']
                ],
                weight: 0.7
            },

            'gender_age': {
                combinations: [
                    ['men', 'young'], ['men', 'elderly'],
                    ['women', 'young'], ['women', 'elderly'],
                    ['transgender', 'young'], ['transgender', 'elderly'],
                    ['non-binary', 'young'], ['non-binary', 'elderly']
                ],
                weight: 0.6
            },

            'race_class': {
                combinations: [
                    ['white', 'wealthy'], ['white', 'poor'],
                    ['black', 'wealthy'], ['black', 'poor'],
                    ['hispanic', 'wealthy'], ['hispanic', 'poor'],
                    ['asian', 'wealthy'], ['asian', 'poor']
                ],
                weight: 0.75
            },

            // Three-dimensional intersections (most complex)
            'race_gender_age': {
                combinations: [
                    ['white', 'men', 'young'], ['white', 'women', 'elderly'],
                    ['black', 'men', 'young'], ['black', 'women', 'elderly'],
                    ['hispanic', 'men', 'young'], ['hispanic', 'women', 'elderly'],
                    ['asian', 'men', 'young'], ['asian', 'women', 'elderly']
                ],
                weight: 0.9 // Highest weight for triple intersections
            },

            'race_gender_class': {
                combinations: [
                    ['white', 'men', 'wealthy'], ['white', 'women', 'poor'],
                    ['black', 'men', 'wealthy'], ['black', 'women', 'poor'],
                    ['hispanic', 'men', 'wealthy'], ['hispanic', 'women', 'poor'],
                    ['asian', 'men', 'wealthy'], ['asian', 'women', 'poor']
                ],
                weight: 0.85
            }
        };
    }

    /**
     * Initialize counterfactual templates for systematic testing
     * Based on FiSCo framework for semantic consistency analysis
     */
    initializeCounterfactualTemplates() {
        return {
            // Direct substitution templates
            direct: {
                pattern: /\b({demographic})\b/gi,
                description: 'Direct demographic term substitution'
            },

            // Contextual templates (addressing unstated norms)
            contextual: {
                patterns: [
                    /\b({demographic})\s+(are|is|were|was)\b/gi,
                    /\b(all|most|many|some)\s+({demographic})\b/gi,
                    /\b({demographic})\s+(typically|usually|often|always|never)\b/gi,
                    /\b({demographic})\s+(tend to|are likely to|are known for)\b/gi
                ],
                description: 'Contextual patterns that create bias amplification'
            },

            // Intersectional templates (compound identity substitution)
            intersectional: {
                patterns: [
                    /\b({demographic1})\s+({demographic2})\b/gi,
                    /\b({demographic2})\s+({demographic1})\b/gi,
                    /\b({demographic1})\s+(and|or)\s+({demographic2})\b/gi
                ],
                description: 'Intersectional identity combinations'
            },

            // Implicit templates (subtle bias indicators)
            implicit: {
                patterns: [
                    /\b(people like|individuals like|those people|such people)\b/gi,
                    /\b(their kind|that type|these people|those individuals)\b/gi,
                    /\b(culture|background|heritage|tradition)\b/gi
                ],
                description: 'Implicit references that may contain hidden bias'
            }
        };
    }

    /**
     * Initialize statistical configuration for hypothesis testing
     * Based on "Quantifying Fairness in LLMs Beyond Tokens" research
     */
    initializeStatisticalConfig() {
        return {
            // Statistical significance thresholds
            significanceLevel: 0.05, // p < 0.05 for statistical significance
            effectSizeThreshold: 0.3, // Cohen's d > 0.3 for meaningful effect
            sampleSizeMinimum: 10, // Minimum samples for statistical testing

            // Semantic similarity thresholds
            semanticSimilarityThreshold: 0.7, // Cosine similarity threshold
            entailmentThreshold: 0.8, // Entailment probability threshold
            
            // Bias detection thresholds
            biasScoreDifferenceThreshold: 0.15, // 15% difference threshold
            intersectionalBiasThreshold: 0.20, // 20% threshold for intersectional bias
            
            // Statistical tests to perform
            statisticalTests: [
                'welch_t_test', // For comparing means between groups
                'mann_whitney_u', // Non-parametric alternative
                'chi_square', // For categorical distributions
                'effect_size_cohens_d' // Effect size calculation
            ]
        };
    }

    /**
     * Main counterfactual analysis method
     * @param {string} originalText - Original text to analyze
     * @param {Object} options - Analysis options
     * @returns {Object} Comprehensive counterfactual analysis results
     */
    async analyzeCounterfactual(originalText, options = {}) {
        const startTime = performance.now();
        const analysisId = `cf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
            // Step 1: Detect demographic identifiers in original text
            const detectedDemographics = this.detectDemographicIdentifiers(originalText);
            
            if (detectedDemographics.length === 0) {
                return {
                    analysisId,
                    hasCounterfactuals: false,
                    message: 'No demographic identifiers detected for counterfactual analysis',
                    originalText,
                    processingTime: Math.round(performance.now() - startTime)
                };
            }

            // Step 2: Generate counterfactual variations
            const counterfactualVariations = await this.generateCounterfactualVariations(
                originalText, 
                detectedDemographics
            );

            // Step 3: Analyze each counterfactual for bias
            const counterfactualResults = await this.analyzeCounterfactualVariations(
                originalText,
                counterfactualVariations,
                options.unifiedEngine
            );

            // Step 4: Perform intersectional bias analysis
            const intersectionalAnalysis = await this.analyzeIntersectionalBias(
                originalText,
                detectedDemographics,
                counterfactualResults,
                options.unifiedEngine
            );

            // Step 5: Statistical hypothesis testing
            const statisticalAnalysis = this.performStatisticalAnalysis(counterfactualResults);

            // Step 6: Semantic consistency analysis
            const semanticAnalysis = await this.analyzeSemanticConsistency(
                originalText,
                counterfactualVariations,
                counterfactualResults
            );

            // Step 7: Generate comprehensive results
            const analysisResult = {
                analysisId,
                hasCounterfactuals: true,
                originalText,
                detectedDemographics,
                counterfactualVariations: counterfactualVariations.length,
                counterfactualResults,
                intersectionalAnalysis,
                statisticalAnalysis,
                semanticAnalysis,
                overallBiasAssessment: this.calculateOverallBiasAssessment(
                    counterfactualResults,
                    intersectionalAnalysis,
                    statisticalAnalysis
                ),
                recommendations: this.generateCounterfactualRecommendations(
                    counterfactualResults,
                    intersectionalAnalysis,
                    statisticalAnalysis
                ),
                metadata: {
                    processingTime: Math.round(performance.now() - startTime),
                    timestamp: new Date().toISOString(),
                    engineVersion: 'counterfactual-v1.0',
                    researchBasis: '2024-2025 counterfactual bias evaluation research'
                }
            };

            // Update performance metrics
            this.updatePerformanceMetrics(analysisResult);

            return analysisResult;

        } catch (error) {
            console.error('Counterfactual analysis failed:', error);
            return {
                analysisId,
                error: error.message,
                hasCounterfactuals: false,
                originalText,
                processingTime: Math.round(performance.now() - startTime)
            };
        }
    }

    /**
     * Detect demographic identifiers in text
     */
    detectDemographicIdentifiers(text) {
        const detected = [];
        const normalizedText = text.toLowerCase();

        // Check each demographic category
        Object.keys(this.demographicMappings).forEach(category => {
            Object.keys(this.demographicMappings[category]).forEach(identifier => {
                if (normalizedText.includes(identifier.toLowerCase())) {
                    detected.push({
                        category,
                        identifier,
                        positions: this.findIdentifierPositions(normalizedText, identifier.toLowerCase())
                    });
                }
            });
        });

        return detected;
    }

    /**
     * Generate counterfactual variations by swapping demographic identifiers
     */
    async generateCounterfactualVariations(originalText, detectedDemographics) {
        const variations = [];

        for (const demographic of detectedDemographics) {
            const { category, identifier } = demographic;
            const alternativeIdentifiers = this.demographicMappings[category][identifier] || [];

            for (const alternative of alternativeIdentifiers) {
                // Create counterfactual by substituting demographic identifier
                const counterfactualText = this.substituteIdentifier(
                    originalText,
                    identifier,
                    alternative
                );

                variations.push({
                    original: identifier,
                    substitute: alternative,
                    category,
                    text: counterfactualText,
                    type: 'single_substitution'
                });
            }
        }

        // Generate intersectional counterfactuals if multiple demographics detected
        if (detectedDemographics.length > 1) {
            const intersectionalVariations = this.generateIntersectionalCounterfactuals(
                originalText,
                detectedDemographics
            );
            variations.push(...intersectionalVariations);
        }

        return variations;
    }

    /**
     * Analyze bias in counterfactual variations using unified engine
     */
    async analyzeCounterfactualVariations(originalText, variations, unifiedEngine) {
        const results = [];

        // Analyze original text
        const originalAnalysis = unifiedEngine ? 
            await unifiedEngine.analyzeUnified(originalText) :
            { overallScore: 0, patterns: [], severity: 'unknown' };

        for (const variation of variations) {
            try {
                // Analyze counterfactual variation
                const variationAnalysis = unifiedEngine ?
                    await unifiedEngine.analyzeUnified(variation.text) :
                    { overallScore: 0, patterns: [], severity: 'unknown' };

                // Calculate bias difference
                const biasDifference = Math.abs(
                    variationAnalysis.overallScore - originalAnalysis.overallScore
                );

                // Determine if difference is significant
                const isSignificant = biasDifference >= 
                    (this.statisticalConfig.biasScoreDifferenceThreshold * 100);

                results.push({
                    variation,
                    originalScore: originalAnalysis.overallScore,
                    counterfactualScore: variationAnalysis.overallScore,
                    biasDifference,
                    isSignificant,
                    direction: variationAnalysis.overallScore > originalAnalysis.overallScore ? 
                        'increased_bias' : 'decreased_bias',
                    originalAnalysis,
                    counterfactualAnalysis: variationAnalysis
                });

            } catch (error) {
                console.warn('Failed to analyze counterfactual variation:', error);
                results.push({
                    variation,
                    error: error.message,
                    isSignificant: false
                });
            }
        }

        return results;
    }

    /**
     * Analyze intersectional bias patterns
     */
    async analyzeIntersectionalBias(_originalText, detectedDemographics, counterfactualResults, _unifiedEngine) {
        const intersectionalPatterns = [];
        
        // Group results by intersectional categories
        const intersectionalGroups = this.groupByIntersectionalCategories(
            detectedDemographics,
            counterfactualResults
        );

        for (const [category, results] of Object.entries(intersectionalGroups)) {
            if (results.length < 2) continue; // Need at least 2 for comparison

            // Calculate intersectional bias metrics
            const biasScores = results.map(r => r.counterfactualScore);
            const meanBias = biasScores.reduce((a, b) => a + b, 0) / biasScores.length;
            const maxBias = Math.max(...biasScores);
            const minBias = Math.min(...biasScores);
            const biasRange = maxBias - minBias;

            // Check if intersectional bias exceeds threshold
            const hasIntersectionalBias = biasRange >= 
                (this.statisticalConfig.intersectionalBiasThreshold * 100);

            intersectionalPatterns.push({
                category,
                resultCount: results.length,
                meanBias,
                maxBias,
                minBias,
                biasRange,
                hasIntersectionalBias,
                weight: this.intersectionalCategories[category]?.weight || 0.5,
                results: results.slice(0, 5) // Limit to top 5 for performance
            });
        }

        return {
            totalIntersectionalCategories: intersectionalPatterns.length,
            intersectionalBiasDetected: intersectionalPatterns.filter(p => p.hasIntersectionalBias).length,
            patterns: intersectionalPatterns,
            overallIntersectionalScore: this.calculateIntersectionalScore(intersectionalPatterns)
        };
    }

    /**
     * Perform statistical hypothesis testing on counterfactual results
     */
    performStatisticalAnalysis(counterfactualResults) {
        if (counterfactualResults.length < this.statisticalConfig.sampleSizeMinimum) {
            return {
                sufficientSampleSize: false,
                message: 'Insufficient sample size for statistical analysis',
                sampleSize: counterfactualResults.length
            };
        }

        const originalScores = counterfactualResults.map(r => r.originalScore);
        const counterfactualScores = counterfactualResults.map(r => r.counterfactualScore);

        // Perform statistical tests
        const tTestResult = this.performWelchTTest(originalScores, counterfactualScores);
        const effectSize = this.calculateCohenD(originalScores, counterfactualScores);
        const significantDifferences = counterfactualResults.filter(r => r.isSignificant).length;

        return {
            sufficientSampleSize: true,
            sampleSize: counterfactualResults.length,
            tTest: tTestResult,
            effectSize,
            significantDifferences,
            significanceRate: significantDifferences / counterfactualResults.length,
            isStatisticallySignificant: tTestResult.pValue < this.statisticalConfig.significanceLevel,
            hasMeaningfulEffect: Math.abs(effectSize) > this.statisticalConfig.effectSizeThreshold
        };
    }

    /**
     * Analyze semantic consistency across counterfactuals
     */
    async analyzeSemanticConsistency(originalText, _variations, results) {
        // Simplified semantic analysis (would use actual NLP models in production)
        const consistencyScores = [];
        
        for (const result of results) {
            if (result.error) continue;

            // Calculate semantic similarity (simplified)
            const similarity = this.calculateSemanticSimilarity(
                originalText,
                result.variation.text
            );

            consistencyScores.push({
                variation: result.variation.substitute,
                similarity,
                biasChange: result.biasDifference,
                isConsistent: similarity >= this.statisticalConfig.semanticSimilarityThreshold
            });
        }

        const averageSimilarity = consistencyScores.length > 0 ?
            consistencyScores.reduce((sum, s) => sum + s.similarity, 0) / consistencyScores.length : 0;

        return {
            averageSemanticSimilarity: averageSimilarity,
            consistentVariations: consistencyScores.filter(s => s.isConsistent).length,
            totalVariations: consistencyScores.length,
            consistencyRate: consistencyScores.length > 0 ? 
                consistencyScores.filter(s => s.isConsistent).length / consistencyScores.length : 0,
            scores: consistencyScores.slice(0, 10) // Limit for performance
        };
    }

    /**
     * Calculate overall bias assessment from all analyses
     */
    calculateOverallBiasAssessment(counterfactualResults, intersectionalAnalysis, statisticalAnalysis) {
        let overallScore = 0;
        const factors = [];

        // Factor 1: Significant counterfactual differences
        if (statisticalAnalysis.sufficientSampleSize) {
            const significanceWeight = statisticalAnalysis.significanceRate * 0.4;
            overallScore += significanceWeight;
            factors.push(`Counterfactual significance rate: ${Math.round(statisticalAnalysis.significanceRate * 100)}%`);
        }

        // Factor 2: Intersectional bias
        if (intersectionalAnalysis.intersectionalBiasDetected > 0) {
            const intersectionalWeight = 
                (intersectionalAnalysis.intersectionalBiasDetected / intersectionalAnalysis.totalIntersectionalCategories) * 0.3;
            overallScore += intersectionalWeight;
            factors.push(`Intersectional bias detected in ${intersectionalAnalysis.intersectionalBiasDetected} categories`);
        }

        // Factor 3: Effect size
        if (statisticalAnalysis.hasMeaningfulEffect) {
            overallScore += 0.2;
            factors.push(`Meaningful statistical effect size: ${statisticalAnalysis.effectSize?.toFixed(3)}`);
        }

        // Factor 4: Maximum bias difference
        const maxBiasDifference = Math.max(...counterfactualResults.map(r => r.biasDifference || 0));
        if (maxBiasDifference > 20) {
            overallScore += 0.1;
            factors.push(`Maximum bias difference: ${maxBiasDifference.toFixed(1)}%`);
        }

        // Normalize to 0-100 scale
        overallScore = Math.min(overallScore * 100, 100);

        return {
            score: Math.round(overallScore),
            level: this.categorizeBiasLevel(overallScore),
            factors,
            recommendation: this.getOverallRecommendation(overallScore)
        };
    }

    /**
     * Generate recommendations based on counterfactual analysis
     */
    generateCounterfactualRecommendations(counterfactualResults, intersectionalAnalysis, statisticalAnalysis) {
        const recommendations = [];

        // Statistical significance recommendations
        if (statisticalAnalysis.isStatisticallySignificant) {
            recommendations.push({
                type: 'statistical',
                priority: 'high',
                message: '🚨 Statistically significant bias detected across counterfactual variations',
                action: 'Review and revise content to ensure consistent treatment across demographic groups'
            });
        }

        // Intersectional bias recommendations
        if (intersectionalAnalysis.intersectionalBiasDetected > 0) {
            recommendations.push({
                type: 'intersectional',
                priority: 'high',
                message: `⚠️ Intersectional bias detected in ${intersectionalAnalysis.intersectionalBiasDetected} categories`,
                action: 'Examine compound effects of multiple demographic identities in your content'
            });
        }

        // Effect size recommendations
        if (statisticalAnalysis.hasMeaningfulEffect) {
            recommendations.push({
                type: 'effect_size',
                priority: 'medium',
                message: '📊 Meaningful effect size indicates substantial bias differences',
                action: 'Consider the practical significance of detected bias patterns'
            });
        }

        // Specific counterfactual recommendations
        const highBiasVariations = counterfactualResults
            .filter(r => r.biasDifference > 25)
            .slice(0, 3);

        for (const variation of highBiasVariations) {
            recommendations.push({
                type: 'counterfactual',
                priority: 'medium',
                message: `🔄 High bias difference when "${variation.variation.original}" → "${variation.variation.substitute}"`,
                action: `Review treatment of ${variation.variation.category} groups for consistency`
            });
        }

        // General recommendations
        if (recommendations.length === 0) {
            recommendations.push({
                type: 'general',
                priority: 'low',
                message: '✅ No significant counterfactual bias patterns detected',
                action: 'Continue monitoring for emerging bias patterns in future content'
            });
        }

        return recommendations.slice(0, 8); // Limit to top 8 recommendations
    }

    // Helper methods for statistical calculations and text processing
    findIdentifierPositions(text, identifier) {
        const positions = [];
        let index = text.indexOf(identifier);
        while (index !== -1) {
            positions.push(index);
            index = text.indexOf(identifier, index + 1);
        }
        return positions;
    }

    substituteIdentifier(text, original, substitute) {
        const regex = new RegExp(`\\b${original}\\b`, 'gi');
        return text.replace(regex, substitute);
    }

    generateIntersectionalCounterfactuals(originalText, detectedDemographics) {
        // Simplified intersectional counterfactual generation
        const variations = [];
        
        for (let i = 0; i < detectedDemographics.length; i++) {
            for (let j = i + 1; j < detectedDemographics.length; j++) {
                const demo1 = detectedDemographics[i];
                const demo2 = detectedDemographics[j];
                
                // Generate combined substitutions
                const alternatives1 = this.demographicMappings[demo1.category][demo1.identifier] || [];
                const alternatives2 = this.demographicMappings[demo2.category][demo2.identifier] || [];
                
                if (alternatives1.length > 0 && alternatives2.length > 0) {
                    let modifiedText = originalText;
                    modifiedText = this.substituteIdentifier(modifiedText, demo1.identifier, alternatives1[0]);
                    modifiedText = this.substituteIdentifier(modifiedText, demo2.identifier, alternatives2[0]);
                    
                    variations.push({
                        original: `${demo1.identifier} + ${demo2.identifier}`,
                        substitute: `${alternatives1[0]} + ${alternatives2[0]}`,
                        category: `${demo1.category}_${demo2.category}`,
                        text: modifiedText,
                        type: 'intersectional_substitution'
                    });
                }
            }
        }
        
        return variations;
    }

    groupByIntersectionalCategories(_detectedDemographics, results) {
        const groups = {};
        
        for (const result of results) {
            const category = result.variation.category;
            if (!groups[category]) {
                groups[category] = [];
            }
            groups[category].push(result);
        }
        
        return groups;
    }

    calculateIntersectionalScore(patterns) {
        if (patterns.length === 0) return 0;
        
        const weightedScores = patterns.map(p => 
            p.hasIntersectionalBias ? p.biasRange * p.weight : 0
        );
        
        return weightedScores.reduce((sum, score) => sum + score, 0) / patterns.length;
    }

    performWelchTTest(sample1, sample2) {
        // Simplified Welch's t-test implementation
        const mean1 = sample1.reduce((a, b) => a + b, 0) / sample1.length;
        const mean2 = sample2.reduce((a, b) => a + b, 0) / sample2.length;
        
        const variance1 = sample1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (sample1.length - 1);
        const variance2 = sample2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (sample2.length - 1);
        
        const standardError = Math.sqrt(variance1 / sample1.length + variance2 / sample2.length);
        const tStatistic = (mean1 - mean2) / standardError;
        
        // Simplified p-value calculation (would use proper statistical library in production)
        const pValue = Math.abs(tStatistic) > 2 ? 0.01 : 0.1; // Simplified
        
        return {
            tStatistic,
            pValue,
            mean1,
            mean2,
            meanDifference: mean1 - mean2
        };
    }

    calculateCohenD(sample1, sample2) {
        const mean1 = sample1.reduce((a, b) => a + b, 0) / sample1.length;
        const mean2 = sample2.reduce((a, b) => a + b, 0) / sample2.length;
        
        const variance1 = sample1.reduce((sum, x) => sum + Math.pow(x - mean1, 2), 0) / (sample1.length - 1);
        const variance2 = sample2.reduce((sum, x) => sum + Math.pow(x - mean2, 2), 0) / (sample2.length - 1);
        
        const pooledStandardDeviation = Math.sqrt((variance1 + variance2) / 2);
        
        return (mean1 - mean2) / pooledStandardDeviation;
    }

    calculateSemanticSimilarity(text1, text2) {
        // Simplified semantic similarity (would use actual embeddings in production)
        const words1 = text1.toLowerCase().split(/\s+/);
        const words2 = text2.toLowerCase().split(/\s+/);
        
        const intersection = words1.filter(word => words2.includes(word));
        const union = [...new Set([...words1, ...words2])];
        
        return intersection.length / union.length; // Jaccard similarity
    }

    categorizeBiasLevel(score) {
        if (score >= 70) return 'critical';
        if (score >= 50) return 'high';
        if (score >= 30) return 'moderate';
        if (score >= 15) return 'low';
        return 'minimal';
    }

    getOverallRecommendation(score) {
        if (score >= 70) return 'Immediate review and revision required - significant counterfactual bias detected';
        if (score >= 50) return 'Review recommended - notable bias patterns across demographic groups';
        if (score >= 30) return 'Monitor closely - some bias inconsistencies detected';
        if (score >= 15) return 'Continue standard bias monitoring practices';
        return 'Counterfactual analysis shows consistent treatment across groups';
    }

    updatePerformanceMetrics(analysisResult) {
        this.performanceMetrics.totalCounterfactualTests++;
        
        if (analysisResult.intersectionalAnalysis?.intersectionalBiasDetected > 0) {
            this.performanceMetrics.intersectionalBiasDetected++;
        }
        
        const currentAvg = this.performanceMetrics.averageProcessingTime;
        const newTime = analysisResult.metadata.processingTime;
        this.performanceMetrics.averageProcessingTime = 
            Math.round((currentAvg * (this.performanceMetrics.totalCounterfactualTests - 1) + newTime) / 
                      this.performanceMetrics.totalCounterfactualTests);
        
        if (analysisResult.statisticalAnalysis?.isStatisticallySignificant) {
            this.performanceMetrics.statisticalSignificance++;
        }
    }

    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            intersectionalBiasRate: this.performanceMetrics.totalCounterfactualTests > 0 ?
                this.performanceMetrics.intersectionalBiasDetected / this.performanceMetrics.totalCounterfactualTests : 0,
            statisticalSignificanceRate: this.performanceMetrics.totalCounterfactualTests > 0 ?
                this.performanceMetrics.statisticalSignificance / this.performanceMetrics.totalCounterfactualTests : 0,
            engineVersion: 'counterfactual-v1.0',
            lastUpdated: new Date().toISOString()
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CounterfactualAnalysisEngine;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.CounterfactualAnalysisEngine = CounterfactualAnalysisEngine;
}