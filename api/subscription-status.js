/**
 * BiasGuards.ai Subscription Status API - Enhanced 2024 Version
 * Retrieves current subscription status, usage, and tier information
 * Integrates with enhanced webhook system for real-time data
 * Features: Usage tracking, tier validation, access control
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Enhanced status response structure
const STATUS_TEMPLATES = {
  active: {
    message: 'Your subscription is active and ready to use',
    color: 'success',
    icon: '✅'
  },
  trialing: {
    message: 'You\'re in your free trial period',
    color: 'info',
    icon: '🎯'
  },
  past_due: {
    message: 'Payment required to continue service',
    color: 'warning',
    icon: '⚠️'
  },
  canceled: {
    message: 'Your subscription has been canceled',
    color: 'error',
    icon: '❌'
  },
  temporary: {
    message: 'You have temporary access',
    color: 'info',
    icon: '⏰'
  },
  none: {
    message: 'No active subscription',
    color: 'neutral',
    icon: '📝'
  }
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerId, sessionId } = req.query;

    if (!customerId && !sessionId) {
      return res.status(400).json({ 
        error: 'Missing required parameter: customerId or sessionId' 
      });
    }

    let customer;
    let subscriptions = [];

    // Get customer info from session ID if provided
    if (sessionId) {
      try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (session.customer) {
          customer = await stripe.customers.retrieve(session.customer);
          const customerSubscriptions = await stripe.subscriptions.list({
            customer: session.customer,
            status: 'all'
          });
          subscriptions = customerSubscriptions.data;
        }
      } catch (sessionError) {
        console.warn('⚠️ Failed to retrieve session:', sessionError.message);
      }
    }

    // Get customer info directly if customerId provided
    if (customerId && !customer) {
      try {
        customer = await stripe.customers.retrieve(customerId);
        const customerSubscriptions = await stripe.subscriptions.list({
          customer: customerId,
          status: 'all'
        });
        subscriptions = customerSubscriptions.data;
      } catch (customerError) {
        console.warn('⚠️ Failed to retrieve customer:', customerError.message);
      }
    }

    // If no customer found, return trial status
    if (!customer) {
      return res.status(200).json({
        subscriptionStatus: 'trial',
        tier: 'starter',
        customerId: null,
        trialEndDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        usage: {
          basic: 0,
          counterfactual: 0,
          neural_howlround: 0
        },
        limits: {
          basic: 100, // Trial limit
          counterfactual: 5,
          neural_howlround: 0
        },
        features: ['basic_analysis'],
        canPerformAnalysis: {
          basic: true,
          counterfactual: true,
          neural_howlround: false
        }
      });
    }

    // Find active subscription
    const activeSubscription = subscriptions.find(sub => 
      sub.status === 'active' || sub.status === 'trialing'
    );

    // Determine tier from subscription
    let tier = 'starter';
    let features = ['basic_analysis'];
    let limits = { basic: 1000, counterfactual: 100, neural_howlround: 0 };

    if (activeSubscription) {
      const priceId = activeSubscription.items.data[0]?.price?.id;
      
      if (priceId === process.env.STRIPE_PRICE_ID_PROFESSIONAL) {
        tier = 'professional';
        features = ['basic_analysis', 'counterfactual_analysis'];
        limits = { basic: 10000, counterfactual: 1000, neural_howlround: 0 };
      } else if (priceId === process.env.STRIPE_PRICE_ID_ENTERPRISE) {
        tier = 'enterprise';
        features = ['basic_analysis', 'counterfactual_analysis', 'neural_howlround'];
        limits = { basic: Infinity, counterfactual: Infinity, neural_howlround: Infinity };
      }
    }

    // Get usage from customer metadata (in real app, this would be from database)
    const usage = {
      basic: parseInt(customer.metadata.usage_basic || '0'),
      counterfactual: parseInt(customer.metadata.usage_counterfactual || '0'),
      neural_howlround: parseInt(customer.metadata.usage_neural_howlround || '0')
    };

    // Calculate remaining usage
    const remaining = {
      basic: limits.basic === Infinity ? Infinity : Math.max(0, limits.basic - usage.basic),
      counterfactual: limits.counterfactual === Infinity ? Infinity : Math.max(0, limits.counterfactual - usage.counterfactual),
      neural_howlround: limits.neural_howlround === Infinity ? Infinity : Math.max(0, limits.neural_howlround - usage.neural_howlround)
    };

    // Determine what analyses can be performed
    const canPerformAnalysis = {
      basic: remaining.basic > 0,
      counterfactual: features.includes('counterfactual_analysis') && remaining.counterfactual > 0,
      neural_howlround: features.includes('neural_howlround') && remaining.neural_howlround > 0
    };

    const response = {
      subscriptionStatus: activeSubscription ? activeSubscription.status : 'inactive',
      tier: tier,
      customerId: customer.id,
      subscriptionId: activeSubscription?.id || null,
      currentPeriodStart: activeSubscription ? new Date(activeSubscription.current_period_start * 1000).toISOString() : null,
      currentPeriodEnd: activeSubscription ? new Date(activeSubscription.current_period_end * 1000).toISOString() : null,
      trialEnd: activeSubscription?.trial_end ? new Date(activeSubscription.trial_end * 1000).toISOString() : null,
      usage: usage,
      limits: limits,
      remaining: remaining,
      features: features,
      canPerformAnalysis: canPerformAnalysis,
      billingPortalUrl: `/api/customer-portal?customerId=${customer.id}`
    };

    console.log(`✅ Subscription status retrieved for customer: ${customer.id}`);
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Subscription status retrieval failed:', error);
    return res.status(500).json({ 
      error: 'Failed to retrieve subscription status',
      details: error.message
    });
  }
}