/**
 * BiasGuard In-App Help System
 * Contextual guidance and AI-powered assistance
 * Version 1.0.0 - Following 2025 developer experience best practices
 */

class InAppHelpSystem {
    constructor(options = {}) {
        this.options = {
            aiAssistantEnabled: true,
            contextualHints: true,
            smartTooltips: true,
            progressiveDisclosure: true,
            darkMode: 'auto',
            language: 'en',
            ...options
        };

        this.helpDatabase = new HelpDatabase();
        this.contextEngine = new ContextualHelpEngine();
        this.aiAssistant = new AIHelpAssistant();
        this.tooltipManager = new SmartTooltipManager();
        this.onboardingFlow = new OnboardingFlowManager();
        
        this.currentContext = null;
        this.userInteractions = [];
        this.helpSessionId = this.generateSessionId();
        
        this.initialize();
    }

    initialize() {
        this.setupHelpDatabase();
        this.initializeContextDetection();
        this.setupKeyboardShortcuts();
        this.createHelpUI();
        this.startContextualHelpEngine();
    }

    setupHelpDatabase() {
        // Core bias detection help content
        this.helpDatabase.addContent('bias-detection-basics', {
            title: 'Understanding Bias Detection',
            category: 'fundamentals',
            content: {
                overview: 'BiasGuard analyzes text for various types of bias using advanced ML algorithms.',
                keyFeatures: [
                    'Real-time bias scoring with confidence intervals',
                    'Multi-dimensional analysis (demographic, geopolitical, intersectional)',
                    'Statistical significance testing with p-values',
                    'Detailed pattern explanations and recommendations'
                ],
                commonQuestions: [
                    {
                        q: 'What does the overall bias score mean?',
                        a: 'The overall bias score (0-100) represents the likelihood that bias is present in the analyzed text. Scores above 60 indicate potential bias that warrants review.',
                        relatedTopics: ['statistical-significance', 'confidence-intervals']
                    },
                    {
                        q: 'How accurate is the bias detection?',
                        a: 'BiasGuard achieves 94% accuracy across our test suite. All results include confidence intervals and statistical significance measures to help you interpret findings.',
                        relatedTopics: ['accuracy-metrics', 'validation-methods']
                    }
                ],
                troubleshooting: [
                    {
                        issue: 'Low confidence scores',
                        solution: 'Increase text length or provide more context. Shorter texts naturally have lower confidence.',
                        preventiveTips: ['Use complete sentences', 'Provide sufficient context', 'Avoid ambiguous language']
                    }
                ]
            },
            searchKeywords: ['bias', 'detection', 'score', 'accuracy', 'confidence'],
            lastUpdated: '2025-08-05',
            difficulty: 'beginner'
        });

        this.helpDatabase.addContent('statistical-significance', {
            title: 'Statistical Significance in Bias Detection',
            category: 'advanced-features',
            content: {
                overview: 'Statistical significance helps validate whether detected bias patterns are meaningful or could have occurred by chance.',
                keyMetrics: [
                    {
                        name: 'P-Value',
                        description: 'Probability of observing the result if no bias exists',
                        interpretation: 'p < 0.05 indicates statistically significant bias',
                        example: 'p = 0.03 means 3% chance of false positive'
                    },
                    {
                        name: 'Confidence Interval',
                        description: 'Range where the true bias score likely falls',
                        interpretation: '95% CI provides high confidence bounds',
                        example: 'Score: 75 ± 5 (95% CI: 70-80)'
                    },
                    {
                        name: 'Effect Size (Cohen\'s d)',
                        description: 'Practical significance of the bias finding',
                        interpretation: 'd > 0.8 indicates large, meaningful bias',
                        example: 'd = 1.2 shows substantial bias impact'
                    }
                ],
                practicalGuidance: [
                    'Always consider both statistical and practical significance',
                    'Use confidence intervals to understand result reliability',
                    'Large effect sizes matter more than small p-values',
                    'Consider sample size when interpreting results'
                ]
            },
            searchKeywords: ['statistics', 'p-value', 'confidence', 'significance', 'cohen'],
            prerequisites: ['bias-detection-basics'],
            lastUpdated: '2025-08-05',
            difficulty: 'advanced'
        });

        this.helpDatabase.addContent('intersectional-analysis', {
            title: 'Intersectional Bias Analysis',
            category: 'advanced-features',
            content: {
                overview: 'Intersectional analysis examines how multiple identity attributes combine to create unique bias patterns.',
                coreConceptss: [
                    {
                        concept: 'Intersectionality Theory',
                        explanation: 'Developed by Kimberlé Crenshaw, intersectionality recognizes that people experience multiple, overlapping forms of discrimination.',
                        application: 'BiasGuard analyzes how race, gender, age, and other attributes interact in bias patterns.'
                    },
                    {
                        concept: 'Amplification Factors',
                        explanation: 'Some identity combinations face amplified bias beyond what individual attributes would predict.',
                        application: 'Our algorithm calculates amplification ratios to identify compound discrimination.'
                    },
                    {
                        concept: 'Intersection Strength',
                        explanation: 'Measures how strongly different attributes interact to create bias.',
                        application: 'Higher intersection strength indicates more complex bias patterns requiring nuanced mitigation.'
                    }
                ],
                interpretationGuide: [
                    'Compound Bias Score > 70: Strong intersectional bias present',
                    'Amplification Factor > 1.5: Bias exceeds sum of individual components',
                    'Multiple intersections: Complex bias requiring comprehensive intervention'
                ],
                realWorldExamples: [
                    {
                        scenario: 'Hiring bias against young Black women',
                        analysis: 'May show amplified bias beyond age + race + gender individually',
                        mitigation: 'Address compound stereotypes, not just individual attributes'
                    }
                ]
            },
            searchKeywords: ['intersectional', 'compound', 'amplification', 'multiple', 'attributes'],
            prerequisites: ['bias-detection-basics', 'statistical-significance'],
            lastUpdated: '2025-08-05',
            difficulty: 'expert'
        });

        this.helpDatabase.addContent('api-integration', {
            title: 'GraphQL API Integration Guide',
            category: 'development',
            content: {
                overview: 'BiasGuard provides a unified GraphQL API for all bias detection and analytics features.',
                quickStart: {
                    endpoint: 'https://api.biasguards.ai/graphql',
                    playground: 'https://api.biasguards.ai/playground',
                    authentication: 'Bearer token in Authorization header',
                    rateLimit: '1000 requests per hour'
                },
                commonQueries: [
                    {
                        name: 'Submit Analysis',
                        query: `mutation SubmitAnalysis($input: AnalysisInput!) {
  submitAnalysis(input: $input) {
    id
    overallScore
    confidence
    patterns {
      type
      severity
      description
      recommendations
    }
    statisticalSignificance {
      pValue
      confidenceInterval { lower upper level }
    }
  }
}`,
                        variables: {
                            input: {
                                text: "Your text to analyze",
                                options: {
                                    includeIntersectional: true,
                                    includeGeopolitical: true,
                                    confidenceThreshold: 0.7
                                }
                            }
                        }
                    },
                    {
                        name: 'Real-time Metrics',
                        query: `subscription MetricsUpdates {
  metricsUpdated {
    totalAnalyses
    biasDetectionRate
    avgConfidence
    currentLoad
    timestamp
  }
}`
                    }
                ],
                errorHandling: [
                    'Always check for GraphQL errors in response',
                    'Implement exponential backoff for rate limiting',
                    'Use proper HTTP status codes for debugging',
                    'Log trace IDs for support requests'
                ],
                bestPractices: [
                    'Use fragments for reusable query parts',
                    'Implement proper caching strategies',
                    'Batch multiple operations when possible',
                    'Monitor query performance and complexity'
                ]
            },
            searchKeywords: ['api', 'graphql', 'integration', 'mutation', 'subscription'],
            codeExamples: true,
            lastUpdated: '2025-08-05',
            difficulty: 'intermediate'
        });

        this.helpDatabase.addContent('dashboard-navigation', {
            title: 'Dashboard Navigation Guide',
            category: 'user-interface',
            content: {
                overview: 'The BiasGuard dashboard provides comprehensive bias detection analytics and real-time monitoring.',
                mainSections: [
                    {
                        name: 'Bias Detector',
                        description: 'Submit text for analysis and view detailed results',
                        keyFeatures: ['Real-time analysis', 'Detailed breakdowns', 'Historical comparisons'],
                        shortcuts: ['Ctrl+N for new analysis', 'Ctrl+S to save results']
                    },
                    {
                        name: 'Analytics Dashboard',
                        description: 'View trends, patterns, and system performance metrics',
                        keyFeatures: ['Interactive charts', 'Filtering options', 'Export capabilities'],
                        shortcuts: ['Ctrl+D for dashboard', 'Ctrl+F for filters']
                    },
                    {
                        name: 'Expert Validation',
                        description: 'Compare results against expert frameworks and benchmarks',
                        keyFeatures: ['BEATS compliance', 'SAGED validation', 'Statistical rigor'],
                        shortcuts: ['Ctrl+E for expert mode', 'Ctrl+V for validation']
                    }
                ],
                navigationTips: [
                    'Use the search bar (Ctrl+/) to quickly find features',
                    'Bookmark frequently used analyses',
                    'Customize dashboard widgets for your workflow',
                    'Enable keyboard shortcuts for faster navigation'
                ]
            },
            searchKeywords: ['dashboard', 'navigation', 'interface', 'shortcuts'],
            lastUpdated: '2025-08-05',
            difficulty: 'beginner'
        });
    }

