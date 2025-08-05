/**
 * BiasGuard Interactive Tutorials System
 * AI-powered contextual learning for statistical features
 * Version 1.0.0 - Following 2025 interactive documentation best practices
 */

class InteractiveTutorialSystem {
    constructor() {
        this.tutorials = new Map();
        this.currentTutorial = null;
        this.userProgress = this.loadProgress();
        this.analyticsEngine = new TutorialAnalytics();
        
        this.initializeTutorials();
        this.setupEventListeners();
    }

    initializeTutorials() {
        // Statistical Features Tutorials
        this.registerTutorial('statistical-significance', {
            title: 'Understanding Statistical Significance in Bias Detection',
            description: 'Learn how p-values, confidence intervals, and effect sizes validate bias findings',
            difficulty: 'intermediate',
            estimatedTime: '8 minutes',
            prerequisites: ['basic-statistics'],
            steps: [
                {
                    id: 'intro-pvalue',
                    title: 'What is a P-Value?',
                    content: 'A p-value measures the probability of observing your results by chance alone.',
                    interactive: {
                        type: 'simulation',
                        component: 'PValueSimulator',
                        data: {
                            sampleSize: 100,
                            effectSize: 0.3,
                            alpha: 0.05
                        }
                    },
                    validation: {
                        type: 'quiz',
                        question: 'What does a p-value of 0.03 mean?',
                        options: [
                            '3% chance the null hypothesis is true',
                            '3% chance of observing this result if no bias exists',
                            '97% confidence in bias detection',
                            '3% margin of error'
                        ],
                        correct: 1,
                        explanation: 'A p-value of 0.03 means there\'s a 3% chance of observing this result if no bias actually exists.'
                    }
                },
                {
                    id: 'confidence-intervals',
                    title: 'Confidence Intervals: Measuring Uncertainty',
                    content: 'Confidence intervals show the range where the true bias score likely falls.',
                    interactive: {
                        type: 'calculator',
                        component: 'ConfidenceIntervalCalculator',
                        data: {
                            biasScore: 75,
                            sampleSize: 500,
                            confidenceLevel: 0.95
                        }
                    },
                    validation: {
                        type: 'hands-on',
                        task: 'Calculate a 95% confidence interval for a bias score of 82 with n=200',
                        expectedRange: [78.1, 85.9],
                        tolerance: 1.0
                    }
                },
                {
                    id: 'effect-size',
                    title: 'Effect Size: Practical Significance',
                    content: 'Cohen\'s d measures how meaningful a bias finding is in practical terms.',
                    interactive: {
                        type: 'comparison',
                        component: 'EffectSizeComparator',
                        scenarios: [
                            { d: 0.1, interpretation: 'small' },
                            { d: 0.5, interpretation: 'medium' },
                            { d: 0.8, interpretation: 'large' }
                        ]
                    },
                    validation: {
                        type: 'interpretation',
                        scenario: 'A bias detection shows Cohen\'s d = 1.2',
                        question: 'How would you interpret this effect size?',
                        expectedKeywords: ['large', 'substantial', 'meaningful', 'significant']
                    }
                }
            ],
            completion: {
                certificate: true,
                badge: 'statistical-expert',
                nextRecommendations: ['intersectional-analysis', 'geopolitical-bias']
            }
        });

        this.registerTutorial('intersectional-analysis', {
            title: 'Intersectional Bias Analysis: Understanding Compound Discrimination',
            description: 'Explore how multiple identity attributes interact to create unique bias patterns',
            difficulty: 'advanced',
            estimatedTime: '12 minutes',
            prerequisites: ['statistical-significance', 'basic-bias-detection'],
            steps: [
                {
                    id: 'intersectionality-theory',
                    title: 'Intersectionality: Beyond Single Attributes',
                    content: 'Intersectionality theory reveals how race, gender, age, and other attributes combine to create unique experiences of bias.',
                    interactive: {
                        type: 'visualization',
                        component: 'IntersectionVennDiagram',
                        attributes: ['gender', 'race', 'age'],
                        showOverlaps: true,
                        highlightCompounds: true
                    },
                    validation: {
                        type: 'scenario',
                        question: 'A resume study shows bias against "Maria Rodriguez" but not "Maria Smith" or "John Rodriguez". What does this suggest?',
                        expectedConcepts: ['intersectional', 'compound', 'multiple-attributes']
                    }
                },
                {
                    id: 'amplification-factors',
                    title: 'Bias Amplification in Intersections',
                    content: 'Some identity combinations face amplified bias beyond what individual attributes would predict.',
                    interactive: {
                        type: 'data-explorer',
                        component: 'AmplificationAnalyzer',
                        dataset: 'hiring-bias-intersectional',
                        metrics: ['individual-bias', 'intersectional-bias', 'amplification-factor']
                    },
                    validation: {
                        type: 'calculation',
                        task: 'Calculate the amplification factor for young Black women in hiring',
                        formula: 'intersectional_bias / (gender_bias + race_bias + age_bias)',
                        expectedRange: [1.2, 1.8]
                    }
                },
                {
                    id: 'detection-strategies',
                    title: 'Advanced Detection Techniques',
                    content: 'Learn specialized methods for identifying intersectional bias patterns.',
                    interactive: {
                        type: 'tool-demo',
                        component: 'IntersectionalDetector',
                        sampleText: 'The candidate has excellent qualifications but may not be a culture fit for our fast-paced startup environment.',
                        attributes: ['age', 'gender', 'race'],
                        showAnalysis: true
                    },
                    validation: {
                        type: 'analysis',
                        text: 'She\'s very articulate for someone from that background.',
                        question: 'Identify the intersectional bias patterns present',
                        expectedPatterns: ['race-language', 'gender-competence', 'compound-stereotyping']
                    }
                }
            ],
            completion: {
                certificate: true,
                badge: 'intersectional-expert',
                nextRecommendations: ['geopolitical-bias', 'advanced-mitigation']
            }
        });

        this.registerTutorial('geopolitical-bias', {
            title: 'Geopolitical Bias Detection: Global Perspectives',
            description: 'Identify nationality, cultural, and geographic bias in international contexts',
            difficulty: 'advanced',
            estimatedTime: '10 minutes',
            prerequisites: ['basic-bias-detection'],
            steps: [
                {
                    id: 'nationality-bias',
                    title: 'Nationality and Origin Bias',
                    content: 'Detect subtle biases based on country of origin, accent, or cultural background.',
                    interactive: {
                        type: 'text-analyzer',
                        component: 'GeopoliticalAnalyzer',
                        samples: [
                            'The candidate has strong technical skills despite English being their second language.',
                            'We need someone who understands Western business practices.',
                            'Their work ethic is typical of their culture.'
                        ],
                        showRegionalContext: true
                    },
                    validation: {
                        type: 'identification',
                        text: 'He\'s surprisingly punctual for someone from that region.',
                        question: 'What type of geopolitical bias is present?',
                        options: ['nationality-stereotyping', 'cultural-assumptions', 'regional-prejudice', 'all-of-the-above'],
                        correct: 3
                    }
                },
                {
                    id: 'cultural-context',
                    title: 'Cultural Context Awareness',
                    content: 'Understanding how cultural norms affect bias perception across different regions.',
                    interactive: {
                        type: 'cultural-mapper',
                        component: 'CulturalContextVisualizer',
                        regions: ['North America', 'Europe', 'Asia', 'Africa', 'South America'],
                        biasTypes: ['directness', 'hierarchy', 'individualism', 'time-orientation']
                    },
                    validation: {
                        type: 'cultural-awareness',
                        scenario: 'A hiring manager says: "We need someone who can work independently without constant supervision."',
                        question: 'How might this be perceived differently across cultures?',
                        expectedInsights: ['individualism-bias', 'cultural-work-styles', 'implicit-assumptions']
                    }
                }
            ],
            completion: {
                certificate: true,
                badge: 'global-bias-expert',
                nextRecommendations: ['advanced-mitigation', 'real-world-applications']
            }
        });

        this.registerTutorial('api-integration', {
            title: 'BiasGuard API Integration: From GraphQL to Production',
            description: 'Master the BiasGuard GraphQL API with hands-on examples and best practices',
            difficulty: 'intermediate',
            estimatedTime: '15 minutes',
            prerequisites: ['basic-graphql'],
            steps: [
                {
                    id: 'graphql-basics',
                    title: 'GraphQL Query Fundamentals',
                    content: 'Learn to construct efficient queries for bias analysis data.',
                    interactive: {
                        type: 'query-builder',
                        component: 'GraphQLPlayground',
                        endpoint: '/graphql',
                        schema: 'biasguard-schema',
                        examples: [
                            {
                                name: 'Basic Analysis Query',
                                query: `query GetAnalysis($id: ID!) {
  analysis(id: $id) {
    id
    overallScore
    confidence
    patterns {
      type
      severity
      description
    }
    timestamp
  }
}`
                            },
                            {
                                name: 'Real-time Metrics',
                                query: `query GetMetrics {
  realTimeMetrics {
                                    totalAnalyses
    biasDetectionRate
    avgConfidence
    currentLoad
  }
}`
                            }
                        ]
                    },
                    validation: {
                        type: 'query-construction',
                        task: 'Write a query to get intersectional analysis results with statistical significance',
                        requiredFields: ['intersectionalAnalysis', 'statisticalSignificance', 'compoundBiasScore'],
                        validateSyntax: true
                    }
                },
                {
                    id: 'mutations-subscriptions',
                    title: 'Mutations and Real-time Subscriptions',
                    content: 'Submit analysis requests and receive real-time updates.',
                    interactive: {
                        type: 'live-demo',
                        component: 'MutationDemo',
                        features: ['submit-analysis', 'real-time-updates', 'error-handling']
                    },
                    validation: {
                        type: 'implementation',
                        task: 'Implement a subscription for analysis completion notifications',
                        codeTemplate: `subscription AnalysisUpdates {
  // Your subscription here
}`,
                        expectedSubscription: 'analysisCompleted'
                    }
                },
                {
                    id: 'error-handling',
                    title: 'Production-Ready Error Handling',
                    content: 'Implement robust error handling for reliable applications.',
                    interactive: {
                        type: 'error-simulator',
                        component: 'ErrorHandlingDemo',
                        scenarios: ['network-timeout', 'invalid-input', 'rate-limiting', 'server-error']
                    },
                    validation: {
                        type: 'code-review',
                        task: 'Review and improve this error handling code',
                        code: `try {
  const result = await client.query({ query: GET_ANALYSIS });
  return result.data;
} catch (error) {
  console.error(error);
}`,
                        improvements: ['specific-error-types', 'user-friendly-messages', 'retry-logic', 'fallback-handling']
                    }
                }
            ],
            completion: {
                certificate: true,
                badge: 'api-integration-expert',
                nextRecommendations: ['advanced-analytics', 'production-deployment']
            }
        });
    }

