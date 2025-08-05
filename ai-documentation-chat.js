/**
 * BiasGuard AI Documentation Chat Interface
 * Large context window AI assistant for comprehensive codebase help
 * Version 1.0.0 - Following 2025 AI documentation best practices
 */

class AIDocumentationChat {
    constructor(options = {}) {
        this.options = {
            model: 'claude-sonnet-4',
            maxTokens: 4000,
            temperature: 0.1,
            contextWindow: 200000, // 200K tokens for comprehensive codebase understanding
            persistConversation: true,
            codebaseIndexing: true,
            semanticSearch: true,
            ...options
        };

        this.chatInterface = null;
        this.conversationHistory = [];
        this.codebaseIndex = new CodebaseIndex();
        this.semanticSearchEngine = new SemanticSearchEngine();
        this.contextManager = new ContextManager();
        this.responseCache = new Map();
        
        this.sessionId = this.generateSessionId();
        this.isInitialized = false;
        
        this.initialize();
    }

    async initialize() {
        await this.indexCodebase();
        this.createChatInterface();
        this.setupEventListeners();
        this.loadConversationHistory();
        this.isInitialized = true;
        
        console.log('[AI Documentation Chat] Initialized with comprehensive codebase context');
    }

    async indexCodebase() {
        console.log('[AI Documentation Chat] Indexing codebase for semantic search...');
        
        // Index key files for context
        const filesToIndex = [
            'bias-ml-engine.wasm.js',
            'graphql-schema.js',
            'graphql-resolvers.js',
            'dashboard-api.js',
            'interactive-tutorials.js',
            'in-app-help-system.js',
            'README.md',
            'EXPERT_TEST_SUITE.md'
        ];

        for (const file of filesToIndex) {
            try {
                const content = await this.fetchFileContent(file);
                await this.codebaseIndex.indexFile(file, content);
            } catch (error) {
                console.warn(`[AI Documentation Chat] Could not index ${file}:`, error.message);
            }
        }

        // Index API schema and documentation
        await this.indexAPIDocumentation();
        
        console.log('[AI Documentation Chat] Codebase indexing complete');
    }

    async indexAPIDocumentation() {
        // Index GraphQL schema for API queries
        const schemaContent = await this.fetchFileContent('graphql-schema.js');
        await this.codebaseIndex.indexAPISchema(schemaContent);
        
        // Index tutorial content
        const tutorialContent = await this.fetchFileContent('interactive-tutorials.js');
        await this.codebaseIndex.indexTutorials(tutorialContent);
        
        // Index help system content
        const helpContent = await this.fetchFileContent('in-app-help-system.js');
        await this.codebaseIndex.indexHelpContent(helpContent);
    }

