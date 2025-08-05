/**
 * BiasGuards.ai Usage Tracking API
 * Tracks analysis usage for subscription billing and limits
 * Updates customer metadata in Stripe for persistence
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, analysisType, sessionId } = req.body;

    if (!customerId && !sessionId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: customerId or sessionId' 
      });
    }

    if (!analysisType || !['basic', 'counterfactual', 'neural_howlround'].includes(analysisType)) {
      return res.status(400).json({ 
        error: 'Invalid analysisType. Must be: basic, counterfactual, or neural_howlround' 
      });
    }

    let targetCustomerId = customerId;

    // Get customer ID from session if not provided directly
    if (!targetCustomerId && sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        targetCustomerId = session.customer;
      } catch (sessionError) {
        console.warn('⚠️ Failed to retrieve session for usage tracking:', sessionError.message);
      }
    }

    // If no customer found, this is likely a trial user - track in session storage
    if (!targetCustomerId) {
      return res.status(200).json({
        success: true,
        message: 'Usage tracked for trial user',
        tracked: analysisType,
        customerId: null,
        isTrialUser: true
      });
    }

    // Get current customer data
    const customer = await stripe.customers.retrieve(targetCustomerId);
    
    // Get current usage from metadata
    const currentUsage = {
      basic: parseInt(customer.metadata.usage_basic || '0'),
      counterfactual: parseInt(customer.metadata.usage_counterfactual || '0'),
      neural_howlround: parseInt(customer.metadata.usage_neural_howlround || '0')
    };

    // Increment the specific analysis type
    currentUsage[analysisType] += 1;

    // Update customer metadata with new usage
    const updatedCustomer = await stripe.customers.update(targetCustomerId, {
      metadata: {
        ...customer.metadata,
        usage_basic: currentUsage.basic.toString(),
        usage_counterfactual: currentUsage.counterfactual.toString(),
        usage_neural_howlround: currentUsage.neural_howlround.toString(),
        last_usage_update: new Date().toISOString()
      }
    });

    // Get subscription info for limit checking
    const subscriptions = await stripe.subscriptions.list({
      customer: targetCustomerId,
      status: 'active'
    });

    const activeSubscription = subscriptions.data[0];
    let tier = 'starter';
    let limits = { basic: 1000, counterfactual: 100, neural_howlround: 0 };

    if (activeSubscription) {
      const priceId = activeSubscription.items.data[0]?.price?.id;
      
      if (priceId === process.env.STRIPE_PRICE_ID_PROFESSIONAL) {
        tier = 'professional';
        limits = { basic: 10000, counterfactual: 1000, neural_howlround: 0 };
      } else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) {
        tier = 'enterprise';
        limits = { basic: Infinity, counterfactual: Infinity, neural_howlround: Infinity };
      }
    }

    // Calculate remaining usage
    const remaining = {
      basic: limits.basic === Infinity ? Infinity : Math.max(0, limits.basic - currentUsage.basic),
      counterfactual: limits.counterfactual === Infinity ? Infinity : Math.max(0, limits.counterfactual - currentUsage.counterfactual),
      neural_howlround: limits.neural_howlround === Infinity ? Infinity : Math.max(0, limits.neural_howlround - currentUsage.neural_howlround)
    };

    // Check if user is approaching limits (90% usage)
    const warnings = [];
    Object.keys(limits).forEach(type => {
      if (limits[type] !== Infinity) {
        const usagePercent = (currentUsage[type] / limits[type]) * 100;
        if (usagePercent >= 90) {
          warnings.push({
            type: type,
            usage: currentUsage[type],
            limit: limits[type],
            percent: Math.round(usagePercent)
          });
        }
      }
    });

    const response = {
      success: true,
      message: `${analysisType} analysis usage tracked`,
      tracked: analysisType,
      customerId: targetCustomerId,
      tier: tier,
      currentUsage: currentUsage,
      limits: limits,
      remaining: remaining,
      warnings: warnings,
      isTrialUser: false
    };

    console.log(`✅ Usage tracked: ${analysisType} for customer ${targetCustomerId} (${tier})`);
    
    // Log warnings if approaching limits
    if (warnings.length > 0) {
      console.log(`⚠️ Usage warnings for ${targetCustomerId}:`, warnings);
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Usage tracking failed:', error);
    return res.status(500).json({ 
      error: 'Failed to track usage',
      details: error.message
    });
  }
}