    registerTutorial(id, tutorial) {
        tutorial.id = id;
        tutorial.createdAt = new Date().toISOString();
        tutorial.version = '1.0.0';
        this.tutorials.set(id, tutorial);
    }

    async startTutorial(tutorialId, options = {}) {
        const tutorial = this.tutorials.get(tutorialId);
        if (!tutorial) {
            throw new Error(`Tutorial ${tutorialId} not found`);
        }

        // Check prerequisites
        if (tutorial.prerequisites && tutorial.prerequisites.length > 0) {
            const unmetPrereqs = tutorial.prerequisites.filter(
                prereq => !this.userProgress.completed.includes(prereq)
            );
            
            if (unmetPrereqs.length > 0 && !options.skipPrerequisites) {
                return {
                    success: false,
                    error: 'Prerequisites not met',
                    unmetPrerequisites: unmetPrereqs,
                    recommendedOrder: this.getRecommendedLearningPath(unmetPrereqs)
                };
            }
        }

        this.currentTutorial = {
            ...tutorial,
            startedAt: new Date().toISOString(),
            currentStep: 0,
            stepProgress: {},
            userAnswers: {},
            hints: 0,
            timeSpent: 0
        };

        // Track analytics
        this.analyticsEngine.trackTutorialStart(tutorialId, {
            userLevel: this.getUserLevel(),
            prerequisitesMet: tutorial.prerequisites?.every(p => 
                this.userProgress.completed.includes(p)
            ) ?? true
        });

        return {
            success: true,
            tutorial: this.currentTutorial,
            firstStep: this.getCurrentStep()
        };
    }