    createChatInterface() {
        this.chatInterface = this.createElement('div', {
            id: 'ai-documentation-chat',
            className: 'ai-doc-chat-container',
            innerHTML: `
                <div class="ai-chat-header">
                    <div class="chat-title">
                        <h3>🤖 AI Documentation Assistant</h3>
                        <span class="chat-subtitle">Ask me anything about BiasGuard</span>
                    </div>
                    <div class="chat-controls">
                        <button class="chat-control-btn" id="context-btn" title="Current Context">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </button>
                        <button class="chat-control-btn" id="settings-btn" title="Chat Settings">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                            </svg>
                        </button>
                        <button class="chat-control-btn" id="minimize-btn" title="Minimize Chat">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 13H5v-2h14v2z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="ai-chat-context-bar">
                    <div class="context-indicator">
                        <span class="context-icon">📍</span>
                        <span class="context-text">General Help</span>
                    </div>
                    <div class="context-stats">
                        <span class="stats-item">🧠 ${this.codebaseIndex.getIndexedFilesCount()} files indexed</span>
                        <span class="stats-item">💬 ${this.conversationHistory.length} messages</span>
                    </div>
                </div>
                <div class="ai-chat-messages" id="chat-messages">
                    <div class="welcome-message">
                        <div class="ai-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <h4>Welcome to the BiasGuard AI Documentation Assistant!</h4>
                                <p>I have comprehensive knowledge of the entire BiasGuard codebase, including:</p>
                                <ul>
                                    <li>📊 Statistical analysis methods (p-values, confidence intervals, effect sizes)</li>
                                    <li>🔍 Intersectional and geopolitical bias detection</li>
                                    <li>⚡ GraphQL API integration and best practices</li>
                                    <li>🎯 Interactive tutorials and learning paths</li>
                                    <li>📈 Dashboard analytics and monitoring</li>
                                </ul>
                                <p><strong>Try asking me:</strong></p>
                                <div class="suggested-questions">
                                    <button class="suggestion-btn" data-question="How do I interpret a p-value of 0.03 in bias detection?">How do I interpret a p-value of 0.03 in bias detection?</button>
                                    <button class="suggestion-btn" data-question="Show me how to query intersectional analysis results using GraphQL">Show me how to query intersectional analysis results using GraphQL</button>
                                    <button class="suggestion-btn" data-question="What's the difference between statistical and practical significance?">What's the difference between statistical and practical significance?</button>
                                    <button class="suggestion-btn" data-question="How does the bias amplification factor work in intersectional analysis?">How does the bias amplification factor work in intersectional analysis?</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ai-chat-input-area">
                    <div class="input-container">
                        <div class="input-wrapper">
                            <textarea 
                                id="chat-input" 
                                placeholder="Ask me anything about BiasGuard - I have access to the entire codebase..."
                                rows="1"
                            ></textarea>
                            <div class="input-actions">
                                <button class="action-btn" id="attach-code-btn" title="Attach Code Context">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                                    </svg>
                                </button>
                                <button class="action-btn" id="voice-input-btn" title="Voice Input">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                                    </svg>
                                </button>
                                <button class="send-btn" id="send-message-btn" title="Send Message (Ctrl+Enter)">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="input-status">
                            <div class="typing-indicator" style="display: none;">
                                <span class="typing-dot"></span>
                                <span class="typing-dot"></span>
                                <span class="typing-dot"></span>
                                <span class="typing-text">AI is thinking...</span>
                            </div>
                            <div class="input-hints">
                                <span class="hint">💡 Try: "Explain the bias amplification algorithm" or "Show GraphQL mutation examples"</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        });

        // Add to DOM
        document.body.appendChild(this.chatInterface);
        this.setupChatStyles();
        
        // Position chat interface
        this.positionChatInterface();
    }

    setupChatStyles() {
        const styles = `
            .ai-doc-chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 420px;
                max-height: 80vh;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05);
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                z-index: 2000;
                transform: translateY(0);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255,255,255,0.2);
            }

            .ai-doc-chat-container.minimized {
                transform: translateY(calc(100% - 60px));
            }