    initializeContextDetection() {
        // Detect current page/section for contextual help
        this.contextEngine.addContextDetector('bias-detector', {
            selector: '#bias-detector',
            triggers: ['page-load', 'section-focus'],
            helpTopics: ['bias-detection-basics', 'statistical-significance'],
            shortcuts: [
                { key: 'F1', action: 'show-help', topic: 'bias-detection-basics' },
                { key: '?', action: 'show-quick-help' }
            ]
        });

        this.contextEngine.addContextDetector('analytics-dashboard', {
            selector: '#analytics-dashboard',
            triggers: ['page-load', 'chart-hover'],
            helpTopics: ['dashboard-navigation', 'statistical-significance'],
            smartHints: [
                {
                    trigger: 'first-visit',
                    content: 'Welcome to Analytics! Click any chart for detailed insights.',
                    position: 'top-center',
                    dismissible: true
                },
                {
                    trigger: 'empty-data',
                    content: 'No data yet? Start by analyzing some text in the Bias Detector.',
                    action: 'navigate-to-detector'
                }
            ]
        });

        this.contextEngine.addContextDetector('api-playground', {
            selector: '#graphql-playground',
            triggers: ['page-load', 'query-error'],
            helpTopics: ['api-integration'],
            smartHints: [
                {
                    trigger: 'syntax-error',
                    content: 'GraphQL syntax error detected. Check your query structure.',
                    showExample: true
                },
                {
                    trigger: 'rate-limit',
                    content: 'Rate limit reached. Consider implementing request batching.',
                    helpTopic: 'api-best-practices'
                }
            ]
        });
    }