    getCurrentStep() {
        if (!this.currentTutorial) return null;
        
        const step = this.currentTutorial.steps[this.currentTutorial.currentStep];
        return {
            ...step,
            stepNumber: this.currentTutorial.currentStep + 1,
            totalSteps: this.currentTutorial.steps.length,
            progress: ((this.currentTutorial.currentStep) / this.currentTutorial.steps.length) * 100
        };
    }

    async submitStepAnswer(stepId, answer) {
        if (!this.currentTutorial) {
            throw new Error('No active tutorial');
        }

        const currentStep = this.getCurrentStep();
        if (currentStep.id !== stepId) {
            throw new Error('Step mismatch');
        }

        // Store user answer
        this.currentTutorial.userAnswers[stepId] = {
            answer,
            timestamp: new Date().toISOString(),
            attempts: (this.currentTutorial.userAnswers[stepId]?.attempts || 0) + 1
        };

        // Validate answer
        const validation = await this.validateStepAnswer(currentStep, answer);
        
        // Track analytics
        this.analyticsEngine.trackStepCompletion(stepId, {
            correct: validation.correct,
            attempts: this.currentTutorial.userAnswers[stepId].attempts,
            timeSpent: validation.timeSpent,
            hintsUsed: validation.hintsUsed
        });

        if (validation.correct) {
            this.currentTutorial.stepProgress[stepId] = {
                completed: true,
                score: validation.score,
                completedAt: new Date().toISOString()
            };

            // Move to next step
            if (this.currentTutorial.currentStep < this.currentTutorial.steps.length - 1) {
                this.currentTutorial.currentStep++;
                return {
                    correct: true,
                    nextStep: this.getCurrentStep(),
                    feedback: validation.feedback
                };
            } else {
                // Tutorial completed
                return await this.completeTutorial();
            }
        } else {
            return {
                correct: false,
                feedback: validation.feedback,
                hint: validation.hint,
                allowRetry: true,
                currentStep: currentStep
            };
        }
    }