            .ai-chat-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, #1e40af 0%, #059669 100%);
                color: white;
                border-radius: 16px 16px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
            }

            .chat-title h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .chat-subtitle {
                font-size: 12px;
                opacity: 0.8;
                margin-top: 2px;
                display: block;
            }

            .chat-controls {
                display: flex;
                gap: 8px;
            }

            .chat-control-btn {
                padding: 6px;
                background: rgba(255,255,255,0.1);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 6px;
                color: white;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .chat-control-btn:hover {
                background: rgba(255,255,255,0.2);
            }

            .ai-chat-context-bar {
                padding: 12px 20px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 12px;
            }

            .context-indicator {
                display: flex;
                align-items: center;
                gap: 6px;
                font-weight: 500;
                color: #475569;
            }

            .context-stats {
                display: flex;
                gap: 12px;
                color: #64748b;
                font-size: 11px;
            }

            .ai-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                max-height: 400px;
                scroll-behavior: smooth;
            }

            .welcome-message {
                margin-bottom: 20px;
            }

            .ai-message, .user-message {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
                animation: messageSlideIn 0.3s ease-out;
            }

            @keyframes messageSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .user-message {
                flex-direction: row-reverse;
            }

            .message-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }

            .ai-message .message-avatar {
                background: linear-gradient(135deg, #3b82f6, #10b981);
                color: white;
            }

            .user-message .message-avatar {
                background: #e2e8f0;
                color: #475569;
            }

            .message-content {
                flex: 1;
                background: #f8fafc;
                padding: 12px 16px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                line-height: 1.5;
            }

            .user-message .message-content {
                background: #3b82f6;
                color: white;
                border-color: #3b82f6;
            }

            .message-content h4 {
                margin: 0 0 8px 0;
                font-size: 14px;
                font-weight: 600;
            }

            .message-content p {
                margin: 0 0 8px 0;
                font-size: 14px;
            }

            .message-content ul {
                margin: 8px 0;
                padding-left: 20px;
            }

            .message-content li {
                margin-bottom: 4px;
                font-size: 14px;
            }

            .suggested-questions {
                margin-top: 12px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .suggestion-btn {
                background: white;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 13px;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #374151;
            }

            .suggestion-btn:hover {
                background: #f3f4f6;
                border-color: #9ca3af;
                transform: translateY(-1px);
            }

            .code-block {
                background: #1e293b;
                color: #e2e8f0;
                padding: 12px;
                border-radius: 8px;
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                font-size: 13px;
                line-height: 1.4;
                margin: 8px 0;
                overflow-x: auto;
                position: relative;
            }

            .code-block::before {
                content: attr(data-language);
                position: absolute;
                top: 8px;
                right: 12px;
                font-size: 11px;
                color: #94a3b8;
                text-transform: uppercase;
                font-weight: 500;
            }

            .ai-chat-input-area {
                border-top: 1px solid #e2e8f0;
                padding: 16px 20px;
                background: white;
                border-radius: 0 0 16px 16px;
            }

            .input-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .input-wrapper {
                display: flex;
                align-items: flex-end;
                gap: 8px;
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                padding: 8px;
                transition: all 0.2s ease;
            }

            .input-wrapper:focus-within {
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            #chat-input {
                flex: 1;
                border: none;
                background: transparent;
                resize: none;
                outline: none;
                font-size: 14px;
                line-height: 1.4;
                padding: 4px 8px;
                font-family: inherit;
                max-height: 120px;
                min-height: 20px;
            }

            .input-actions {
                display: flex;
                gap: 4px;
                align-items: center;
            }

            .action-btn {
                padding: 6px;
                background: transparent;
                border: none;
                border-radius: 6px;
                color: #6b7280;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .action-btn:hover {
                background: #e5e7eb;
                color: #374151;
            }

            .send-btn {
                background: #3b82f6;
                color: white;
                padding: 8px;
            }

            .send-btn:hover {
                background: #2563eb;
            }

            .send-btn:disabled {
                background: #9ca3af;
                cursor: not-allowed;
            }

            .input-status {
                display: flex;
                justify-content: space-between;
                align-items: center;
                min-height: 20px;
            }

            .typing-indicator {
                display: flex;
                align-items: center;
                gap: 6px;
                color: #6b7280;
                font-size: 12px;
            }

            .typing-dot {
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #6b7280;
                animation: typingDots 1.4s infinite ease-in-out;
            }

            .typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typingDots {
                0%, 80%, 100% {
                    transform: scale(0.8);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1);
                    opacity: 1;
                }
            }

            .input-hints {
                font-size: 11px;
                color: #9ca3af;
            }

            .message-actions {
                margin-top: 8px;
                display: flex;
                gap: 8px;
            }

            .message-action-btn {
                padding: 4px 8px;
                background: rgba(59, 130, 246, 0.1);
                border: 1px solid rgba(59, 130, 246, 0.2);
                border-radius: 4px;
                color: #3b82f6;
                font-size: 11px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .message-action-btn:hover {
                background: rgba(59, 130, 246, 0.2);
            }

            .error-message {
                background: #fef2f2;
                border: 1px solid #fecaca;
                color: #dc2626;
                padding: 12px;
                border-radius: 8px;
                margin: 8px 0;
                font-size: 14px;
            }

            .context-panel {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                padding: 16px;
                margin-top: 8px;
                z-index: 2001;
                display: none;
            }

            .context-panel.active {
                display: block;
            }

            @media (max-width: 768px) {
                .ai-doc-chat-container {
                    width: calc(100vw - 40px);
                    max-width: 420px;
                    bottom: 10px;
                    right: 20px;
                    left: 20px;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    setupEventListeners() {
        const chatInput = this.chatInterface.querySelector('#chat-input');
        const sendBtn = this.chatInterface.querySelector('#send-message-btn');
        const messagesContainer = this.chatInterface.querySelector('#chat-messages');

        // Send message
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.sendMessage(message);
                chatInput.value = '';
                this.adjustTextareaHeight(chatInput);
            }
        };

        sendBtn.addEventListener('click', sendMessage);

        // Keyboard shortcuts
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    sendMessage();
                } else if (!e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            }
        });

        // Auto-resize textarea
        chatInput.addEventListener('input', (e) => {
            this.adjustTextareaHeight(e.target);
        });

        // Suggested questions
        messagesContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-btn')) {
                const question = e.target.dataset.question;
                this.sendMessage(question);
            }
        });

        // Chat controls
        this.chatInterface.querySelector('#minimize-btn').addEventListener('click', () => {
            this.toggleMinimize();
        });

        this.chatInterface.querySelector('#context-btn').addEventListener('click', () => {
            this.showContextPanel();
        });

        this.chatInterface.querySelector('#settings-btn').addEventListener('click', () => {
            this.showSettingsPanel();
        });

        // Header click to toggle minimize
        this.chatInterface.querySelector('.ai-chat-header').addEventListener('click', (e) => {
            if (!e.target.closest('.chat-controls')) {
                this.toggleMinimize();
            }
        });

        // Voice input (if supported)
        const voiceBtn = this.chatInterface.querySelector('#voice-input-btn');
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            voiceBtn.addEventListener('click', () => {
                this.startVoiceInput();
            });
        } else {
            voiceBtn.style.display = 'none';
        }

        // Attach code context
        this.chatInterface.querySelector('#attach-code-btn').addEventListener('click', () => {
            this.showCodeContextDialog();
        });
    }

    async sendMessage(message) {
        // Add user message to chat
        this.addMessageToChat('user', message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to chat
            this.addMessageToChat('ai', response.content, response.metadata);
            
            // Save conversation
            this.saveConversation();
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addErrorMessage('Sorry, I encountered an error. Please try again.');
            console.error('[AI Documentation Chat] Error:', error);
        }
    }

    async getAIResponse(userMessage) {
        // Check cache first
        const cacheKey = this.generateCacheKey(userMessage);
        if (this.responseCache.has(cacheKey)) {
            return this.responseCache.get(cacheKey);
        }

        // Build context for AI
        const context = await this.buildContext(userMessage);
        
        // Prepare messages for AI
        const messages = [
            {
                role: 'system',
                content: this.buildSystemPrompt(context)
            },
            ...this.conversationHistory.slice(-10), // Last 10 messages for context
            {
                role: 'user',
                content: userMessage
            }
        ];

        // Call AI API
        const response = await this.callAIAPI(messages);
        
        // Cache response
        this.responseCache.set(cacheKey, response);
        
        // Clean cache if too large
        if (this.responseCache.size > 100) {
            const firstKey = this.responseCache.keys().next().value;
            this.responseCache.delete(firstKey);
        }

        return response;
    }

    buildSystemPrompt(context) {
        return `You are the BiasGuard AI Documentation Assistant, an expert system with comprehensive knowledge of the BiasGuard bias detection platform.

CONTEXT INFORMATION:
${context.codebaseContext}

CURRENT USER CONTEXT:
- Page: ${context.currentPage}
- Component: ${context.currentComponent}
- User Level: ${context.userLevel}

CAPABILITIES:
- Statistical Analysis: P-values, confidence intervals, effect sizes, Cohen's d
- Bias Detection: Demographic, geopolitical, intersectional bias patterns
- GraphQL API: Queries, mutations, subscriptions, error handling
- Interactive Tutorials: Statistical significance, intersectional analysis
- Dashboard Analytics: Metrics interpretation, trend analysis
- Technical Integration: API best practices, performance optimization

RESPONSE GUIDELINES:
1. Be comprehensive but concise
2. Include relevant code examples when discussing API or implementation
3. Reference specific files, functions, or components when relevant
4. Provide actionable insights and next steps
5. Use the user's current context to tailor responses
6. Format code with proper syntax highlighting
7. Include links to relevant tutorials or documentation sections
8. Explain statistical concepts clearly with practical examples
9. Suggest follow-up questions or related topics

EXPERTISE AREAS:
- Statistical significance testing and interpretation
- Intersectional bias analysis and amplification factors
- GraphQL schema design and query optimization
- Real-time dashboard metrics and analytics
- AI-powered tutorial systems and progressive learning
- Production deployment and monitoring best practices

Remember: You have access to the complete BiasGuard codebase and can reference specific implementations, algorithms, and architectural decisions.`;
    }

    async buildContext(userMessage) {
        // Semantic search for relevant code
        const relevantCode = await this.semanticSearchEngine.search(userMessage, {
            maxResults: 5,
            includeCode: true
        });

        // Get current page context
        const currentContext = this.contextManager.getCurrentContext();

        // Build comprehensive context
        const codebaseContext = relevantCode.map(result => 
            `File: ${result.file}\nRelevance: ${result.relevance}\nContent:\n${result.content}\n---`
        ).join('\n');

        return {
            codebaseContext,
            currentPage: currentContext.page || 'unknown',
            currentComponent: currentContext.component || 'unknown',
            userLevel: this.getUserLevel(),
            relevantFiles: relevantCode.map(r => r.file)
        };
    }

    async callAIAPI(messages) {
        // In a real implementation, this would call your AI service
        // For now, return a sophisticated mock response
        
        const userMessage = messages[messages.length - 1].content.toLowerCase();
        
        if (userMessage.includes('p-value') || userMessage.includes('statistical significance')) {
            return {
                content: `## Understanding P-Values in Bias Detection

A p-value measures the probability of observing your results (or more extreme) if no bias actually exists (null hypothesis).

**Key Interpretations:**
- **p < 0.05**: Statistically significant (less than 5% chance of false positive)
- **p < 0.01**: Highly significant (less than 1% chance of false positive)
- **p ≥ 0.05**: Not statistically significant (insufficient evidence of bias)

**Example from BiasGuard:**
\`\`\`javascript
// From bias-ml-engine.wasm.js - Statistical Significance Calculation
const statisticalSignificance = {
  pValue: 0.03,
  confidenceInterval: { lower: 72.1, upper: 83.5, level: 0.95 },
  effectSize: 1.2,
  significance: 'SIGNIFICANT'
};

// Interpretation: 
// - 3% chance this result occurred by chance
// - 95% confident true bias score is between 72.1-83.5
// - Large effect size (Cohen's d = 1.2) indicates meaningful bias
\`\`\`

**Important:** Always consider both statistical AND practical significance. A tiny p-value with small effect size may be statistically significant but not practically meaningful.

Would you like me to explain confidence intervals or effect sizes next?`,
                metadata: {
                    suggestedActions: [
                        { id: 'explain-confidence-intervals', label: 'Explain Confidence Intervals' },
                        { id: 'show-effect-size-calculation', label: 'Show Effect Size Calculation' },
                        { id: 'open-statistical-tutorial', label: 'Open Statistical Tutorial' }
                    ],
                    relatedTopics: ['confidence-intervals', 'effect-size', 'statistical-significance-tutorial'],
                    codeReferences: ['bias-ml-engine.wasm.js:calculateStatisticalSignificance']
                }
            };
        }
        
        if (userMessage.includes('graphql') || userMessage.includes('api')) {
            return {
                content: `## BiasGuard GraphQL API Integration

The BiasGuard API provides a unified GraphQL endpoint for all bias detection operations.

**Basic Analysis Query:**
\`\`\`graphql
query SubmitAnalysis($input: AnalysisInput!) {
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
      effectSize
    }
    intersectionalAnalysis {
      compoundBiasScore
      amplificationFactor
      riskAssessment
    }
  }
}
\`\`\`

**Variables:**
\`\`\`json
{
  "input": {
    "text": "Your text to analyze",
    "options": {
      "includeIntersectional": true,
      "includeGeopolitical": true,
      "confidenceThreshold": 0.7
    }
  }
}
\`\`\`

**Real-time Updates:**
\`\`\`graphql
subscription AnalysisUpdates {
  analysisCompleted {
    id
    overallScore
    patterns { type severity }
  }
}
\`\`\`

**Error Handling Best Practices:**
\`\`\`javascript
try {
  const result = await client.query({
    query: SUBMIT_ANALYSIS,
    variables: { input }
  });
  return result.data.submitAnalysis;
} catch (error) {
  if (error.networkError?.statusCode === 429) {
    // Rate limited - implement exponential backoff
    await delay(Math.pow(2, retryCount) * 1000);
    return retryRequest();
  }
  throw new Error(\`Analysis failed: \${error.message}\`);
}
\`\`\`

The API is available at \`/graphql\` with interactive playground at \`/playground\`.

Need help with a specific query or integration pattern?`,
                metadata: {
                    suggestedActions: [
                        { id: 'open-graphql-playground', label: 'Open GraphQL Playground' },
                        { id: 'show-mutation-examples', label: 'Show More Mutation Examples' },
                        { id: 'explain-error-handling', label: 'Explain Error Handling' }
                    ],
                    relatedTopics: ['graphql-mutations', 'api-authentication', 'error-handling'],
                    codeReferences: ['graphql-schema.js', 'graphql-resolvers.js']
                }
            };
        }

        // Default response
        return {
            content: `I'd be happy to help you with BiasGuard! I have comprehensive knowledge of:

📊 **Statistical Analysis**: P-values, confidence intervals, effect sizes
🔍 **Bias Detection**: Demographic, geopolitical, and intersectional analysis  
⚡ **GraphQL API**: Queries, mutations, subscriptions, and best practices
🎯 **Interactive Tutorials**: Step-by-step learning paths
📈 **Dashboard Analytics**: Metrics interpretation and monitoring

What specific aspect would you like to explore? You can ask about:
- How to interpret statistical results
- GraphQL API integration examples
- Intersectional bias analysis methods
- Dashboard features and navigation
- Tutorial recommendations based on your level

Feel free to be specific - I can reference exact code implementations and provide working examples!`,
            metadata: {
                suggestedActions: [
                    { id: 'show-getting-started', label: 'Getting Started Guide' },
                    { id: 'open-tutorials', label: 'Browse Tutorials' },
                    { id: 'show-api-docs', label: 'API Documentation' }
                ],
                relatedTopics: ['getting-started', 'tutorials', 'api-documentation']
            }
        };
    }

    addMessageToChat(role, content, metadata = {}) {
        const messagesContainer = this.chatInterface.querySelector('#chat-messages');
        
        const messageDiv = this.createElement('div', {
            className: `${role}-message`,
            innerHTML: `
                <div class="message-avatar">${role === 'ai' ? '🤖' : '👤'}</div>
                <div class="message-content">
                    ${this.formatMessageContent(content)}
                    ${metadata.suggestedActions ? this.renderSuggestedActions(metadata.suggestedActions) : ''}
                </div>
            `
        });

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Add to conversation history
        this.conversationHistory.push({
            role: role === 'ai' ? 'assistant' : 'user',
            content,
            timestamp: new Date().toISOString(),
            metadata
        });
    }

    formatMessageContent(content) {
        // Convert markdown-like syntax to HTML
        return content
            .replace(/## (.*)/g, '<h4>$1</h4>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<div class="code-block" data-language="$1">$2</div>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
    }

    renderSuggestedActions(actions) {
        return `
            <div class="message-actions">
                ${actions.map(action => 
                    `<button class="message-action-btn" data-action="${action.id}">${action.label}</button>`
                ).join('')}
            </div>
        `;
    }

    addErrorMessage(message) {
        const messagesContainer = this.chatInterface.querySelector('#chat-messages');
        
        const errorDiv = this.createElement('div', {
            className: 'error-message',
            innerHTML: `⚠️ ${message}`
        });

        messagesContainer.appendChild(errorDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = this.chatInterface.querySelector('.typing-indicator');
        indicator.style.display = 'flex';
    }

    hideTypingIndicator() {
        const indicator = this.chatInterface.querySelector('.typing-indicator');
        indicator.style.display = 'none';
    }

    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    toggleMinimize() {
        this.chatInterface.classList.toggle('minimized');
    }

    showContextPanel() {
        // Implementation for showing current context information
        console.log('Showing context panel');
    }

    showSettingsPanel() {
        // Implementation for showing chat settings
        console.log('Showing settings panel');
    }

    startVoiceInput() {
        // Implementation for voice input
        console.log('Starting voice input');
    }

    showCodeContextDialog() {
        // Implementation for attaching code context
        console.log('Showing code context dialog');
    }

    positionChatInterface() {
        // Ensure chat doesn't overlap with other UI elements
        const existingHelp = document.querySelector('#biasguard-help-panel');
        if (existingHelp && !existingHelp.classList.contains('hidden')) {
            this.chatInterface.style.right = '440px'; // Offset for help panel
        }
    }

    // Utility methods
    generateSessionId() {
        return `ai_chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateCacheKey(message) {
        return btoa(message.toLowerCase().replace(/\s+/g, ' ').trim()).slice(0, 20);
    }

    getUserLevel() {
        // Determine user level based on interaction history
        const messageCount = this.conversationHistory.length;
        if (messageCount > 50) return 'expert';
        if (messageCount > 20) return 'advanced';
        if (messageCount > 5) return 'intermediate';
        return 'beginner';
    }

    async fetchFileContent(filename) {
        // In a real implementation, this would fetch actual file content
        // For now, return mock content
        return `// Mock content for ${filename}\n// This would contain the actual file content in production`;
    }

    loadConversationHistory() {
        const saved = localStorage.getItem(`biasguard-ai-chat-${this.sessionId}`);
        if (saved) {
            this.conversationHistory = JSON.parse(saved);
            // Restore chat messages in UI
            this.conversationHistory.forEach(msg => {
                if (msg.role !== 'system') {
                    this.addMessageToChat(msg.role === 'assistant' ? 'ai' : 'user', msg.content, msg.metadata);
                }
            });
        }
    }

    saveConversation() {
        if (this.options.persistConversation) {
            localStorage.setItem(
                `biasguard-ai-chat-${this.sessionId}`, 
                JSON.stringify(this.conversationHistory)
            );
        }
    }

    createElement(tag, attributes = {}) {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });
        return element;
    }

    // Public API methods
    show() {
        this.chatInterface.style.display = 'flex';
        this.positionChatInterface();
    }

    hide() {
        this.chatInterface.style.display = 'none';
    }

    sendQuestion(question) {
        this.show();
        this.sendMessage(question);
    }

    updateContext(context) {
        this.contextManager.updateContext(context);
        
        // Update context display
        const contextText = this.chatInterface.querySelector('.context-text');
        contextText.textContent = context.name || 'General Help';
    }
}

