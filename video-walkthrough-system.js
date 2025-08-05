/**
 * BiasGuard Video Walkthrough System
 * Interactive video tutorials with AI-powered guidance
 * Version 1.0.0 - Following 2025 multimedia learning best practices
 */

class VideoWalkthroughSystem {
    constructor(options = {}) {
        this.options = {
            autoPlay: false,
            showTranscripts: true,
            interactiveOverlays: true,
            adaptiveQuality: true,
            analytics: true,
            aiNarration: false,
            ...options
        };

        this.videoLibrary = new VideoLibrary();
        this.playerManager = new InteractiveVideoPlayer();
        this.overlaySystem = new InteractiveOverlaySystem();
        this.progressTracker = new VideoProgressTracker();
        this.aiNarrator = new AIVideoNarrator();
        
        this.currentVideo = null;
        this.userProgress = this.loadUserProgress();
        this.analytics = new VideoAnalytics();
        
        this.initialize();
    }

    initialize() {
        this.setupVideoLibrary();
        this.createVideoInterface();
        this.initializePlayer();
        this.setupEventListeners();
    }

    setupVideoLibrary() {
        // Statistical Significance Walkthrough
        this.videoLibrary.addVideo('statistical-significance-deep-dive', {
            title: 'Statistical Significance Deep Dive',
            description: 'Master p-values, confidence intervals, and effect sizes in bias detection',
            duration: 480, // 8 minutes
            difficulty: 'intermediate',
            category: 'statistical-analysis',
            tags: ['statistics', 'p-values', 'confidence-intervals', 'effect-size'],
            prerequisites: ['bias-detection-basics'],
            learningObjectives: [
                'Understand what p-values really mean in bias detection',
                'Interpret confidence intervals correctly',
                'Calculate and interpret Cohen\'s d effect sizes',
                'Apply statistical significance in real-world scenarios'
            ],
            chapters: [
                {
                    id: 'intro',
                    title: 'Introduction to Statistical Significance',
                    startTime: 0,
                    duration: 60,
                    keyPoints: ['Why statistics matter in bias detection', 'Common misconceptions'],
                    interactiveElements: [
                        {
                            type: 'quiz',
                            time: 45,
                            question: 'What does statistical significance tell us?',
                            options: [
                                'The result is important',
                                'The result is unlikely due to chance',
                                'The result is correct',
                                'The sample size is large'
                            ],
                            correct: 1
                        }
                    ]
                },
                {
                    id: 'pvalues',
                    title: 'Understanding P-Values',
                    startTime: 60,
                    duration: 120,
                    keyPoints: ['P-value definition', 'Common misinterpretations', 'Practical examples'],
                    interactiveElements: [
                        {
                            type: 'simulation',
                            time: 120,
                            component: 'PValueSimulator',
                            description: 'Adjust sample size and effect size to see how p-values change'
                        },
                        {
                            type: 'exercise',
                            time: 150,
                            task: 'Calculate p-value for given scenario',
                            expectedAnswer: 0.03,
                            tolerance: 0.01
                        }
                    ]
                },
                {
                    id: 'confidence-intervals',
                    title: 'Confidence Intervals Explained',
                    startTime: 180,
                    duration: 120,
                    keyPoints: ['CI interpretation', 'Relationship to p-values', 'Practical applications'],
                    interactiveElements: [
                        {
                            type: 'calculator',
                            time: 240,
                            component: 'ConfidenceIntervalCalculator',
                            description: 'Calculate confidence intervals for different scenarios'
                        }
                    ]
                },
                {
                    id: 'effect-size',
                    title: 'Effect Size and Practical Significance',
                    startTime: 300,
                    duration: 120,
                    keyPoints: ['Cohen\'s d calculation', 'Practical vs statistical significance', 'Real-world interpretation'],
                    interactiveElements: [
                        {
                            type: 'comparison',
                            time: 360,
                            scenarios: [
                                { pValue: 0.001, effectSize: 0.1, interpretation: 'statistically significant but small effect' },
                                { pValue: 0.08, effectSize: 1.2, interpretation: 'not statistically significant but large effect' }
                            ]
                        }
                    ]
                },
                {
                    id: 'real-world-application',
                    title: 'Real-World Application',
                    startTime: 420,
                    duration: 60,
                    keyPoints: ['Combining all concepts', 'Decision-making framework', 'Common pitfalls'],
                    interactiveElements: [
                        {
                            type: 'case-study',
                            time: 450,
                            scenario: 'Hiring bias analysis with statistical validation',
                            expectedActions: ['check-pvalue', 'examine-ci', 'calculate-effect-size', 'make-recommendation']
                        }
                    ]
                }
            ],
            videoFiles: {
                '1080p': '/videos/statistical-significance-1080p.mp4',
                '720p': '/videos/statistical-significance-720p.mp4',
                '480p': '/videos/statistical-significance-480p.mp4'
            },
            subtitles: {
                'en': '/subtitles/statistical-significance-en.vtt',
                'es': '/subtitles/statistical-significance-es.vtt',
                'fr': '/subtitles/statistical-significance-fr.vtt'
            },
            transcript: '/transcripts/statistical-significance.txt',
            relatedContent: ['intersectional-analysis', 'geopolitical-bias'],
            completion: {
                certificate: true,
                badge: 'statistical-analysis-expert',
                nextRecommendations: ['advanced-statistical-methods', 'bias-mitigation-strategies']
            }
        });

        // Intersectional Analysis Walkthrough
        this.videoLibrary.addVideo('intersectional-analysis-masterclass', {
            title: 'Intersectional Bias Analysis Masterclass',
            description: 'Comprehensive guide to detecting and analyzing compound discrimination patterns',
            duration: 720, // 12 minutes
            difficulty: 'advanced',
            category: 'advanced-analysis',
            tags: ['intersectionality', 'compound-bias', 'multi-attribute', 'amplification'],
            prerequisites: ['bias-detection-basics', 'statistical-significance-deep-dive'],
            learningObjectives: [
                'Understand intersectionality theory and its applications',
                'Identify compound bias patterns in real data',
                'Calculate amplification factors',
                'Design intersectional bias mitigation strategies'
            ],
            chapters: [
                {
                    id: 'theory-foundation',
                    title: 'Intersectionality Theory Foundation',
                    startTime: 0,
                    duration: 120,
                    keyPoints: ['Kimberlé Crenshaw\'s framework', 'Beyond additive models', 'Unique intersectional experiences'],
                    interactiveElements: [
                        {
                            type: 'visualization',
                            time: 60,
                            component: 'IntersectionalityVennDiagram',
                            description: 'Explore how different identity attributes intersect'
                        }
                    ]
                },
                {
                    id: 'detection-methods',
                    title: 'Advanced Detection Methods',
                    startTime: 120,
                    duration: 180,
                    keyPoints: ['Algorithmic approaches', 'Statistical methods', 'Pattern recognition'],
                    interactiveElements: [
                        {
                            type: 'demo',
                            time: 180,
                            component: 'IntersectionalDetector',
                            description: 'See how our algorithm identifies intersectional bias patterns'
                        },
                        {
                            type: 'hands-on',
                            time: 240,
                            task: 'Analyze a resume for intersectional bias',
                            expectedPatterns: ['gender-race', 'age-nationality', 'compound-stereotyping']
                        }
                    ]
                },
                {
                    id: 'amplification-analysis',
                    title: 'Bias Amplification Analysis',
                    startTime: 300,
                    duration: 150,
                    keyPoints: ['Amplification factors', 'Non-linear effects', 'Measurement techniques'],
                    interactiveElements: [
                        {
                            type: 'calculator',
                            time: 360,
                            component: 'AmplificationCalculator',
                            description: 'Calculate amplification factors for different intersections'
                        }
                    ]
                },
                {
                    id: 'case-studies',
                    title: 'Real-World Case Studies',
                    startTime: 450,
                    duration: 180,
                    keyPoints: ['Hiring discrimination', 'Healthcare disparities', 'Educational bias'],
                    interactiveElements: [
                        {
                            type: 'case-analysis',
                            time: 540,
                            cases: [
                                {
                                    title: 'Tech Company Hiring Bias',
                                    description: 'Analysis of intersectional bias in software engineering recruitment',
                                    data: 'hiring-bias-dataset.json',
                                    expectedFindings: ['young-women-penalty', 'older-minority-exclusion']
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'mitigation-strategies',
                    title: 'Mitigation and Intervention Strategies',
                    startTime: 630,
                    duration: 90,
                    keyPoints: ['Targeted interventions', 'Systemic changes', 'Monitoring approaches'],
                    interactiveElements: [
                        {
                            type: 'strategy-builder',
                            time: 660,
                            component: 'MitigationPlanner',
                            description: 'Design comprehensive mitigation strategies for intersectional bias'
                        }
                    ]
                }
            ],
            videoFiles: {
                '1080p': '/videos/intersectional-analysis-1080p.mp4',
                '720p': '/videos/intersectional-analysis-720p.mp4',
                '480p': '/videos/intersectional-analysis-480p.mp4'
            },
            subtitles: {
                'en': '/subtitles/intersectional-analysis-en.vtt',
                'es': '/subtitles/intersectional-analysis-es.vtt',
                'fr': '/subtitles/intersectional-analysis-fr.vtt'
            },
            transcript: '/transcripts/intersectional-analysis.txt',
            relatedContent: ['geopolitical-bias', 'advanced-statistical-methods'],
            completion: {
                certificate: true,
                badge: 'intersectional-expert',
                nextRecommendations: ['bias-mitigation-strategies', 'policy-development']
            }
        });

        // API Integration Walkthrough
        this.videoLibrary.addVideo('graphql-api-integration-guide', {
            title: 'GraphQL API Integration Complete Guide',
            description: 'Master the BiasGuard GraphQL API from basics to production deployment',
            duration: 900, // 15 minutes
            difficulty: 'intermediate',
            category: 'technical-integration',
            tags: ['graphql', 'api', 'integration', 'development'],
            prerequisites: ['basic-programming', 'graphql-basics'],
            learningObjectives: [
                'Construct efficient GraphQL queries for bias analysis',
                'Implement real-time subscriptions',
                'Handle errors and edge cases properly',
                'Deploy production-ready integrations'
            ],
            chapters: [
                {
                    id: 'api-overview',
                    title: 'BiasGuard GraphQL API Overview',
                    startTime: 0,
                    duration: 120,
                    keyPoints: ['API architecture', 'Authentication', 'Rate limiting', 'Available operations'],
                    interactiveElements: [
                        {
                            type: 'playground-demo',
                            time: 60,
                            component: 'GraphQLPlayground',
                            description: 'Explore the API schema interactively'
                        }
                    ]
                },
                {
                    id: 'basic-queries',
                    title: 'Constructing Basic Queries',
                    startTime: 120,
                    duration: 180,
                    keyPoints: ['Query syntax', 'Field selection', 'Variables', 'Fragments'],
                    interactiveElements: [
                        {
                            type: 'code-along',
                            time: 180,
                            task: 'Write a query to get analysis results with statistical significance',
                            template: `query GetAnalysis($id: ID!) {
  analysis(id: $id) {
    // Add fields here
  }
}`,
                            solution: `query GetAnalysis($id: ID!) {
  analysis(id: $id) {
    id
    overallScore
    confidence
    patterns {
      type
      severity
      description
    }
    statisticalSignificance {
      pValue
      confidenceInterval {
        lower
        upper
        level
      }
    }
  }
}`
                        }
                    ]
                },
                {
                    id: 'mutations-subscriptions',
                    title: 'Mutations and Real-time Subscriptions',
                    startTime: 300,
                    duration: 180,
                    keyPoints: ['Submitting analyses', 'Real-time updates', 'Subscription management'],
                    interactiveElements: [
                        {
                            type: 'live-demo',
                            time: 360,
                            component: 'SubscriptionDemo',
                            description: 'See real-time analysis updates in action'
                        },
                        {
                            type: 'implementation',
                            time: 420,
                            task: 'Implement analysis submission with real-time updates',
                            framework: 'react',
                            expectedFeatures: ['mutation-handling', 'subscription-setup', 'ui-updates']
                        }
                    ]
                },
                {
                    id: 'error-handling',
                    title: 'Production-Ready Error Handling',
                    startTime: 480,
                    duration: 120,
                    keyPoints: ['Error types', 'Retry strategies', 'User-friendly messages', 'Logging'],
                    interactiveElements: [
                        {
                            type: 'error-simulation',
                            time: 540,
                            scenarios: ['network-timeout', 'rate-limit', 'validation-error', 'server-error'],
                            description: 'Practice handling different error scenarios'
                        }
                    ]
                },
                {
                    id: 'performance-optimization',
                    title: 'Performance Optimization',
                    startTime: 600,
                    duration: 120,
                    keyPoints: ['Query optimization', 'Caching strategies', 'Request batching', 'Monitoring'],
                    interactiveElements: [
                        {
                            type: 'performance-analyzer',
                            time: 660,
                            component: 'QueryPerformanceAnalyzer',
                            description: 'Analyze and optimize query performance'
                        }
                    ]
                },
                {
                    id: 'production-deployment',
                    title: 'Production Deployment Best Practices',
                    startTime: 720,
                    duration: 180,
                    keyPoints: ['Environment configuration', 'Security considerations', 'Monitoring', 'Scaling'],
                    interactiveElements: [
                        {
                            type: 'deployment-checklist',
                            time: 780,
                            checklist: [
                                'Environment variables configured',
                                'Error monitoring setup',
                                'Rate limiting implemented',
                                'Security headers configured',
                                'Performance monitoring active'
                            ]
                        }
                    ]
                }
            ],
            videoFiles: {
                '1080p': '/videos/graphql-integration-1080p.mp4',
                '720p': '/videos/graphql-integration-720p.mp4',
                '480p': '/videos/graphql-integration-480p.mp4'
            },
            subtitles: {
                'en': '/subtitles/graphql-integration-en.vtt',
                'es': '/subtitles/graphql-integration-es.vtt'
            },
            transcript: '/transcripts/graphql-integration.txt',
            codeExamples: {
                'javascript': '/code-examples/graphql-integration-js.zip',
                'python': '/code-examples/graphql-integration-py.zip',
                'java': '/code-examples/graphql-integration-java.zip'
            },
            relatedContent: ['api-best-practices', 'production-monitoring'],
            completion: {
                certificate: true,
                badge: 'api-integration-expert',
                nextRecommendations: ['advanced-graphql-patterns', 'microservices-integration']
            }
        });

        // Dashboard Analytics Walkthrough
        this.videoLibrary.addVideo('dashboard-analytics-mastery', {
            title: 'Dashboard Analytics Mastery',
            description: 'Master the BiasGuard analytics dashboard for comprehensive bias monitoring',
            duration: 600, // 10 minutes
            difficulty: 'beginner',
            category: 'user-interface',
            tags: ['dashboard', 'analytics', 'monitoring', 'visualization'],
            prerequisites: ['bias-detection-basics'],
            learningObjectives: [
                'Navigate the analytics dashboard efficiently',
                'Interpret bias trend visualizations',
                'Create custom monitoring views',
                'Export and share analytics reports'
            ],
            chapters: [
                {
                    id: 'dashboard-overview',
                    title: 'Dashboard Overview and Navigation',
                    startTime: 0,
                    duration: 120,
                    keyPoints: ['Main sections', 'Navigation patterns', 'Customization options'],
                    interactiveElements: [
                        {
                            type: 'guided-tour',
                            time: 30,
                            component: 'DashboardTour',
                            description: 'Interactive tour of dashboard features'
                        }
                    ]
                },
                {
                    id: 'metrics-interpretation',
                    title: 'Understanding Key Metrics',
                    startTime: 120,
                    duration: 150,
                    keyPoints: ['Bias detection rate', 'Confidence trends', 'Pattern distribution'],
                    interactiveElements: [
                        {
                            type: 'metric-explorer',
                            time: 180,
                            component: 'MetricsExplorer',
                            description: 'Explore different metrics and their meanings'
                        }
                    ]
                },
                {
                    id: 'trend-analysis',
                    title: 'Trend Analysis and Forecasting',
                    startTime: 270,
                    duration: 120,
                    keyPoints: ['Time series analysis', 'Seasonal patterns', 'Anomaly detection'],
                    interactiveElements: [
                        {
                            type: 'trend-analyzer',
                            time: 330,
                            component: 'TrendAnalyzer',
                            description: 'Analyze bias trends over time'
                        }
                    ]
                },
                {
                    id: 'custom-views',
                    title: 'Creating Custom Views',
                    startTime: 390,
                    duration: 120,
                    keyPoints: ['Widget configuration', 'Filter setup', 'Layout customization'],
                    interactiveElements: [
                        {
                            type: 'view-builder',
                            time: 450,
                            component: 'CustomViewBuilder',
                            description: 'Build your own dashboard view'
                        }
                    ]
                },
                {
                    id: 'reporting-export',
                    title: 'Reporting and Export Features',
                    startTime: 510,
                    duration: 90,
                    keyPoints: ['Report generation', 'Export formats', 'Scheduled reports'],
                    interactiveElements: [
                        {
                            type: 'report-generator',
                            time: 540,
                            component: 'ReportGenerator',
                            description: 'Generate and customize reports'
                        }
                    ]
                }
            ],
            videoFiles: {
                '1080p': '/videos/dashboard-analytics-1080p.mp4',
                '720p': '/videos/dashboard-analytics-720p.mp4',
                '480p': '/videos/dashboard-analytics-480p.mp4'
            },
            subtitles: {
                'en': '/subtitles/dashboard-analytics-en.vtt',
                'es': '/subtitles/dashboard-analytics-es.vtt'
            },
            transcript: '/transcripts/dashboard-analytics.txt',
            relatedContent: ['data-visualization-best-practices', 'monitoring-strategies'],
            completion: {
                certificate: true,
                badge: 'analytics-expert',
                nextRecommendations: ['advanced-analytics', 'custom-integrations']
            }
        });
    }

    createVideoInterface() {
        this.videoContainer = this.createElement('div', {
            id: 'biasguard-video-system',
            className: 'video-walkthrough-system',
            innerHTML: `
                <div class="video-library-sidebar">
                    <div class="video-library-header">
                        <h3>Video Walkthroughs</h3>
                        <div class="library-controls">
                            <button class="library-search-btn" title="Search videos">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                                </svg>
                            </button>
                            <button class="library-filter-btn" title="Filter videos">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="video-search-container">
                        <input type="text" class="video-search-input" placeholder="Search videos..." />
                    </div>
                    <div class="video-filters">
                        <select class="difficulty-filter">
                            <option value="">All Difficulties</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                        </select>
                        <select class="category-filter">
                            <option value="">All Categories</option>
                            <option value="statistical-analysis">Statistical Analysis</option>
                            <option value="advanced-analysis">Advanced Analysis</option>
                            <option value="technical-integration">Technical Integration</option>
                            <option value="user-interface">User Interface</option>
                        </select>
                    </div>
                    <div class="video-list"></div>
                </div>
                <div class="video-player-area">
                    <div class="video-player-container">
                        <video class="main-video-player" controls preload="metadata">
                            <track kind="subtitles" srclang="en" label="English" default>
                        </video>
                        <div class="video-overlay-container"></div>
                        <div class="video-controls-overlay">
                            <div class="chapter-navigation">
                                <button class="prev-chapter-btn" title="Previous Chapter">⏮</button>
                                <span class="current-chapter">Chapter 1 of 5</span>
                                <button class="next-chapter-btn" title="Next Chapter">⏭</button>
                            </div>
                            <div class="playback-controls">
                                <button class="speed-control" title="Playback Speed">1x</button>
                                <button class="quality-control" title="Video Quality">720p</button>
                                <button class="subtitle-control" title="Subtitles">CC</button>
                                <button class="fullscreen-control" title="Fullscreen">⛶</button>
                            </div>
                        </div>
                    </div>
                    <div class="video-info-panel">
                        <div class="video-header">
                            <h2 class="video-title">Select a video to begin</h2>
                            <div class="video-metadata">
                                <span class="video-duration"></span>
                                <span class="video-difficulty"></span>
                                <span class="video-progress"></span>
                            </div>
                        </div>
                        <div class="video-description"></div>
                        <div class="learning-objectives">
                            <h4>Learning Objectives</h4>
                            <ul class="objectives-list"></ul>
                        </div>
                        <div class="video-chapters">
                            <h4>Chapters</h4>
                            <div class="chapters-list"></div>
                        </div>
                        <div class="video-resources">
                            <h4>Additional Resources</h4>
                            <div class="resources-list"></div>
                        </div>
                    </div>
                </div>
                <div class="video-transcript-panel">
                    <div class="transcript-header">
                        <h4>Transcript</h4>
                        <div class="transcript-controls">
                            <button class="transcript-search-btn" title="Search transcript">🔍</button>
                            <button class="transcript-download-btn" title="Download transcript">📥</button>
                        </div>
                    </div>
                    <div class="transcript-content">
                        <div class="transcript-search">
                            <input type="text" placeholder="Search transcript..." />
                        </div>
                        <div class="transcript-text"></div>
                    </div>
                </div>
            `
        });

        document.body.appendChild(this.videoContainer);
        this.setupVideoStyles();
        this.setupVideoEvents();
        this.populateVideoLibrary();
    }

    setupVideoStyles() {
        const styles = `
            .video-walkthrough-system {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #000;
                z-index: 2000;
                display: none;
                grid-template-columns: 300px 1fr 300px;
                grid-template-rows: 1fr;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .video-walkthrough-system.active {
                display: grid;
            }

            .video-library-sidebar {
                background: #1a1a1a;
                color: white;
                overflow-y: auto;
                border-right: 1px solid #333;
            }

            .video-library-header {
                padding: 20px;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .video-library-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }

            .library-controls {
                display: flex;
                gap: 8px;
            }

            .library-controls button {
                padding: 6px;
                background: transparent;
                border: 1px solid #444;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .library-controls button:hover {
                background: #333;
                border-color: #555;
            }

            .video-search-container,
            .video-filters {
                padding: 16px 20px;
                border-bottom: 1px solid #333;
            }

            .video-search-input {
                width: 100%;
                padding: 8px 12px;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 6px;
                color: white;
                font-size: 14px;
                outline: none;
            }

            .video-search-input:focus {
                border-color: #3b82f6;
            }

            .video-filters {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .video-filters select {
                padding: 6px 8px;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 4px;
                color: white;
                font-size: 12px;
                outline: none;
            }

            .video-list {
                padding: 16px 0;
            }

            .video-item {
                padding: 16px 20px;
                border-bottom: 1px solid #2a2a2a;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            .video-item:hover {
                background: #2a2a2a;
            }

            .video-item.active {
                background: #1e40af;
            }

            .video-item-title {
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 4px;
                color: white;
            }

            .video-item-meta {
                font-size: 12px;
                color: #9ca3af;
                display: flex;
                gap: 12px;
                margin-bottom: 8px;
            }

            .video-item-description {
                font-size: 12px;
                color: #d1d5db;
                line-height: 1.4;
            }

            .video-player-area {
                background: #000;
                display: flex;
                flex-direction: column;
                position: relative;
            }

            .video-player-container {
                flex: 1;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .main-video-player {
                width: 100%;
                height: 100%;
                max-height: 70vh;
                object-fit: contain;
            }

            .video-overlay-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            .video-controls-overlay {
                position: absolute;
                bottom: 60px;
                left: 20px;
                right: 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: rgba(0,0,0,0.7);
                padding: 12px 16px;
                border-radius: 8px;
                backdrop-filter: blur(10px);
            }

            .chapter-navigation,
            .playback-controls {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .video-controls-overlay button {
                padding: 6px 12px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 4px;
                color: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s ease;
            }

            .video-controls-overlay button:hover {
                background: rgba(255,255,255,0.2);
            }

            .current-chapter {
                color: white;
                font-size: 12px;
                font-weight: 500;
            }

            .video-info-panel {
                background: #1a1a1a;
                color: white;
                padding: 20px;
                max-height: 30vh;
                overflow-y: auto;
            }

            .video-header {
                margin-bottom: 16px;
            }

            .video-title {
                margin: 0 0 8px 0;
                font-size: 20px;
                font-weight: 600;
            }

            .video-metadata {
                display: flex;
                gap: 16px;
                font-size: 12px;
                color: #9ca3af;
            }

            .video-description {
                margin-bottom: 20px;
                line-height: 1.5;
                color: #d1d5db;
            }

            .learning-objectives h4,
            .video-chapters h4,
            .video-resources h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 600;
                color: #f3f4f6;
            }

            .objectives-list {
                margin: 0 0 20px 0;
                padding-left: 20px;
            }

            .objectives-list li {
                margin-bottom: 4px;
                color: #d1d5db;
                font-size: 14px;
            }

            .chapters-list {
                margin-bottom: 20px;
            }

            .chapter-item {
                padding: 8px 12px;
                background: #2a2a2a;
                border-radius: 4px;
                margin-bottom: 4px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .chapter-item:hover {
                background: #333;
            }

            .chapter-item.active {
                background: #1e40af;
            }

            .chapter-title {
                font-size: 13px;
                font-weight: 500;
            }

            .chapter-time {
                font-size: 11px;
                color: #9ca3af;
            }

            .video-transcript-panel {
                background: #1a1a1a;
                color: white;
                border-left: 1px solid #333;
                display: flex;
                flex-direction: column;
            }

            .transcript-header {
                padding: 20px;
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .transcript-header h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .transcript-controls {
                display: flex;
                gap: 8px;
            }

            .transcript-controls button {
                padding: 4px 8px;
                background: transparent;
                border: 1px solid #444;
                border-radius: 4px;
                color: white;
                cursor: pointer;
                font-size: 12px;
            }

            .transcript-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }

            .transcript-search {
                margin-bottom: 16px;
            }

            .transcript-search input {
                width: 100%;
                padding: 6px 8px;
                background: #2a2a2a;
                border: 1px solid #444;
                border-radius: 4px;
                color: white;
                font-size: 12px;
                outline: none;
            }

            .transcript-text {
                line-height: 1.6;
                font-size: 14px;
                color: #d1d5db;
            }

            .transcript-segment {
                margin-bottom: 12px;
                cursor: pointer;
                padding: 4px;
                border-radius: 2px;
                transition: background-color 0.2s ease;
            }

            .transcript-segment:hover {
                background: #2a2a2a;
            }

            .transcript-segment.active {
                background: #1e40af;
            }

            .transcript-timestamp {
                font-size: 11px;
                color: #6b7280;
                margin-right: 8px;
            }

            .interactive-overlay {
                position: absolute;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 400px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
            }

            .interactive-overlay h5 {
                margin: 0 0 12px 0;
                font-size: 16px;
                font-weight: 600;
            }

            .interactive-overlay p {
                margin: 0 0 16px 0;
                line-height: 1.5;
            }

            .overlay-actions {
                display: flex;
                gap: 8px;
                justify-content: flex-end;
            }

            .overlay-btn {
                padding: 8px 16px;
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 4px;
                background: rgba(255,255,255,0.1);
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s ease;
            }

            .overlay-btn:hover {
                background: rgba(255,255,255,0.2);
            }

            .overlay-btn.primary {
                background: #3b82f6;
                border-color: #3b82f6;
            }

            .overlay-btn.primary:hover {
                background: #2563eb;
            }

            @media (max-width: 1200px) {
                .video-walkthrough-system {
                    grid-template-columns: 250px 1fr 250px;
                }
            }

            @media (max-width: 768px) {
                .video-walkthrough-system {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto 1fr auto;
                }
                
                .video-library-sidebar,
                .video-transcript-panel {
                    max-height: 200px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupVideoEvents() {
        const container = this.videoContainer;
        
        // Video selection
        container.addEventListener('click', (e) => {
            if (e.target.closest('.video-item')) {
                const videoId = e.target.closest('.video-item').dataset.videoId;
                this.loadVideo(videoId);
            }
        });

        // Chapter navigation
        container.querySelector('.prev-chapter-btn').addEventListener('click', () => {
            this.previousChapter();
        });

        container.querySelector('.next-chapter-btn').addEventListener('click', () => {
            this.nextChapter();
        });

        // Playback controls
        container.querySelector('.speed-control').addEventListener('click', () => {
            this.togglePlaybackSpeed();
        });

        container.querySelector('.quality-control').addEventListener('click', () => {
            this.toggleVideoQuality();
        });

        container.querySelector('.subtitle-control').addEventListener('click', () => {
            this.toggleSubtitles();
        });

        container.querySelector('.fullscreen-control').addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // Search and filters
        container.querySelector('.video-search-input').addEventListener('input', (e) => {
            this.filterVideos({ search: e.target.value });
        });

        container.querySelector('.difficulty-filter').addEventListener('change', (e) => {
            this.filterVideos({ difficulty: e.target.value });
        });

        container.querySelector('.category-filter').addEventListener('change', (e) => {
            this.filterVideos({ category: e.target.value });
        });

        // Transcript search
        container.querySelector('.transcript-search input').addEventListener('input', (e) => {
            this.searchTranscript(e.target.value);
        });

        // Video player events
        const video = container.querySelector('.main-video-player');
        video.addEventListener('timeupdate', () => {
            this.handleVideoTimeUpdate();
        });

        video.addEventListener('ended', () => {
            this.handleVideoEnd();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.videoContainer.classList.contains('active')) {
                this.handleKeyboardShortcut(e);
            }
        });

        // Close video system
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.videoContainer.classList.contains('active')) {
                this.closeVideoSystem();
            }
        });
    }

    populateVideoLibrary() {
        const videoList = this.videoContainer.querySelector('.video-list');
        const videos = this.videoLibrary.getAllVideos();
        
        videoList.innerHTML = videos.map(video => `
            <div class="video-item" data-video-id="${video.id}">
                <div class="video-item-title">${video.title}</div>
                <div class="video-item-meta">
                    <span>${this.formatDuration(video.duration)}</span>
                    <span class="difficulty-${video.difficulty}">${video.difficulty}</span>
                    ${this.userProgress.completed.includes(video.id) ? '<span>✓ Completed</span>' : ''}
                </div>
                <div class="video-item-description">${video.description}</div>
            </div>
        `).join('');
    }

    async loadVideo(videoId) {
        const video = this.videoLibrary.getVideo(videoId);
        if (!video) return;

        this.currentVideo = video;
        
        // Update UI
        this.updateVideoInfo(video);
        this.loadVideoPlayer(video);
        this.loadTranscript(video);
        this.setupInteractiveOverlays(video);
        
        // Mark as active
        this.videoContainer.querySelectorAll('.video-item').forEach(item => {
            item.classList.toggle('active', item.dataset.videoId === videoId);
        });

        // Track analytics
        this.analytics.trackVideoStart(videoId, {
            userLevel: this.getUserLevel(),
            previousVideos: this.userProgress.watchedVideos.length
        });
    }

    updateVideoInfo(video) {
        const container = this.videoContainer;
        
        container.querySelector('.video-title').textContent = video.title;
        container.querySelector('.video-description').textContent = video.description;
        container.querySelector('.video-duration').textContent = this.formatDuration(video.duration);
        container.querySelector('.video-difficulty').textContent = video.difficulty;
        
        // Learning objectives
        const objectivesList = container.querySelector('.objectives-list');
        objectivesList.innerHTML = video.learningObjectives.map(obj => 
            `<li>${obj}</li>`
        ).join('');
        
        // Chapters
        const chaptersList = container.querySelector('.chapters-list');
        chaptersList.innerHTML = video.chapters.map((chapter, index) => `
            <div class="chapter-item" data-chapter-index="${index}">
                <span class="chapter-title">${chapter.title}</span>
                <span class="chapter-time">${this.formatTime(chapter.startTime)}</span>
            </div>
        `).join('');
        
        // Add chapter click handlers
        chaptersList.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', () => {
                const chapterIndex = parseInt(item.dataset.chapterIndex);
                this.seekToChapter(chapterIndex);
            });
        });
    }

    loadVideoPlayer(video) {
        const player = this.videoContainer.querySelector('.main-video-player');
        const quality = this.getOptimalQuality();
        
        player.src = video.videoFiles[quality];
        
        // Load subtitles
        const track = player.querySelector('track');
        if (video.subtitles && video.subtitles.en) {
            track.src = video.subtitles.en;
        }
        
        // Reset to beginning
        player.currentTime = 0;
        
        // Update chapter display
        this.updateChapterDisplay(0);
    }

    async loadTranscript(video) {
        if (!video.transcript) return;
        
        try {
            const response = await fetch(video.transcript);
            const transcriptText = await response.text();
            this.displayTranscript(transcriptText);
        } catch (error) {
            console.error('Failed to load transcript:', error);
        }
    }

    displayTranscript(transcriptText) {
        const container = this.videoContainer.querySelector('.transcript-text');
        
        // Parse transcript (assuming VTT format or similar)
        const segments = this.parseTranscript(transcriptText);
        
        container.innerHTML = segments.map(segment => `
            <div class="transcript-segment" data-start-time="${segment.startTime}">
                <span class="transcript-timestamp">${this.formatTime(segment.startTime)}</span>
                ${segment.text}
            </div>
        `).join('');
        
        // Add click handlers for seeking
        container.querySelectorAll('.transcript-segment').forEach(segment => {
            segment.addEventListener('click', () => {
                const startTime = parseFloat(segment.dataset.startTime);
                this.seekToTime(startTime);
            });
        });
    }

    setupInteractiveOverlays(video) {
        const overlayContainer = this.videoContainer.querySelector('.video-overlay-container');
        overlayContainer.innerHTML = '';
        
        // Set up interactive elements for each chapter
        video.chapters.forEach(chapter => {
            chapter.interactiveElements?.forEach(element => {
                this.createInteractiveOverlay(element, overlayContainer);
            });
        });
    }

    createInteractiveOverlay(element, container) {
        const overlay = this.createElement('div', {
            className: 'interactive-overlay',
            style: `display: none; top: 50%; left: 50%; transform: translate(-50%, -50%);`,
            innerHTML: `
                <h5>${element.type.charAt(0).toUpperCase() + element.type.slice(1)}</h5>
                <p>${element.description || 'Interactive element'}</p>
                <div class="overlay-actions">
                    <button class="overlay-btn" onclick="this.parentElement.parentElement.style.display='none'">Skip</button>
                    <button class="overlay-btn primary" onclick="this.handleInteractiveElement('${element.type}', ${JSON.stringify(element).replace(/"/g, '&quot;')})">Continue</button>
                </div>
            `
        });
        
        overlay.dataset.triggerTime = element.time;
        overlay.dataset.elementType = element.type;
        
        container.appendChild(overlay);
    }

    handleVideoTimeUpdate() {
        if (!this.currentVideo) return;
        
        const video = this.videoContainer.querySelector('.main-video-player');
        const currentTime = video.currentTime;
        
        // Update chapter highlighting
        const currentChapter = this.getCurrentChapter(currentTime);
        this.updateChapterDisplay(currentChapter);
        
        // Show interactive overlays
        this.checkInteractiveOverlays(currentTime);
        
        // Update transcript highlighting
        this.updateTranscriptHighlight(currentTime);
        
        // Track progress
        this.trackProgress(currentTime);
    }

    getCurrentChapter(currentTime) {
        if (!this.currentVideo) return 0;
        
        for (let i = this.currentVideo.chapters.length - 1; i >= 0; i--) {
            if (currentTime >= this.currentVideo.chapters[i].startTime) {
                return i;
            }
        }
        return 0;
    }

    updateChapterDisplay(chapterIndex) {
        const chapters = this.videoContainer.querySelectorAll('.chapter-item');
        chapters.forEach((chapter, index) => {
            chapter.classList.toggle('active', index === chapterIndex);
        });
        
        const currentChapterSpan = this.videoContainer.querySelector('.current-chapter');
        currentChapterSpan.textContent = `Chapter ${chapterIndex + 1} of ${chapters.length}`;
    }

    checkInteractiveOverlays(currentTime) {
        const overlays = this.videoContainer.querySelectorAll('.interactive-overlay');
        
        overlays.forEach(overlay => {
            const triggerTime = parseFloat(overlay.dataset.triggerTime);
            const shouldShow = Math.abs(currentTime - triggerTime) < 1; // Within 1 second
            
            if (shouldShow && overlay.style.display === 'none') {
                overlay.style.display = 'block';
                this.pauseVideo(); // Pause for interaction
            }
        });
    }

    updateTranscriptHighlight(currentTime) {
        const segments = this.videoContainer.querySelectorAll('.transcript-segment');
        
        segments.forEach(segment => {
            const startTime = parseFloat(segment.dataset.startTime);
            const isActive = currentTime >= startTime && 
                           (segment.nextElementSibling ? 
                            currentTime < parseFloat(segment.nextElementSibling.dataset.startTime) : 
                            true);
            
            segment.classList.toggle('active', isActive);
        });
    }

    // Utility methods
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    parseTranscript(transcriptText) {
        // Simple VTT parser - in production, use a proper library
        const segments = [];
        const lines = transcriptText.split('\n');
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.includes('-->')) {
                const [start] = line.split(' --> ');
                const startTime = this.parseTimeString(start);
                const text = lines[i + 1]?.trim() || '';
                
                if (text) {
                    segments.push({ startTime, text });
                }
            }
        }
        
        return segments;
    }

    parseTimeString(timeString) {
        const [time, ms] = timeString.split('.');
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return hours * 3600 + minutes * 60 + seconds + (parseInt(ms) || 0) / 1000;
    }

    createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key === 'onclick') {
                element.addEventListener('click', value);
            } else {
                element.setAttribute(key, value);
            }
        });
        return element;
    }

    // Public API methods
    showVideoLibrary() {
        this.videoContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeVideoSystem() {
        this.videoContainer.classList.remove('active');
        document.body.style.overflow = '';
        
        // Pause video
        const video = this.videoContainer.querySelector('.main-video-player');
        video.pause();
    }

    playVideo(videoId) {
        this.showVideoLibrary();
        this.loadVideo(videoId);
    }

    getUserLevel() {
        // Implementation would determine user level based on progress
        return 'intermediate';
    }

    loadUserProgress() {
        const saved = localStorage.getItem('biasguard-video-progress');
        return saved ? JSON.parse(saved) : {
            watchedVideos: [],
            completedVideos: [],
            totalWatchTime: 0,
            bookmarks: [],
            lastWatched: null
        };
    }

    saveUserProgress() {
        localStorage.setItem('biasguard-video-progress', JSON.stringify(this.userProgress));
    }
}

// Supporting classes (simplified implementations)
class VideoLibrary {
    constructor() {
        this.videos = new Map();
    }

    addVideo(id, video) {
        video.id = id;
        this.videos.set(id, video);
    }

    getVideo(id) {
        return this.videos.get(id);
    }

    getAllVideos() {
        return Array.from(this.videos.values());
    }

    searchVideos(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const video of this.videos.values()) {
            const score = this.calculateRelevanceScore(video, queryLower);
            if (score > 0) {
                results.push({ ...video, relevanceScore: score });
            }
        }
        
        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    calculateRelevanceScore(video, query) {
        let score = 0;
        
        if (video.title.toLowerCase().includes(query)) score += 10;
        if (video.description.toLowerCase().includes(query)) score += 5;
        if (video.tags.some(tag => tag.includes(query))) score += 3;
        
        return score;
    }
}

class InteractiveVideoPlayer {
    // Implementation for enhanced video player functionality
}

class InteractiveOverlaySystem {
    // Implementation for interactive overlays and elements
}

class VideoProgressTracker {
    // Implementation for tracking user progress through videos
}

class AIVideoNarrator {
    // Implementation for AI-powered narration and explanations
}

class VideoAnalytics {
    constructor() {
        this.events = [];
    }

    trackVideoStart(videoId, metadata) {
        this.trackEvent('video_started', { videoId, ...metadata });
    }

    trackVideoProgress(videoId, progress) {
        this.trackEvent('video_progress', { videoId, progress });
    }

    trackVideoComplete(videoId, completionData) {
        this.trackEvent('video_completed', { videoId, ...completionData });
    }

    trackEvent(eventType, data) {
        this.events.push({
            eventType,
            data,
            timestamp: new Date().toISOString()
        });
        
        // Send to analytics service
        if (window.gtag) {
            window.gtag('event', eventType, data);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VideoWalkthroughSystem };
} else if (typeof window !== 'undefined') {
    window.VideoWalkthroughSystem = VideoWalkthroughSystem;
}