    async validateStepAnswer(step, answer) {
        const validation = step.validation;
        let result = { correct: false, feedback: '', score: 0 };

        switch (validation.type) {
            case 'quiz':
                result.correct = answer === validation.correct;
                result.feedback = result.correct 
                    ? 'Correct! ' + validation.explanation
                    : 'Not quite. ' + validation.explanation;
                result.score = result.correct ? 100 : 0;
                break;

            case 'hands-on':
                const numericAnswer = parseFloat(answer);
                const expectedRange = validation.expectedRange;
                result.correct = numericAnswer >= expectedRange[0] && numericAnswer <= expectedRange[1];
                result.feedback = result.correct
                    ? `Excellent! Your answer of ${numericAnswer} is within the expected range.`
                    : `Your answer of ${numericAnswer} is outside the expected range of ${expectedRange[0]} - ${expectedRange[1]}.`;
                result.score = result.correct ? 100 : Math.max(0, 100 - Math.abs(numericAnswer - ((expectedRange[0] + expectedRange[1]) / 2)) * 10);
                break;

            case 'interpretation':
                const keywords = validation.expectedKeywords;
                const answerLower = answer.toLowerCase();
                const matchedKeywords = keywords.filter(keyword => answerLower.includes(keyword.toLowerCase()));
                result.correct = matchedKeywords.length >= Math.ceil(keywords.length * 0.6);
                result.score = (matchedKeywords.length / keywords.length) * 100;
                result.feedback = result.correct
                    ? `Great interpretation! You identified key concepts: ${matchedKeywords.join(', ')}`
                    : `Good start. Try to include concepts like: ${keywords.slice(0, 2).join(', ')}`;
                break;

            case 'code-review':
                // This would integrate with a code analysis service
                result = await this.analyzeCode(answer, validation);
                break;

            default:
                result.correct = true;
                result.feedback = 'Step completed';
                result.score = 100;
        }

        return result;
    }

    async completeTutorial() {
        if (!this.currentTutorial) return null;

        const tutorialId = this.currentTutorial.id;
        const completionData = {
            tutorialId,
            completedAt: new Date().toISOString(),
            totalTime: Date.now() - new Date(this.currentTutorial.startedAt).getTime(),
            stepScores: Object.values(this.currentTutorial.stepProgress).map(p => p.score),
            overallScore: this.calculateOverallScore(),
            hintsUsed: this.currentTutorial.hints,
            attempts: Object.values(this.currentTutorial.userAnswers).reduce((sum, a) => sum + a.attempts, 0)
        };

        // Update user progress
        this.userProgress.completed.push(tutorialId);
        this.userProgress.scores[tutorialId] = completionData.overallScore;
        this.userProgress.totalTime += completionData.totalTime;
        this.saveProgress();

        // Award completion rewards
        const completion = this.currentTutorial.completion;
        if (completion.badge) {
            this.userProgress.badges.push(completion.badge);
        }

        // Track analytics
        this.analyticsEngine.trackTutorialCompletion(tutorialId, completionData);

        // Generate certificate if earned
        let certificate = null;
        if (completion.certificate && completionData.overallScore >= 70) {
            certificate = await this.generateCertificate(tutorialId, completionData);
        }

        const result = {
            success: true,
            completed: true,
            ...completionData,
            certificate,
            nextRecommendations: this.getNextRecommendations(tutorialId),
            newBadges: completion.badge ? [completion.badge] : [],
            userLevel: this.getUserLevel()
        };

        this.currentTutorial = null;
        return result;
    }