// Supporting classes (simplified implementations)
class CodebaseIndex {
    constructor() {
        this.files = new Map();
        this.apiSchema = null;
        this.tutorials = new Map();
        this.helpContent = new Map();
    }

    async indexFile(filename, content) {
        this.files.set(filename, {
            content,
            indexed: new Date().toISOString(),
            tokens: this.tokenizeContent(content)
        });
    }

    async indexAPISchema(schemaContent) {
        this.apiSchema = {
            content: schemaContent,
            indexed: new Date().toISOString()
        };
    }

    async indexTutorials(tutorialContent) {
        // Extract tutorial information from content
        this.tutorials.set('interactive-tutorials', {
            content: tutorialContent,
            indexed: new Date().toISOString()
        });
    }

    async indexHelpContent(helpContent) {
        this.helpContent.set('in-app-help', {
            content: helpContent,
            indexed: new Date().toISOString()
        });
    }

    tokenizeContent(content) {
        // Simple tokenization - in production, use proper NLP tokenization
        return content.toLowerCase().split(/\W+/).filter(token => token.length > 2);
    }

    getIndexedFilesCount() {
        return this.files.size + (this.apiSchema ? 1 : 0) + this.tutorials.size + this.helpContent.size;
    }
}

class SemanticSearchEngine {
    async search(query, options = {}) {
        // Mock semantic search results
        return [
            {
                file: 'bias-ml-engine.wasm.js',
                relevance: 0.95,
                content: '// Statistical significance calculation methods...'
            },
            {
                file: 'graphql-schema.js',
                relevance: 0.87,
                content: '// GraphQL schema definitions...'
            }
        ];
    }
}

class ContextManager {
    constructor() {
        this.currentContext = { page: 'unknown', component: 'unknown' };
    }

    getCurrentContext() {
        return this.currentContext;
    }

    updateContext(context) {
        this.currentContext = { ...this.currentContext, ...context };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AIDocumentationChat };
} else if (typeof window !== 'undefined') {
    window.AIDocumentationChat = AIDocumentationChat;
}