    setupKeyboardShortcuts() {
        const shortcuts = {
            'F1': () => this.showContextualHelp(),
            '?': () => this.showQuickHelp(),
            'Ctrl+/': () => this.showHelpSearch(),
            'Ctrl+Shift+H': () => this.toggleHelpPanel(),
            'Escape': () => this.closeHelp()
        };

        document.addEventListener('keydown', (event) => {
            const key = this.getKeyString(event);
            if (shortcuts[key]) {
                event.preventDefault();
                shortcuts[key]();
            }
        });
    }

    getKeyString(event) {
        let key = '';
        if (event.ctrlKey) key += 'Ctrl+';
        if (event.shiftKey) key += 'Shift+';
        if (event.altKey) key += 'Alt+';
        key += event.key;
        return key;
    }

    createHelpUI() {
        // Create floating help button
        this.helpButton = this.createElement('button', {
            id: 'biasguard-help-button',
            className: 'help-floating-button',
            innerHTML: `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
                </svg>
            `,
            title: 'Get Help (F1)',
            onclick: () => this.showContextualHelp()
        });

        // Create help panel
        this.helpPanel = this.createElement('div', {
            id: 'biasguard-help-panel',
            className: 'help-panel hidden',
            innerHTML: `
                <div class="help-panel-header">
                    <h3>BiasGuard Help</h3>
                    <div class="help-panel-controls">
                        <button class="help-search-button" title="Search Help (Ctrl+/)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </button>
                        <button class="help-close-button" title="Close (Esc)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="help-panel-content">
                    <div class="help-search-container">
                        <input type="text" class="help-search-input" placeholder="Search help topics..." />
                        <div class="help-search-results"></div>
                    </div>
                    <div class="help-content-area">
                        <div class="help-contextual-section">
                            <h4>Current Context</h4>
                            <div class="help-contextual-content"></div>
                        </div>
                        <div class="help-quick-actions">
                            <h4>Quick Actions</h4>
                            <div class="help-action-buttons">
                                <button class="help-action-btn" data-action="start-tutorial">
                                    📚 Start Tutorial
                                </button>
                                <button class="help-action-btn" data-action="show-shortcuts">
                                    ⌨️ Keyboard Shortcuts
                                </button>
                                <button class="help-action-btn" data-action="contact-support">
                                    💬 Contact Support
                                </button>
                            </div>
                        </div>
                        <div class="help-ai-assistant">
                            <h4>AI Assistant</h4>
                            <div class="ai-chat-container">
                                <div class="ai-chat-messages"></div>
                                <div class="ai-chat-input-container">
                                    <input type="text" class="ai-chat-input" placeholder="Ask me anything about BiasGuard..." />
                                    <button class="ai-chat-send">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });

        // Add to DOM
        document.body.appendChild(this.helpButton);
        document.body.appendChild(this.helpPanel);

        // Setup event listeners
        this.setupHelpPanelEvents();
        this.setupHelpStyles();
    }

    setupHelpPanelEvents() {
        const panel = this.helpPanel;
        
        // Search functionality
        const searchInput = panel.querySelector('.help-search-input');
        const searchResults = panel.querySelector('.help-search-results');
        
        searchInput.addEventListener('input', (e) => {
            this.performHelpSearch(e.target.value, searchResults);
        });

        // Quick action buttons
        panel.querySelectorAll('.help-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // AI Assistant
        const aiInput = panel.querySelector('.ai-chat-input');
        const aiSend = panel.querySelector('.ai-chat-send');
        
        const sendAIMessage = () => {
            const message = aiInput.value.trim();
            if (message) {
                this.sendAIMessage(message);
                aiInput.value = '';
            }
        };

        aiSend.addEventListener('click', sendAIMessage);
        aiInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAIMessage();
        });

        // Close button
        panel.querySelector('.help-close-button').addEventListener('click', () => {
            this.closeHelp();
        });

        // Search button
        panel.querySelector('.help-search-button').addEventListener('click', () => {
            searchInput.focus();
        });
    }

    setupHelpStyles() {
        const styles = `
            .help-floating-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: linear-gradient(45deg, #1e40af, #059669);
                color: white;
                border: none;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }

            .help-floating-button:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 16px rgba(0,0,0,0.2);
            }

            .help-panel {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: 80vh;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                z-index: 1001;
                display: flex;
                flex-direction: column;
                transition: all 0.3s ease;
                border: 1px solid #e5e7eb;
            }

            .help-panel.hidden {
                opacity: 0;
                transform: translateY(-20px);
                pointer-events: none;
            }

            .help-panel-header {
                padding: 16px 20px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f9fafb;
                border-radius: 12px 12px 0 0;
            }

            .help-panel-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #111827;
            }

            .help-panel-controls {
                display: flex;
                gap: 8px;
            }

            .help-panel-controls button {
                padding: 6px;
                border: none;
                background: transparent;
                cursor: pointer;
                border-radius: 6px;
                color: #6b7280;
                transition: all 0.2s ease;
            }

            .help-panel-controls button:hover {
                background: #e5e7eb;
                color: #374151;
            }

            .help-panel-content {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }

            .help-search-container {
                margin-bottom: 20px;
            }

            .help-search-input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s ease;
            }

