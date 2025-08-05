/**
 * BiasGuard Code Bias Detection Engine
 * Advanced bias detection specifically designed for source code analysis
 * Integrates with existing BiasGuard ML Engine for comprehensive analysis
 * 
 * Supports: JavaScript, Python, Java, C++, SQL, and more
 * Detects: Algorithmic bias, discriminatory logic, biased variable names, comments
 */

class CodeBiasDetectionEngine {
    constructor() {
        this.isInitialized = false;
        this.codePatterns = this.initializeCodePatterns();
        this.languageDetectors = this.initializeLanguageDetectors();
        this.codeAnalysisHistory = [];
        this.performanceMetrics = {
            totalCodeAnalyses: 0,
            averageProcessingTime: 0,
            criticalBiasDetected: 0,
            accuracyScore: 0
        };
    }

    /**
     * Initialize code-specific bias detection patterns
     */
    initializeCodePatterns() {
        return {
            // Discriminatory Logic Patterns
            discriminatoryLogic: {
                patterns: [
                    // Direct demographic discrimination
                    /if\s*\(\s*.*\.(gender|sex|race|ethnicity|age|religion)\s*[=!]+\s*['"`]?(male|female|white|black|asian|hispanic|muslim|christian|jewish)/gi,
                    /if\s*\(\s*.*\.(name|firstName|lastName)\.includes\s*\(\s*['"`](chang|rodriguez|smith|johnson|williams|brown|jones|garcia|miller|davis|martinez|hernandez|lopez|gonzalez|wilson|anderson|thomas|taylor|moore|jackson|martin|lee|perez|thompson|white|harris|sanchez|clark|ramirez|lewis|robinson|walker|young|allen|king|wright|scott|torres|nguyen|hill|flores|green|adams|nelson|baker|hall|rivera|campbell|mitchell|carter|roberts)/gi,
                    /if\s*\(\s*.*\.zipCode\.(startsWith|includes)\s*\(\s*['"`](90210|10021|94102|02101|33109|77019|60614|30309|98109|94105)/gi,
                    /if\s*\(\s*.*\.age\s*[<>]=?\s*\d+\s*\)\s*{\s*return\s+(false|null|0)/gi,
                    
                    // Salary/compensation discrimination
                    /if\s*\(\s*.*\.(gender|sex)\s*===?\s*['"`]male['"`]\s*\)\s*{\s*.*\*=?\s*[1-9]/gi,
                    /baseSalary\s*\*=?\s*.*gender.*male/gi,
                    
                    // Credit/loan discrimination
                    /if\s*\(\s*.*\.(race|ethnicity|neighborhood|zipCode)/gi,
                    /creditScore\s*[+\-*/]=?\s*.*\.(race|gender|age|ethnicity)/gi,
                    
                    // Hiring discrimination
                    /if\s*\(\s*.*\.(university|school)\.includes\s*\(\s*['"`](harvard|yale|princeton|stanford|mit)/gi,
                    /if\s*\(\s*.*\.resume\.includes\s*\(\s*['"`](diversity|inclusion|affirmative)/gi
                ],
                severity: 'critical',
                description: 'Direct discriminatory logic in code',
                mlWeight: 0.95,
                color: '#dc2626',
                icon: '🚨'
            },

            // Biased Variable Names
            biasedVariables: {
                patterns: [
                    /\b(whiteList|blackList|master|slave|manHours|manDays|masterBranch|slaveNode)\b/gi,
                    /\b(guys|dudes|bros)\b.*=.*function/gi,
                    /\b(isGay|isLesbian|isTransgender|isDisabled|isOld|isForeign)\b/gi,
                    /\b(normalUser|abnormalUser|weirdUser|strangeUser)\b/gi,
                    /\b(smartUser|dumbUser|stupidUser|intelligentUser)\b/gi,
                    /\b(richUser|poorUser|cheapUser|expensiveUser)\b/gi
                ],
                severity: 'medium',
                description: 'Potentially biased variable and function names',
                mlWeight: 0.70,
                color: '#f59e0b',
                icon: '📝'
            },

            // Biased Comments and Documentation
            biasedComments: {
                patterns: [
                    /\/\/.*\b(women|men|girls|boys|guys|ladies|gentlemen)\s+(are|aren't|can't|cannot|should|shouldn't|always|never|typically|usually|generally|tend to|likely to)\b.*\b(better|worse|bad|good|smart|stupid|emotional|logical|weak|strong|aggressive|passive)\b/gi,
                    /\/\*[\s\S]*\b(race|gender|age|religion|ethnicity)\b[\s\S]*\b(superior|inferior|better|worse|smarter|dumber|lazy|hardworking|criminal|honest|trustworthy|untrustworthy)\b[\s\S]*\*\//gi,
                    /\/\/.*\b(this works better for|designed for|optimized for)\b.*\b(men|women|whites|blacks|asians|hispanics|young|old)\b/gi,
                    /#.*\b(assume|assuming|obviously|clearly|naturally)\b.*\b(male|female|white|black|young|old|rich|poor)\b/gi,
                    /\/\/.*\b(avoid|skip|ignore|exclude)\b.*\b(minorities|women|elderly|disabled|foreign|immigrant)\b/gi
                ],
                severity: 'high',
                description: 'Biased assumptions in code comments and documentation',
                mlWeight: 0.85,
                color: '#dc2626',
                icon: '💭'
            },

            // Data Processing Bias
            dataProcessingBias: {
                patterns: [
                    /\.filter\s*\(\s*.*=>\s*.*\.(race|gender|age|ethnicity|religion|nationality)\s*[!=]==?\s*['"`]/gi,
                    /\.where\s*\(\s*['"`](race|gender|age|ethnicity|religion|nationality)['"`]\s*[!=]==?\s*/gi,
                    /SELECT.*FROM.*WHERE\s+(race|gender|age|ethnicity|religion|nationality)\s*[!=]=\s*['"`]/gi,
                    /GROUP\s+BY\s+(race|gender|age|ethnicity|religion|nationality)/gi,
                    /ORDER\s+BY\s+(race|gender|age|ethnicity|religion|nationality)/gi,
                    /\.sort\s*\(\s*.*\.(race|gender|age|ethnicity|religion)\s*\)/gi
                ],
                severity: 'high',
                description: 'Potentially discriminatory data processing and filtering',
                mlWeight: 0.88,
                color: '#dc2626',
                icon: '🔍'
            },

            // API Endpoint Bias
            apiEndpointBias: {
                patterns: [
                    /\/api\/.*\/(male|female|white|black|asian|hispanic|young|old|rich|poor)/gi,
                    /app\.(get|post|put|delete)\s*\(\s*['"`].*\/(gender|race|age|ethnicity|religion)/gi,
                    /router\.(get|post|put|delete)\s*\(\s*['"`].*\/(male|female|minority|majority)/gi,
                    /endpoint.*\.(male|female|white|black|privileged|underprivileged)/gi
                ],
                severity: 'medium',
                description: 'Potentially discriminatory API endpoints and routing',
                mlWeight: 0.75,
                color: '#f59e0b',
                icon: '🌐'
            },

            // ML Model Bias
            mlModelBias: {
                patterns: [
                    /model\.predict\s*\(\s*.*\.(race|gender|age|ethnicity|religion)\s*\)/gi,
                    /features\s*=\s*\[.*\b(race|gender|age|ethnicity|religion|zipCode|neighborhood)\b.*\]/gi,
                    /X\[['"`](race|gender|age|ethnicity|religion|zipCode)['"`]\]/gi,
                    /training_data.*\.(race|gender|age|ethnicity|religion)/gi,
                    /bias_check\s*=\s*False/gi,
                    /fairness_constraint\s*=\s*None/gi
                ],
                severity: 'critical',
                description: 'Potential bias in machine learning model features and training',
                mlWeight: 0.92,
                color: '#dc2626',
                icon: '🧠'
            },

            // Database Schema Bias
            databaseSchemaBias: {
                patterns: [
                    /CREATE\s+TABLE.*\(\s*.*\b(race|gender|ethnicity|religion)\b.*NOT\s+NULL/gi,
                    /ALTER\s+TABLE.*ADD.*\b(race|gender|ethnicity|religion)\b.*DEFAULT/gi,
                    /INDEX.*ON.*\(\s*(race|gender|age|ethnicity|religion|zipCode)\s*\)/gi,
                    /CONSTRAINT.*CHECK.*\b(race|gender|age)\b.*IN\s*\(/gi
                ],
                severity: 'medium',
                description: 'Potentially problematic database schema design',
                mlWeight: 0.72,
                color: '#f59e0b',
                icon: '🗄️'
            }
        };
    }

    /**
     * Initialize programming language detectors
     */
    initializeLanguageDetectors() {
        return {
            javascript: {
                indicators: ['function', 'const', 'let', 'var', '=>', 'console.log', 'require(', 'import ', 'export '],
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs']
            },
            python: {
                indicators: ['def ', 'import ', 'from ', 'if __name__', 'print(', 'class ', 'self.', 'elif '],
                extensions: ['.py', '.pyw', '.pyx']
            },
            java: {
                indicators: ['public class', 'private ', 'protected ', 'System.out.', 'import java.', 'public static void main'],
                extensions: ['.java', '.class']
            },
            sql: {
                indicators: ['SELECT ', 'FROM ', 'WHERE ', 'INSERT INTO', 'UPDATE ', 'DELETE FROM', 'CREATE TABLE'],
                extensions: ['.sql', '.mysql', '.pgsql']
            },
            cpp: {
                indicators: ['#include', 'std::', 'cout <<', 'cin >>', 'public:', 'private:', 'protected:'],
                extensions: ['.cpp', '.cc', '.cxx', '.c++', '.h', '.hpp']
            }
        };
    }

    /**
     * Detect programming language of the code
     */
    detectProgrammingLanguage(code, filename = '') {
        // Check file extension first
        for (const [lang, config] of Object.entries(this.languageDetectors)) {
            if (config.extensions.some(ext => filename.toLowerCase().endsWith(ext))) {
                return lang;
            }
        }

        // Analyze code content
        const lowerCode = code.toLowerCase();
        const languageScores = {};

        for (const [lang, config] of Object.entries(this.languageDetectors)) {
            languageScores[lang] = config.indicators.filter(indicator => 
                lowerCode.includes(indicator.toLowerCase())
            ).length;
        }

        // Return language with highest score
        const detectedLang = Object.keys(languageScores).reduce((a, b) => 
            languageScores[a] > languageScores[b] ? a : b
        );

        return languageScores[detectedLang] > 0 ? detectedLang : 'unknown';
    }

    /**
     * Advanced code bias analysis
     */
    async analyzeCode(code, options = {}) {
        const startTime = performance.now();
        const analysisId = `code_analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
            // Detect programming language
            const language = this.detectProgrammingLanguage(code, options.filename || '');
            
            // Preprocess code
            const preprocessed = this.preprocessCode(code, language);
            
            // Run all pattern detections in parallel
            const patternResults = await Promise.all([
                this.detectDiscriminatoryLogic(preprocessed),
                this.detectBiasedVariables(preprocessed),
                this.detectBiasedComments(preprocessed),
                this.detectDataProcessingBias(preprocessed),
                this.detectApiEndpointBias(preprocessed),
                this.detectMlModelBias(preprocessed),
                this.detectDatabaseSchemaBias(preprocessed)
            ]);

            // Filter out null results
            const validResults = patternResults.filter(result => result !== null);
            
            // Calculate overall bias score
            const overallScore = this.calculateOverallBiasScore(validResults);
            
            // Generate recommendations
            const recommendations = this.generateCodeRecommendations(validResults, language);
            
            // Create detailed analysis result
            const analysisResult = {
                analysisId,
                language,
                overallScore,
                riskLevel: this.calculateRiskLevel(overallScore),
                patterns: validResults,
                recommendations,
                metadata: {
                    linesOfCode: code.split('\n').length,
                    processingTime: Math.round(performance.now() - startTime),
                    timestamp: new Date().toISOString(),
                    biasTypes: validResults.map(r => r.type),
                    criticalFindings: validResults.filter(r => r.severity === 'critical').length
                }
            };

            // Update performance metrics
            this.updatePerformanceMetrics(analysisResult);
            
            // Store in analysis history
            this.codeAnalysisHistory.push(analysisResult);
            
            return analysisResult;
            
        } catch (error) {
            console.error('Code bias analysis failed:', error);
            return {
                analysisId,
                error: error.message,
                overallScore: 0,
                patterns: [],
                recommendations: [],
                metadata: {
                    processingTime: Math.round(performance.now() - startTime),
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    /**
     * Preprocess code for analysis
     */
    preprocessCode(code, language) {
        return {
            original: code,
            normalized: code.toLowerCase(),
            lines: code.split('\n'),
            language,
            tokens: this.tokenizeCode(code, language)
        };
    }

    /**
     * Simple code tokenization
     */
    tokenizeCode(code, _language) {
        // Basic tokenization - can be enhanced with proper parsers
        return code
            .replace(/\/\*[\s\S]*?\*\//g, ' ') // Remove block comments
            .replace(/\/\/.*$/gm, ' ') // Remove line comments
            .replace(/["'`].*?["'`]/g, ' ') // Remove string literals
            .split(/\s+/)
            .filter(token => token.length > 0);
    }

    /**
     * Detect discriminatory logic patterns
     */
    async detectDiscriminatoryLogic(preprocessed) {
        const pattern = this.codePatterns.discriminatoryLogic;
        const matches = [];

        for (const regex of pattern.patterns) {
            const regexMatches = [...preprocessed.original.matchAll(regex)];
            matches.push(...regexMatches.map(match => ({
                text: match[0],
                index: match.index,
                line: this.getLineNumber(preprocessed.original, match.index)
            })));
        }

        if (matches.length === 0) return null;

        return {
            type: 'discriminatoryLogic',
            severity: pattern.severity,
            description: pattern.description,
            matches: matches.slice(0, 10), // Limit to first 10 matches
            score: this.calculatePatternScore(matches, pattern),
            mlWeight: pattern.mlWeight,
            color: pattern.color,
            icon: pattern.icon,
            recommendations: this.generateDiscriminatoryLogicRecommendations(matches)
        };
    }

    /**
     * Detect biased variable names
     */
    async detectBiasedVariables(preprocessed) {
        const pattern = this.codePatterns.biasedVariables;
        const matches = [];

        for (const regex of pattern.patterns) {
            const regexMatches = [...preprocessed.original.matchAll(regex)];
            matches.push(...regexMatches.map(match => ({
                text: match[0],
                index: match.index,
                line: this.getLineNumber(preprocessed.original, match.index)
            })));
        }

        if (matches.length === 0) return null;

        return {
            type: 'biasedVariables',
            severity: pattern.severity,
            description: pattern.description,
            matches: matches.slice(0, 10),
            score: this.calculatePatternScore(matches, pattern),
            mlWeight: pattern.mlWeight,
            color: pattern.color,
            icon: pattern.icon,
            recommendations: this.generateVariableRecommendations(matches)
        };
    }

    /**
     * Detect biased comments
     */
    async detectBiasedComments(preprocessed) {
        const pattern = this.codePatterns.biasedComments;
        const matches = [];

        for (const regex of pattern.patterns) {
            const regexMatches = [...preprocessed.original.matchAll(regex)];
            matches.push(...regexMatches.map(match => ({
                text: match[0],
                index: match.index,
                line: this.getLineNumber(preprocessed.original, match.index)
            })));
        }

        if (matches.length === 0) return null;

        return {
            type: 'biasedComments',
            severity: pattern.severity,
            description: pattern.description,
            matches: matches.slice(0, 10),
            score: this.calculatePatternScore(matches, pattern),
            mlWeight: pattern.mlWeight,
            color: pattern.color,
            icon: pattern.icon,
            recommendations: this.generateCommentRecommendations(matches)
        };
    }

    /**
     * Detect data processing bias
     */
    async detectDataProcessingBias(preprocessed) {
        const pattern = this.codePatterns.dataProcessingBias;
        const matches = [];

        for (const regex of pattern.patterns) {
            const regexMatches = [...preprocessed.original.matchAll(regex)];
            matches.push(...regexMatches.map(match => ({
                text: match[0],
                index: match.index,
                line: this.getLineNumber(preprocessed.original, match.index)
            })));
        }

        if (matches.length === 0) return null;

        return {
            type: 'dataProcessingBias',
            severity: pattern.severity,
            description: pattern.description,
            matches: matches.slice(0, 10),
            score: this.calculatePatternScore(matches, pattern),
            mlWeight: pattern.mlWeight,
            color: pattern.color,
            icon: pattern.icon,
            recommendations: this.generateDataProcessingRecommendations(matches)
        };
    }

    /**
     * Detect API endpoint bias
     */
    async detectApiEndpointBias(preprocessed) {
        const pattern = this.codePatterns.apiEndpointBias;
        const matches = [];

        for (const regex of pattern.patterns) {
            const regexMatches = [...preprocessed.original.matchAll(regex)];
            matches.push(...regexMatches.map(match => ({
                text: match[0],
                index: match.index,
                line: this.getLineNumber(preprocessed.original, match.index)
            })));
        }

        if (matches.length === 0) return null;

        return {
            type: 'apiEndpointBias',
            severity: pattern.severity,
            description: pattern.description,
            matches: matches.slice(0, 10),
            score: this.calculatePatternScore(matches, pattern),
            mlWeight: pattern.mlWeight,
            color: pattern.color,
            icon: pattern.icon,
            recommendations: this.generateApiRecommendations(matches)
        };
    }

    /**
     * Detect ML model bias
     */
    async detectMlModelBias(preprocessed) {
        const pattern = this.codePatterns.mlModelBias;
        const matches = [];

        for (const regex of pattern.patterns) {
            const regexMatches = [...preprocessed.original.matchAll(regex)];
            matches.push(...regexMatches.map(match => ({
                text: match[0],
                index: match.index,
                line: this.getLineNumber(preprocessed.original, match.index)
            })));
        }

        if (matches.length === 0) return null;

        return {
            type: 'mlModelBias',
            severity: pattern.severity,
            description: pattern.description,
            matches: matches.slice(0, 10),
            score: this.calculatePatternScore(matches, pattern),
            mlWeight: pattern.mlWeight,
            color: pattern.color,
            icon: pattern.icon,
            recommendations: this.generateMlModelRecommendations(matches)
        };
    }

    /**
     * Detect database schema bias
     */
    async detectDatabaseSchemaBias(preprocessed) {
        const pattern = this.codePatterns.databaseSchemaBias;
        const matches = [];

        for (const regex of pattern.patterns) {
            const regexMatches = [...preprocessed.original.matchAll(regex)];
            matches.push(...regexMatches.map(match => ({
                text: match[0],
                index: match.index,
                line: this.getLineNumber(preprocessed.original, match.index)
            })));
        }

        if (matches.length === 0) return null;

        return {
            type: 'databaseSchemaBias',
            severity: pattern.severity,
            description: pattern.description,
            matches: matches.slice(0, 10),
            score: this.calculatePatternScore(matches, pattern),
            mlWeight: pattern.mlWeight,
            color: pattern.color,
            icon: pattern.icon,
            recommendations: this.generateDatabaseRecommendations(matches)
        };
    }

    /**
     * Get line number from character index
     */
    getLineNumber(text, index) {
        return text.substring(0, index).split('\n').length;
    }

    /**
     * Calculate pattern-specific bias score
     */
    calculatePatternScore(matches, pattern) {
        const baseScore = Math.min(matches.length * 15, 85);
        const severityMultiplier = pattern.severity === 'critical' ? 1.2 : 
                                  pattern.severity === 'high' ? 1.1 : 1.0;
        return Math.min(Math.round(baseScore * severityMultiplier), 100);
    }

    /**
     * Calculate overall bias score
     */
    calculateOverallBiasScore(patterns) {
        if (patterns.length === 0) return 0;

        const weightedSum = patterns.reduce((sum, pattern) => {
            return sum + (pattern.score * pattern.mlWeight);
        }, 0);

        const totalWeight = patterns.reduce((sum, pattern) => sum + pattern.mlWeight, 0);
        
        return Math.round(weightedSum / totalWeight);
    }

    /**
     * Calculate risk level
     */
    calculateRiskLevel(score) {
        if (score >= 70) return { level: 'HIGH', color: '#dc2626', emoji: '🚨' };
        if (score >= 40) return { level: 'MODERATE', color: '#f59e0b', emoji: '⚠️' };
        if (score >= 15) return { level: 'LOW', color: '#059669', emoji: '⚡' };
        return { level: 'MINIMAL', color: '#10b981', emoji: '✅' };
    }

    /**
     * Generate code-specific recommendations
     */
    generateCodeRecommendations(patterns, _language) {
        const recommendations = [];

        patterns.forEach(pattern => {
            switch (pattern.type) {
                case 'discriminatoryLogic':
                    recommendations.push(...this.generateDiscriminatoryLogicRecommendations(pattern.matches));
                    break;
                case 'biasedVariables':
                    recommendations.push(...this.generateVariableRecommendations(pattern.matches));
                    break;
                case 'biasedComments':
                    recommendations.push(...this.generateCommentRecommendations(pattern.matches));
                    break;
                case 'dataProcessingBias':
                    recommendations.push(...this.generateDataProcessingRecommendations(pattern.matches));
                    break;
                case 'apiEndpointBias':
                    recommendations.push(...this.generateApiRecommendations(pattern.matches));
                    break;
                case 'mlModelBias':
                    recommendations.push(...this.generateMlModelRecommendations(pattern.matches));
                    break;
                case 'databaseSchemaBias':
                    recommendations.push(...this.generateDatabaseRecommendations(pattern.matches));
                    break;
            }
        });

        return recommendations.slice(0, 10); // Limit to top 10 recommendations
    }

    /**
     * Generate discriminatory logic recommendations
     */
    generateDiscriminatoryLogicRecommendations(_matches) {
        return [
            "🚨 CRITICAL: Remove direct demographic-based conditional logic",
            "🔧 Implement fairness constraints and bias testing",
            "📊 Use demographic-blind features for decision making",
            "⚖️ Add algorithmic auditing and bias monitoring",
            "🛡️ Implement differential privacy techniques"
        ];
    }

    /**
     * Generate variable naming recommendations
     */
    generateVariableRecommendations(_matches) {
        return [
            "📝 Replace biased variable names with inclusive alternatives",
            "🔄 Use 'allowList/denyList' instead of 'whitelist/blacklist'",
            "👥 Use 'primary/secondary' instead of 'master/slave'",
            "⏰ Use 'person-hours' instead of 'man-hours'",
            "🌟 Adopt inclusive naming conventions across codebase"
        ];
    }

    /**
     * Generate comment recommendations  
     */
    generateCommentRecommendations(_matches) {
        return [
            "💭 Remove biased assumptions from code comments",
            "📚 Update documentation to be inclusive and neutral",
            "🎯 Focus on technical functionality rather than demographics",
            "✏️ Review all comments for unconscious bias",
            "📖 Implement inclusive documentation standards"
        ];
    }

    /**
     * Generate data processing recommendations
     */
    generateDataProcessingRecommendations(_matches) {
        return [
            "🔍 Remove demographic-based filtering and sorting",
            "📊 Implement fairness-aware data processing",
            "🛡️ Add bias detection in data pipelines",
            "⚖️ Ensure equal treatment across demographic groups",
            "📈 Monitor data processing for disparate impact"
        ];
    }

    /**
     * Generate API recommendations
     */
    generateApiRecommendations(_matches) {
        return [
            "🌐 Remove demographic-based API endpoints",
            "🔒 Implement demographic-blind API design",
            "📋 Add fairness testing for API responses",
            "🛡️ Monitor API usage for bias patterns",
            "⚖️ Ensure equal API access and functionality"
        ];
    }

    /**
     * Generate ML model recommendations
     */
    generateMlModelRecommendations(_matches) {
        return [
            "🧠 Remove protected attributes from model features",
            "⚖️ Implement fairness constraints in model training",
            "📊 Add bias testing and monitoring for ML models",
            "🔍 Use techniques like adversarial debiasing",
            "📈 Monitor model predictions for disparate impact"
        ];
    }

    /**
     * Generate database recommendations
     */
    generateDatabaseRecommendations(_matches) {
        return [
            "🗄️ Review database schema for bias-inducing design",
            "🔒 Implement privacy-preserving database techniques",
            "📊 Add fairness monitoring for database queries",
            "⚖️ Ensure equal data access and representation",
            "🛡️ Implement differential privacy in database design"
        ];
    }

    /**
     * Update performance metrics
     */
    updatePerformanceMetrics(analysisResult) {
        this.performanceMetrics.totalCodeAnalyses++;
        
        // Update average processing time
        const currentAvg = this.performanceMetrics.averageProcessingTime;
        const newTime = analysisResult.metadata.processingTime;
        this.performanceMetrics.averageProcessingTime = 
            Math.round((currentAvg * (this.performanceMetrics.totalCodeAnalyses - 1) + newTime) / this.performanceMetrics.totalCodeAnalyses);
        
        // Update critical bias detection count
        if (analysisResult.metadata.criticalFindings > 0) {
            this.performanceMetrics.criticalBiasDetected++;
        }
        
        // Update accuracy score (simplified)
        this.performanceMetrics.accuracyScore = 
            Math.round((this.performanceMetrics.criticalBiasDetected / this.performanceMetrics.totalCodeAnalyses) * 100);
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performanceMetrics,
            analysisHistory: this.codeAnalysisHistory.length
        };
    }

    /**
     * Get analysis history
     */
    getAnalysisHistory(limit = 10) {
        return this.codeAnalysisHistory.slice(-limit).reverse();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeBiasDetectionEngine;
}

// Global instance for browser usage
if (typeof window !== 'undefined') {
    window.CodeBiasDetectionEngine = CodeBiasDetectionEngine;
}