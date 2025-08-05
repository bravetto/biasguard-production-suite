/**
 * BiasGuard Stripe Subscription Handler
 * Implements 14-day free trial with tiered SaaS pricing
 * Integrates with advanced bias detection system
 * 
 * Pricing Tiers:
 * - Starter: $19.99/month (price_1RsDxiL7UMRowhrwAa7Zimok)
 * - Professional: $99/month (price_1RsDyVL7UMRowhrw9XnqUl2W)
 * - Enterprise: $299/month (price_1RsDz8L7UMRowhrwqqKW2tV7)
 */

class StripeSubscriptionHandler {
    constructor() {
        this.isInitialized = false;
        this.pricingTiers = this.initializePricingTiers();
        this.subscriptionLimits = this.initializeSubscriptionLimits();
        this.currentSubscription = null;
        this.usageTracking = {
            analysesThisMonth: 0,
            counterfactualAnalyses: 0,
            codeAnalyses: 0,
            lastReset: new Date().toISOString()
        };
    }

    /**
     * Initialize pricing tiers with Stripe price IDs
     */
    initializePricingTiers() {
        return {
            starter: {
                name: 'BiasGuard Starter',
                price: 19.99,
                priceId: 'price_1RsDxiL7UMRowhrwAa7Zimok',
                features: [
                    '1,000 bias analyses per month',
                    'Basic text bias detection',
                    'Standard reporting',
                    'Email support',
                    '14-day free trial'
                ],
                limits: {
                    monthlyAnalyses: 1000,
                    counterfactualAnalyses: 100,
                    codeAnalyses: 50,
                    advancedFeatures: false
                }
            },
            professional: {
                name: 'BiasGuard Professional',
                price: 99,
                priceId: 'price_1RsDyVL7UMRowhrw9XnqUl2W',
                features: [
                    '10,000 bias analyses per month',
                    'Advanced counterfactual analysis',
                    'Code bias detection',
                    'Intersectional bias analysis',
                    'Priority support',
                    'Custom reporting',
                    '14-day free trial'
                ],
                limits: {
                    monthlyAnalyses: 10000,
                    counterfactualAnalyses: 2000,
                    codeAnalyses: 1000,
                    advancedFeatures: true
                }
            },
            enterprise: {
                name: 'BiasGuard Enterprise',
                price: 299,
                priceId: 'price_1RsDz8L7UMRowhrwqqKW2tV7',
                features: [
                    'Unlimited bias analyses',
                    'Full counterfactual analysis suite',
                    'Advanced code bias detection',
                    'Neural howlround prevention',
                    'White-label solutions',
                    'Dedicated support',
                    'Custom integrations',
                    '14-day free trial'
                ],
                limits: {
                    monthlyAnalyses: Infinity,
                    counterfactualAnalyses: Infinity,
                    codeAnalyses: Infinity,
                    advancedFeatures: true,
                    neuralHowlroundPrevention: true
                }
            }
        };
    }

    /**
     * Initialize subscription limits and tracking
     */
    initializeSubscriptionLimits() {
        return {
            free: {
                monthlyAnalyses: 10,
                counterfactualAnalyses: 0,
                codeAnalyses: 0,
                advancedFeatures: false
            },
            trial: {
                monthlyAnalyses: 100,
                counterfactualAnalyses: 20,
                codeAnalyses: 10,
                advancedFeatures: true,
                trialDays: 14
            }
        };
    }

    /**
     * Initialize subscription handler with current user status
     */
    async initialize() {
        try {
            // Load current subscription from localStorage or API
            this.currentSubscription = this.loadCurrentSubscription();
            
            // Check trial status
            this.checkTrialStatus();
            
            // Update usage tracking
            this.updateUsageTracking();
            
            this.isInitialized = true;
            console.log('✅ Stripe Subscription Handler initialized');
            
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Stripe Subscription Handler:', error);
            return false;
        }
    }