            .help-search-input:focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .help-contextual-section h4,
            .help-quick-actions h4,
            .help-ai-assistant h4 {
                margin: 0 0 12px 0;
                font-size: 14px;
                font-weight: 600;
                color: #374151;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .help-action-buttons {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 20px;
            }

            .help-action-btn {
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                background: white;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                text-align: left;
                transition: all 0.2s ease;
            }

            .help-action-btn:hover {
                background: #f9fafb;
                border-color: #9ca3af;
            }

            .ai-chat-container {
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                overflow: hidden;
            }

            .ai-chat-messages {
                max-height: 200px;
                overflow-y: auto;
                padding: 12px;
                background: #f9fafb;
                min-height: 60px;
                font-size: 14px;
                line-height: 1.5;
            }

            .ai-chat-input-container {
                display: flex;
                border-top: 1px solid #e5e7eb;
            }

            .ai-chat-input {
                flex: 1;
                padding: 12px;
                border: none;
                outline: none;
                font-size: 14px;
            }

            .ai-chat-send {
                padding: 12px 16px;
                background: #3b82f6;
                color: white;
                border: none;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s ease;
            }

            .ai-chat-send:hover {
                background: #2563eb;
            }

            .help-search-results {
                margin-top: 12px;
            }

            .help-search-result {
                padding: 12px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                margin-bottom: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .help-search-result:hover {
                background: #f9fafb;
                border-color: #9ca3af;
            }

            .help-search-result h5 {
                margin: 0 0 4px 0;
                font-size: 14px;
                font-weight: 600;
                color: #111827;
            }

            .help-search-result p {
                margin: 0;
                font-size: 13px;
                color: #6b7280;
                line-height: 1.4;
            }

            @media (max-width: 768px) {
                .help-panel {
                    width: calc(100vw - 40px);
                    max-width: 400px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    async performHelpSearch(query, resultsContainer) {
        if (!query.trim()) {
            resultsContainer.innerHTML = '';
            return;
        }

        const results = await this.helpDatabase.search(query);
        
        resultsContainer.innerHTML = results.map(result => `
            <div class="help-search-result" data-topic="${result.id}">
                <h5>${result.title}</h5>
                <p>${result.snippet}</p>
            </div>
        `).join('');

        // Add click handlers
        resultsContainer.querySelectorAll('.help-search-result').forEach(result => {
            result.addEventListener('click', () => {
                const topicId = result.dataset.topic;
                this.showHelpTopic(topicId);
            });
        });
    }

    handleQuickAction(action) {
        switch (action) {
            case 'start-tutorial':
                this.startTutorial();
                break;
            case 'show-shortcuts':
                this.showKeyboardShortcuts();
                break;
            case 'contact-support':
                this.contactSupport();
                break;
        }
    }

    async sendAIMessage(message) {
        const messagesContainer = this.helpPanel.querySelector('.ai-chat-messages');
        
        // Add user message
        this.addAIChatMessage('user', message, messagesContainer);
        
        // Show typing indicator
        const typingIndicator = this.addAIChatMessage('assistant', 'Thinking...', messagesContainer);
        
        try {
            const response = await this.aiAssistant.processQuery(message, {
                context: this.currentContext,
                userHistory: this.userInteractions.slice(-5)
            });
            
            // Remove typing indicator and add response
            messagesContainer.removeChild(typingIndicator);
            this.addAIChatMessage('assistant', response.answer, messagesContainer);
            
            // Add suggested actions if any
            if (response.suggestedActions && response.suggestedActions.length > 0) {
                this.addAISuggestedActions(response.suggestedActions, messagesContainer);
            }
            
        } catch (error) {
            messagesContainer.removeChild(typingIndicator);
            this.addAIChatMessage('assistant', 'Sorry, I encountered an error. Please try again.', messagesContainer);
        }
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addAIChatMessage(role, content, container) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chat-message ai-chat-message-${role}`;
        messageDiv.innerHTML = `
            <div class="ai-chat-message-content">
                ${role === 'assistant' ? '🤖 ' : '👤 '}${content}
            </div>
        `;
        container.appendChild(messageDiv);
        return messageDiv;
    }

    addAISuggestedActions(actions, container) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'ai-suggested-actions';
        actionsDiv.innerHTML = `
            <div class="ai-suggested-actions-header">Suggested actions:</div>
            ${actions.map(action => `
                <button class="ai-suggested-action" data-action="${action.id}">
                    ${action.label}
                </button>
            `).join('')}
        `;
        
        // Add click handlers
        actionsDiv.querySelectorAll('.ai-suggested-action').forEach(btn => {
            btn.addEventListener('click', () => {
                const actionId = btn.dataset.action;
                this.executeAISuggestedAction(actionId);
            });
        });
        
        container.appendChild(actionsDiv);
    }

    executeAISuggestedAction(actionId) {
        // Implementation would depend on the specific action
        console.log('Executing AI suggested action:', actionId);
    }

    showContextualHelp() {
        this.currentContext = this.contextEngine.getCurrentContext();
        this.updateContextualContent();
        this.showHelpPanel();
    }

    updateContextualContent() {
        const contextualContent = this.helpPanel.querySelector('.help-contextual-content');
        
        if (this.currentContext) {
            const relevantTopics = this.currentContext.helpTopics || [];
            contextualContent.innerHTML = `
                <div class="contextual-help-info">
                    <p><strong>Current section:</strong> ${this.currentContext.name}</p>
                    ${relevantTopics.length > 0 ? `
                        <div class="contextual-help-topics">
                            <p><strong>Relevant topics:</strong></p>
                            ${relevantTopics.map(topic => `
                                <button class="contextual-topic-btn" data-topic="${topic}">
                                    ${this.helpDatabase.getTitle(topic)}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
            
            // Add click handlers for topic buttons
            contextualContent.querySelectorAll('.contextual-topic-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.showHelpTopic(btn.dataset.topic);
                });
            });
        } else {
            contextualContent.innerHTML = '<p>General help is available. Use search to find specific topics.</p>';
        }
    }