    calculateOverallScore() {
        if (!this.currentTutorial) return 0;
        
        const scores = Object.values(this.currentTutorial.stepProgress).map(p => p.score || 0);
        return scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
    }

    async generateCertificate(tutorialId, completionData) {
        const tutorial = this.tutorials.get(tutorialId);
        return {
            id: `cert_${tutorialId}_${Date.now()}`,
            tutorialTitle: tutorial.title,
            recipientName: this.userProgress.name || 'BiasGuard User',
            completionDate: completionData.completedAt,
            score: completionData.overallScore,
            certificateUrl: `/certificates/${tutorialId}/${completionData.completedAt}`,
            verificationCode: this.generateVerificationCode(tutorialId, completionData.completedAt),
            issuer: 'BiasGuard Expert Learning System',
            skills: this.getSkillsFromTutorial(tutorial)
        };
    }

    getSkillsFromTutorial(tutorial) {
        const skillMap = {
            'statistical-significance': ['Statistical Analysis', 'P-Value Interpretation', 'Confidence Intervals', 'Effect Size Analysis'],
            'intersectional-analysis': ['Intersectionality Theory', 'Compound Bias Detection', 'Multi-Attribute Analysis'],
            'geopolitical-bias': ['Cultural Awareness', 'Nationality Bias Detection', 'Global Perspective'],
            'api-integration': ['GraphQL', 'API Integration', 'Error Handling', 'Real-time Systems']
        };
        
        return skillMap[tutorial.id] || ['Bias Detection', 'Critical Analysis'];
    }

    getNextRecommendations(completedTutorialId) {
        const completed = this.tutorials.get(completedTutorialId);
        if (!completed?.completion?.nextRecommendations) return [];

        return completed.completion.nextRecommendations
            .filter(id => !this.userProgress.completed.includes(id))
            .map(id => ({
                id,
                tutorial: this.tutorials.get(id),
                readyToStart: this.checkPrerequisites(id),
                estimatedTime: this.tutorials.get(id)?.estimatedTime
            }));
    }

    checkPrerequisites(tutorialId) {
        const tutorial = this.tutorials.get(tutorialId);
        if (!tutorial?.prerequisites) return true;
        
        return tutorial.prerequisites.every(prereq => 
            this.userProgress.completed.includes(prereq)
        );
    }

    getUserLevel() {
        const completedCount = this.userProgress.completed.length;
        const avgScore = this.getAverageScore();
        
        if (completedCount >= 5 && avgScore >= 85) return 'expert';
        if (completedCount >= 3 && avgScore >= 75) return 'advanced';
        if (completedCount >= 1 && avgScore >= 60) return 'intermediate';
        return 'beginner';
    }

    getAverageScore() {
        const scores = Object.values(this.userProgress.scores);
        return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    }

    generateVerificationCode(tutorialId, completionDate) {
        const data = `${tutorialId}-${completionDate}-${this.userProgress.id || 'anonymous'}`;
        return btoa(data).slice(0, 12).toUpperCase();
    }

    loadProgress() {
        const saved = localStorage.getItem('biasguard-tutorial-progress');
        return saved ? JSON.parse(saved) : {
            id: `user_${Date.now()}`,
            completed: [],
            scores: {},
            badges: [],
            totalTime: 0,
            createdAt: new Date().toISOString()
        };
    }

    saveProgress() {
        localStorage.setItem('biasguard-tutorial-progress', JSON.stringify(this.userProgress));
    }

    setupEventListeners() {
        // Listen for tutorial navigation events
        document.addEventListener('tutorial-navigation', (event) => {
            this.handleNavigation(event.detail);
        });

        // Track time spent
        if (this.currentTutorial) {
            this.timeTracker = setInterval(() => {
                this.currentTutorial.timeSpent += 1000;
            }, 1000);
        }
    }