    /**
     * Create Stripe checkout session for subscription
     */
    async createCheckoutSession(tier, _options = {}) {
        const pricingTier = this.pricingTiers[tier];
        if (!pricingTier) {
            throw new Error(`Invalid pricing tier: ${tier}`);
        }

        try {
            console.log('🔄 Creating Stripe checkout session for tier:', tier);
            
            // Call the backend API to create a real Stripe checkout session
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: pricingTier.priceId,
                    tier: tier,
                    mode: 'subscription',
                    successPath: '/subscription-success',
                    cancelPath: '/pricing'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create checkout session');
            }

            const session = await response.json();
            console.log('✅ Checkout session created:', session.sessionId);
            
            // Redirect to Stripe checkout
            window.location.href = session.url;
            
            return { success: true, sessionId: session.sessionId, tier, pricing: pricingTier };

        } catch (error) {
            console.error('❌ Failed to create checkout session:', error);
            throw error;
        }
    }

    /**
     * Create customer portal session for subscription management
     */
    async createCustomerPortalSession(customerId, returnUrl = null) {
        try {
            console.log('🔄 Creating customer portal session for:', customerId);
            
            const response = await fetch('/api/customer-portal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: customerId,
                    returnUrl: returnUrl || `${window.location.origin}/account`
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create customer portal session');
            }

            const session = await response.json();
            console.log('✅ Customer portal session created');
            
            // Redirect to Stripe customer portal
            window.location.href = session.url;
            
            return { success: true, url: session.url };

        } catch (error) {
            console.error('❌ Failed to create customer portal session:', error);
            throw error;
        }
    }

    /**
     * Check if user can perform analysis based on subscription limits
     */
    canPerformAnalysis(analysisType = 'basic') {
        if (!this.currentSubscription) {
            return this.usageTracking.analysesThisMonth < this.subscriptionLimits.free.monthlyAnalyses;
        }

        const limits = this.currentSubscription.limits;
        
        switch (analysisType) {
            case 'basic':
                return this.usageTracking.analysesThisMonth < limits.monthlyAnalyses;
            case 'counterfactual':
                return limits.advancedFeatures && 
                       this.usageTracking.counterfactualAnalyses < limits.counterfactualAnalyses;
            case 'code':
                return limits.advancedFeatures && 
                       this.usageTracking.codeAnalyses < limits.codeAnalyses;
            case 'neural_howlround':
                return limits.neuralHowlroundPrevention === true;
            default:
                return false;
        }
    }

    /**
     * Track analysis usage
     */
    trackAnalysisUsage(analysisType = 'basic') {
        this.usageTracking.analysesThisMonth++;
        
        switch (analysisType) {
            case 'counterfactual':
                this.usageTracking.counterfactualAnalyses++;
                break;
            case 'code':
                this.usageTracking.codeAnalyses++;
                break;
        }
        
        this.saveUsageTracking();
        this.updateUsageDisplay();
    }

    /**
     * Get usage statistics for current subscription
     */
    getUsageStats() {
        const limits = this.currentSubscription?.limits || this.subscriptionLimits.free;
        
        return {
            basicAnalyses: {
                used: this.usageTracking.analysesThisMonth,
                limit: limits.monthlyAnalyses,
                percentage: limits.monthlyAnalyses === Infinity ? 0 : 
                           Math.round((this.usageTracking.analysesThisMonth / limits.monthlyAnalyses) * 100)
            },
            counterfactualAnalyses: {
                used: this.usageTracking.counterfactualAnalyses,
                limit: limits.counterfactualAnalyses,
                percentage: limits.counterfactualAnalyses === Infinity ? 0 : 
                           Math.round((this.usageTracking.counterfactualAnalyses / limits.counterfactualAnalyses) * 100)
            },
            codeAnalyses: {
                used: this.usageTracking.codeAnalyses,
                limit: limits.codeAnalyses,
                percentage: limits.codeAnalyses === Infinity ? 0 : 
                           Math.round((this.usageTracking.codeAnalyses / limits.codeAnalyses) * 100)
            },
            subscriptionTier: this.currentSubscription?.tier || 'free',
            trialDaysRemaining: this.getTrialDaysRemaining()
        };
    }

    /**
     * Show subscription upgrade modal
     */
    showUpgradeModal(requiredFeature) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); display: flex; align-items: center; 
            justify-content: center; z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white; padding: 2rem; border-radius: 1rem; max-width: 500px; 
            margin: 1rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        `;
        
        modalContent.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🚀</div>
            <h2 style="margin-bottom: 1rem; color: #1e40af;">Upgrade Required</h2>
            <p style="margin-bottom: 1.5rem; color: #6b7280; line-height: 1.6;">
                ${this.getUpgradeMessage(requiredFeature)}
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button onclick="this.closest('.modal').remove()" 
                        style="padding: 0.75rem 1.5rem; border: 1px solid #d1d5db; 
                               background: white; border-radius: 0.5rem; cursor: pointer;">
                    Maybe Later
                </button>
                <button onclick="stripeHandler.showPricingModal()" 
                        style="padding: 0.75rem 1.5rem; background: #1e40af; color: white; 
                               border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                    View Pricing
                </button>
            </div>
        `;
        
        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * Show pricing modal with all tiers
     */
    showPricingModal() {
        // Remove existing modals
        document.querySelectorAll('.modal').forEach(modal => modal.remove());
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); display: flex; align-items: center; 
            justify-content: center; z-index: 10000; overflow-y: auto;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white; padding: 2rem; border-radius: 1rem; max-width: 900px; 
            margin: 1rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        `;
        
        modalContent.innerHTML = `
            <div style="margin-bottom: 2rem;">
                <h2 style="margin-bottom: 0.5rem; color: #1e40af; font-size: 2rem;">Choose Your Plan</h2>
                <p style="color: #6b7280;">All plans include a 14-day free trial</p>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                ${Object.entries(this.pricingTiers).map(([tier, pricing]) => `
                    <div style="border: 2px solid ${tier === 'professional' ? '#1e40af' : '#e5e7eb'}; 
                                border-radius: 1rem; padding: 1.5rem; position: relative;
                                ${tier === 'professional' ? 'transform: scale(1.05);' : ''}">
                        ${tier === 'professional' ? '<div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: #1e40af; color: white; padding: 0.25rem 1rem; border-radius: 9999px; font-size: 0.8rem; font-weight: 600;">POPULAR</div>' : ''}
                        
                        <h3 style="margin-bottom: 0.5rem; color: #111827; font-size: 1.25rem;">${pricing.name}</h3>
                        <div style="margin-bottom: 1rem;">
                            <span style="font-size: 2.5rem; font-weight: 700; color: #1e40af;">$${pricing.price}</span>
                            <span style="color: #6b7280;">/month</span>
                        </div>
                        
                        <ul style="text-align: left; margin-bottom: 1.5rem; color: #374151; line-height: 1.6;">
                            ${pricing.features.map(feature => `<li style="margin-bottom: 0.5rem;">✅ ${feature}</li>`).join('')}
                        </ul>
                        
                        <button onclick="stripeHandler.createCheckoutSession('${tier}')" 
                                style="width: 100%; padding: 0.75rem; background: ${tier === 'professional' ? '#1e40af' : '#6b7280'}; 
                                       color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                            Start Free Trial
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="this.closest('.modal').remove()" 
                    style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; background: white; 
                           border-radius: 0.5rem; cursor: pointer; color: #6b7280;">
                Close
            </button>
        `;
        
        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    /**
     * Show subscription confirmation modal
     */
    showSubscriptionModal(tier, pricing) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.8); display: flex; align-items: center; 
            justify-content: center; z-index: 10000;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white; padding: 2rem; border-radius: 1rem; max-width: 400px; 
            margin: 1rem; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
        `;
        
        modalContent.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
            <h2 style="margin-bottom: 1rem; color: #059669;">Trial Activated!</h2>
            <p style="margin-bottom: 1rem; color: #6b7280;">
                Your 14-day free trial of <strong>${pricing.name}</strong> has been activated.
            </p>
            <p style="margin-bottom: 1.5rem; color: #6b7280; font-size: 0.9rem;">
                You now have access to all premium features. No charges until your trial ends.
            </p>
            <button onclick="this.closest('.modal').remove(); stripeHandler.activateTrial('${tier}')" 
                    style="padding: 0.75rem 1.5rem; background: #059669; color: white; 
                           border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 600;">
                Start Using BiasGuard Pro
            </button>
        `;
        
        modal.className = 'modal';
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    /**
     * Activate trial subscription
     */
    activateTrial(tier) {
        const pricing = this.pricingTiers[tier];
        
        this.currentSubscription = {
            tier: tier,
            status: 'trial',
            limits: pricing.limits,
            trialStartDate: new Date().toISOString(),
            trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        };
        
        this.saveCurrentSubscription();
        this.updateUsageDisplay();
        
        console.log(`✅ Trial activated for ${tier} plan`);
    }

    // Helper methods
    getUpgradeMessage(requiredFeature) {
        const messages = {
            counterfactual: 'Advanced counterfactual analysis requires a Professional or Enterprise subscription.',
            code: 'Code bias detection is available with Professional and Enterprise plans.',
            neural_howlround: 'Neural howlround prevention is an Enterprise-only feature.',
            usage_limit: 'You\'ve reached your monthly analysis limit. Upgrade to continue using BiasGuard.'
        };
        
        return messages[requiredFeature] || 'This feature requires a subscription upgrade.';
    }

    loadCurrentSubscription() {
        try {
            const stored = localStorage.getItem('biasguard_subscription');
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    saveCurrentSubscription() {
        localStorage.setItem('biasguard_subscription', JSON.stringify(this.currentSubscription));
    }

    updateUsageTracking() {
        const stored = localStorage.getItem('biasguard_usage');
        if (stored) {
            this.usageTracking = { ...this.usageTracking, ...JSON.parse(stored) };
        }
        
        // Reset usage if new month
        const lastReset = new Date(this.usageTracking.lastReset);
        const now = new Date();
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
            this.usageTracking = {
                analysesThisMonth: 0,
                counterfactualAnalyses: 0,
                codeAnalyses: 0,
                lastReset: now.toISOString()
            };
        }
    }

    saveUsageTracking() {
        localStorage.setItem('biasguard_usage', JSON.stringify(this.usageTracking));
    }

    checkTrialStatus() {
        if (this.currentSubscription?.status === 'trial') {
            const trialEnd = new Date(this.currentSubscription.trialEndDate);
            if (new Date() > trialEnd) {
                this.currentSubscription.status = 'expired';
                this.saveCurrentSubscription();
            }
        }
    }

    getTrialDaysRemaining() {
        if (this.currentSubscription?.status === 'trial') {
            const trialEnd = new Date(this.currentSubscription.trialEndDate);
            const now = new Date();
            const daysRemaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
            return Math.max(0, daysRemaining);
        }
        return 0;
    }

    updateUsageDisplay() {
        // Update usage display in UI if elements exist
        const usageElement = document.getElementById('usage-display');
        if (usageElement) {
            const stats = this.getUsageStats();
            usageElement.innerHTML = `
                <div style="font-size: 0.9rem; color: #6b7280; margin-bottom: 0.5rem;">
                    ${stats.subscriptionTier === 'free' ? 'Free Plan' : 
                      stats.subscriptionTier === 'trial' ? `Trial (${stats.trialDaysRemaining} days left)` : 
                      this.pricingTiers[stats.subscriptionTier]?.name || 'Unknown Plan'}
                </div>
                <div style="font-size: 0.8rem; color: #9ca3af;">
                    Analyses: ${stats.basicAnalyses.used}/${stats.basicAnalyses.limit === Infinity ? '∞' : stats.basicAnalyses.limit}
                </div>
            `;
        }
    }
}

// Global instance
if (typeof window !== 'undefined') {
    window.StripeSubscriptionHandler = StripeSubscriptionHandler;
    window.stripeHandler = new StripeSubscriptionHandler();
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StripeSubscriptionHandler;
}