    showHelpTopic(topicId) {
        const topic = this.helpDatabase.getTopic(topicId);
        if (!topic) return;

        // This would show the full topic content in the help panel
        // Implementation would depend on your UI framework
        console.log('Showing help topic:', topic.title);
    }

    showHelpPanel() {
        this.helpPanel.classList.remove('hidden');
        this.helpPanel.querySelector('.help-search-input').focus();
    }

    closeHelp() {
        this.helpPanel.classList.add('hidden');
    }

    showQuickHelp() {
        // Show a quick overlay with keyboard shortcuts and basic info
        const quickHelp = this.createElement('div', {
            className: 'quick-help-overlay',
            innerHTML: `
                <div class="quick-help-content">
                    <h3>Quick Help</h3>
                    <div class="quick-help-shortcuts">
                        <div class="shortcut-item">
                            <kbd>F1</kbd> <span>Show contextual help</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>?</kbd> <span>Show this quick help</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl+/</kbd> <span>Search help</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd> <span>Close help</span>
                        </div>
                    </div>
                    <button class="quick-help-close">Close</button>
                </div>
            `
        });

        document.body.appendChild(quickHelp);
        
        // Auto-remove after 5 seconds or on click
        const removeQuickHelp = () => {
            document.body.removeChild(quickHelp);
        };
        
        quickHelp.querySelector('.quick-help-close').addEventListener('click', removeQuickHelp);
        setTimeout(removeQuickHelp, 5000);
    }