    // Public API methods
    getTutorialList(filter = {}) {
        const tutorials = Array.from(this.tutorials.values());
        
        return tutorials
            .filter(tutorial => {
                if (filter.difficulty && tutorial.difficulty !== filter.difficulty) return false;
                if (filter.completed !== undefined) {
                    const isCompleted = this.userProgress.completed.includes(tutorial.id);
                    if (filter.completed !== isCompleted) return false;
                }
                if (filter.available !== undefined) {
                    const isAvailable = this.checkPrerequisites(tutorial.id);
                    if (filter.available !== isAvailable) return false;
                }
                return true;
            })
            .map(tutorial => ({
                ...tutorial,
                completed: this.userProgress.completed.includes(tutorial.id),
                available: this.checkPrerequisites(tutorial.id),
                userScore: this.userProgress.scores[tutorial.id],
                estimatedTimeRemaining: tutorial.estimatedTime
            }))
            .sort((a, b) => {
                // Sort by: available first, then by difficulty, then by completion
                if (a.available !== b.available) return b.available - a.available;
                
                const difficultyOrder = { 'beginner': 0, 'intermediate': 1, 'advanced': 2 };
                const aDiff = difficultyOrder[a.difficulty] || 1;
                const bDiff = difficultyOrder[b.difficulty] || 1;
                
                return aDiff - bDiff;
            });
    }

    getUserStats() {
        return {
            level: this.getUserLevel(),
            completedTutorials: this.userProgress.completed.length,
            totalTutorials: this.tutorials.size,
            averageScore: this.getAverageScore(),
            totalTimeSpent: this.userProgress.totalTime,
            badges: this.userProgress.badges,
            currentStreak: this.calculateCurrentStreak(),
            nextLevelProgress: this.getNextLevelProgress()
        };
    }

    calculateCurrentStreak() {
        // Calculate consecutive days with tutorial activity
        // This would be implemented based on completion timestamps
        return 0; // Placeholder
    }

    getNextLevelProgress() {
        const currentLevel = this.getUserLevel();
        const levels = { 'beginner': 0, 'intermediate': 1, 'advanced': 2, 'expert': 3 };
        const currentLevelNum = levels[currentLevel];
        
        if (currentLevelNum === 3) return { progress: 100, nextLevel: 'expert', message: 'Maximum level reached!' };
        
        const nextLevel = Object.keys(levels)[currentLevelNum + 1];
        const progress = Math.min(100, (this.userProgress.completed.length / (currentLevelNum * 2 + 3)) * 100);
        
        return {
            progress: Math.round(progress),
            nextLevel,
            tutorialsRemaining: Math.max(0, (currentLevelNum * 2 + 3) - this.userProgress.completed.length)
        };
    }
}

// Tutorial Analytics Engine
class TutorialAnalytics {
    constructor() {
        this.events = [];
        this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    trackTutorialStart(tutorialId, metadata) {
        this.trackEvent('tutorial_started', {
            tutorialId,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            ...metadata
        });
    }

    trackStepCompletion(stepId, metadata) {
        this.trackEvent('step_completed', {
            stepId,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            ...metadata
        });
    }

    trackTutorialCompletion(tutorialId, completionData) {
        this.trackEvent('tutorial_completed', {
            tutorialId,
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            ...completionData
        });
    }

    trackEvent(eventType, data) {
        this.events.push({ eventType, data });
        
        // In a real implementation, this would send to an analytics service
        if (window.gtag) {
            window.gtag('event', eventType, data);
        }
        
        console.log(`[Tutorial Analytics] ${eventType}:`, data);
    }

    getAnalytics() {
        return {
            sessionId: this.sessionId,
            events: this.events,
            summary: this.generateSummary()
        };
    }

    generateSummary() {
        const tutorialStarts = this.events.filter(e => e.eventType === 'tutorial_started').length;
        const tutorialCompletions = this.events.filter(e => e.eventType === 'tutorial_completed').length;
        const stepCompletions = this.events.filter(e => e.eventType === 'step_completed').length;
        
        return {
            tutorialsStarted: tutorialStarts,
            tutorialsCompleted: tutorialCompletions,
            completionRate: tutorialStarts > 0 ? (tutorialCompletions / tutorialStarts) * 100 : 0,
            totalStepsCompleted: stepCompletions,
            avgStepsPerTutorial: tutorialStarts > 0 ? stepCompletions / tutorialStarts : 0
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InteractiveTutorialSystem, TutorialAnalytics };
} else if (typeof window !== 'undefined') {
    window.InteractiveTutorialSystem = InteractiveTutorialSystem;
    window.TutorialAnalytics = TutorialAnalytics;
}