    startTutorial() {
        // Integration with tutorial system
        if (window.InteractiveTutorialSystem) {
            const tutorialSystem = new window.InteractiveTutorialSystem();
            const tutorials = tutorialSystem.getTutorialList({ available: true });
            
            if (tutorials.length > 0) {
                // Show tutorial selection or start the first available tutorial
                tutorialSystem.startTutorial(tutorials[0].id);
            }
        }
    }

    showKeyboardShortcuts() {
        // Show comprehensive keyboard shortcuts
        console.log('Showing keyboard shortcuts');
    }

    contactSupport() {
        // Open support contact form or external link
        window.open('mailto:support@biasguards.ai?subject=BiasGuard Help Request', '_blank');
    }

    startContextualHelpEngine() {
        // Start monitoring for contextual help opportunities
        this.contextEngine.start();
        
        // Set up smart tooltips
        this.tooltipManager.initialize();
        
        // Check if user needs onboarding
        if (this.isFirstTimeUser()) {
            this.onboardingFlow.start();
        }
    }

    isFirstTimeUser() {
        return !localStorage.getItem('biasguard-help-onboarding-completed');
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

    generateSessionId() {
        return `help_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Public API methods
    showHelp(topicId = null) {
        if (topicId) {
            this.showHelpTopic(topicId);
        } else {
            this.showContextualHelp();
        }
    }

    searchHelp(query) {
        this.showHelpPanel();
        const searchInput = this.helpPanel.querySelector('.help-search-input');
        searchInput.value = query;
        searchInput.dispatchEvent(new Event('input'));
    }

    addCustomHelpContent(id, content) {
        this.helpDatabase.addContent(id, content);
    }

    trackUserInteraction(interaction) {
        this.userInteractions.push({
            ...interaction,
            timestamp: new Date().toISOString(),
            sessionId: this.helpSessionId
        });

        // Keep only last 50 interactions
        if (this.userInteractions.length > 50) {
            this.userInteractions = this.userInteractions.slice(-50);
        }
    }
}

// Supporting classes (simplified implementations)
class HelpDatabase {
    constructor() {
        this.content = new Map();
    }

    addContent(id, content) {
        this.content.set(id, content);
    }

    async search(query) {
        const results = [];
        const queryLower = query.toLowerCase();
        
        for (const [id, content] of this.content.entries()) {
            const score = this.calculateRelevanceScore(content, queryLower);
            if (score > 0) {
                results.push({
                    id,
                    title: content.title,
                    snippet: this.generateSnippet(content, queryLower),
                    score
                });
            }
        }
        
        return results.sort((a, b) => b.score - a.score).slice(0, 10);
    }

    calculateRelevanceScore(content, query) {
        let score = 0;
        const titleMatch = content.title.toLowerCase().includes(query);
        const keywordMatch = content.searchKeywords?.some(keyword => keyword.includes(query));
        
        if (titleMatch) score += 10;
        if (keywordMatch) score += 5;
        
        return score;
    }

    generateSnippet(content, query) {
        return content.content.overview || 'Help content available';
    }

    getTopic(id) {
        return this.content.get(id);
    }

    getTitle(id) {
        const topic = this.content.get(id);
        return topic ? topic.title : 'Unknown Topic';
    }
}

class ContextualHelpEngine {
    constructor() {
        this.contextDetectors = new Map();
        this.currentContext = null;
    }

    addContextDetector(id, config) {
        this.contextDetectors.set(id, config);
    }

    start() {
        // Monitor DOM changes and user interactions to detect context
        this.detectCurrentContext();
        
        // Set up periodic context checking
        setInterval(() => {
            this.detectCurrentContext();
        }, 1000);
    }

    detectCurrentContext() {
        for (const [id, config] of this.contextDetectors.entries()) {
            const element = document.querySelector(config.selector);
            if (element && this.isElementVisible(element)) {
                this.currentContext = {
                    id,
                    name: id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    ...config
                };
                break;
            }
        }
    }

    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        return rect.top >= 0 && rect.left >= 0 && 
               rect.bottom <= window.innerHeight && 
               rect.right <= window.innerWidth;
    }

    getCurrentContext() {
        return this.currentContext;
    }
}

class AIHelpAssistant {
    async processQuery(query, context = {}) {
        // This would integrate with an AI service
        // For now, return a mock response
        return {
            answer: `I understand you're asking about "${query}". Based on your current context, here's what I can help with...`,
            suggestedActions: [
                { id: 'show-tutorial', label: 'Start Tutorial' },
                { id: 'show-examples', label: 'Show Examples' }
            ]
        };
    }
}

class SmartTooltipManager {
    initialize() {
        // Set up smart tooltips for complex UI elements
        this.setupTooltips();
    }

    setupTooltips() {
        // Implementation would add intelligent tooltips
        console.log('Smart tooltips initialized');
    }
}

class OnboardingFlowManager {
    start() {
        // Start interactive onboarding for new users
        console.log('Starting onboarding flow');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { InAppHelpSystem };
} else if (typeof window !== 'undefined') {
    window.InAppHelpSystem = InAppHelpSystem;
}